import { useEffect, useMemo, useRef, useState } from "react";

type Step = 1 | 2 | 3;
type Contact = { fullName: string; email: string; phone: string; zip: string };
type Loan = { homeValue: string; currentBalance: string; creditRange: string };
type Consent = { agreed: boolean };

type QuoteData = {
  estimatedRate: number;
  monthlyPayment: number;
  refreshedAt: string;
};

type QuoteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "stale"; data: QuoteData; staleAt: string }
  | { status: "ready"; data: QuoteData }
  | { status: "error"; message: string; data?: QuoteData; staleAt?: string };

type Advisor = { id: string; name: string; availableSlots: number };
type AdvisorState = {
  status: "idle" | "connecting" | "connected" | "reconnecting" | "error";
  advisors: Advisor[];
  lastSeq: number;
  lastUpdated: string | null;
  errorMessage: string;
};

type UploadState = {
  status: "idle" | "uploading" | "uploaded" | "error" | "canceled";
  progress: number;
  fileName: string;
  fileId: string;
  error: string;
};

type RuntimeConfig = {
  release: string;
  featureFlags: {
    uploads: boolean;
    advisorFeed: boolean;
  };
};

type ClientEvent = {
  eventType: "funnel_view" | "step_advanced" | "validation_failed" | "lead_submitted" | "async_failure";
  step: Step;
  details?: Record<string, string | number | boolean>;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4010";
const WS_BASE = API_BASE.replace(/^http/i, "ws");
const SCENARIO_ID = "SCN-001";
const SCENARIO_VERSION = "1.0.0";
const MAX_SUBMIT_ATTEMPTS = 3;
const DRAFT_STORAGE_KEY = "scn001:funnel-draft:v1";

type DraftPayload = {
  step: Step;
  contact: Contact;
  loan: Loan;
  consent: Consent;
  uploadedAttachment?: { fileName: string; fileId: string };
  savedAt: string;
};

function validateContact(v: Contact) {
  const errors: Partial<Record<keyof Contact, string>> = {};
  if (v.fullName.trim().length < 2) errors.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email.";
  if (!/^\d{10}$/.test(v.phone.replace(/\D/g, ""))) errors.phone = "Enter a 10-digit phone.";
  if (!/^\d{5}$/.test(v.zip)) errors.zip = "Enter a valid ZIP code.";
  return errors;
}

function validateLoan(v: Loan) {
  const errors: Partial<Record<keyof Loan, string>> = {};
  const homeValue = Number(v.homeValue);
  const currentBalance = Number(v.currentBalance);

  if (!Number.isFinite(homeValue) || homeValue < 50000) {
    errors.homeValue = "Home value must be at least $50,000.";
  }
  if (!Number.isFinite(currentBalance) || currentBalance < 0) {
    errors.currentBalance = "Current balance must be zero or greater.";
  }
  if (Number.isFinite(homeValue) && Number.isFinite(currentBalance) && currentBalance > homeValue) {
    errors.currentBalance = "Current balance cannot exceed home value.";
  }
  if (!v.creditRange) {
    errors.creditRange = "Select a credit range.";
  }
  return errors;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}

function shouldRetryStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function cacheKey(contact: Contact, loan: Loan) {
  return `scn001:quote:${contact.zip}:${loan.creditRange}:${loan.homeValue}:${loan.currentBalance}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatRate(value: number) {
  return `${value.toFixed(2)}%`;
}

export function App() {
  const [step, setStep] = useState<Step>(1);
  const [contact, setContact] = useState<Contact>({ fullName: "", email: "", phone: "", zip: "" });
  const [loan, setLoan] = useState<Loan>({ homeValue: "", currentBalance: "", creditRange: "" });
  const [consent, setConsent] = useState<Consent>({ agreed: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimeConfig>({
    release: "local",
    featureFlags: { uploads: true, advisorFeed: true }
  });
  const [isOnline, setIsOnline] = useState<boolean>(window.navigator.onLine);

  const [quoteState, setQuoteState] = useState<QuoteState>({ status: "idle" });
  const [quoteRefreshNonce, setQuoteRefreshNonce] = useState(0);

  const [advisorState, setAdvisorState] = useState<AdvisorState>({
    status: "idle",
    advisors: [],
    lastSeq: 0,
    lastUpdated: null,
    errorMessage: ""
  });

  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    fileName: "",
    fileId: "",
    error: ""
  });

  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const uploadRef = useRef<XMLHttpRequest | null>(null);
  const lastAdvisorSeqRef = useRef(0);

  const trackingPayload = useMemo(
    () => ({
      scenarioId: SCENARIO_ID,
      scenarioVersion: SCENARIO_VERSION,
      step,
      timestamp: new Date().toISOString(),
      release: runtimeConfig.release,
      online: isOnline
    }),
    [step, runtimeConfig.release, isOnline]
  );

  function emitClientEvent(event: ClientEvent) {
    const payload = {
      scenarioId: SCENARIO_ID,
      scenarioVersion: SCENARIO_VERSION,
      timestamp: new Date().toISOString(),
      ...event
    };

    const serialized = JSON.stringify(payload);
    const blob = new Blob([serialized], { type: "application/json" });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_BASE}/api/client-events`, blob);
      return;
    }

    fetch(`${API_BASE}/api/client-events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: serialized
    }).catch(() => {
      // Non-blocking telemetry path.
    });
  }

  useEffect(() => {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as DraftPayload;
      setStep(draft.step);
      setContact(draft.contact);
      setLoan(draft.loan);
      setConsent(draft.consent);
      if (draft.uploadedAttachment) {
        setUploadState({
          status: "uploaded",
          progress: 100,
          fileName: draft.uploadedAttachment.fileName,
          fileId: draft.uploadedAttachment.fileId,
          error: ""
        });
      }
      setStatusMessage("Recovered in-progress form after refresh.");
    } catch {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      setStatusMessage("Saved form data was corrupted and has been reset.");
      emitClientEvent({ eventType: "async_failure", step: 1, details: { action: "draft_restore", reason: "corrupted" } });
    }
  }, []);

  useEffect(() => {
    const draft: DraftPayload = {
      step,
      contact,
      loan,
      consent,
      savedAt: new Date().toISOString()
    };

    if (uploadState.status === "uploaded") {
      draft.uploadedAttachment = { fileName: uploadState.fileName, fileId: uploadState.fileId };
    }

    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [step, contact, loan, consent, uploadState.status, uploadState.fileName, uploadState.fileId]);

  useEffect(() => {
    fetch(`${API_BASE}/api/runtime-config`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("runtime_config_fetch_failed"))))
      .then((json: RuntimeConfig) => {
        setRuntimeConfig(json);
      })
      .catch(() => {
        setRuntimeConfig({ release: "fallback-local", featureFlags: { uploads: true, advisorFeed: true } });
      });
  }, []);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      setStatusMessage("Connection restored.");
    };
    const onOffline = () => {
      setIsOnline(false);
      setStatusMessage("You are offline. You can continue filling the form, but submission is disabled.");
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    emitClientEvent({ eventType: "funnel_view", step });
  }, [step]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus();
      emitClientEvent({ eventType: "validation_failed", step, details: { count: Object.keys(errors).length } });
    }
  }, [errors, step]);

  useEffect(() => {
    if (step < 2) {
      setQuoteState({ status: "idle" });
      return;
    }

    if (!contact.zip || !loan.homeValue || !loan.currentBalance || !loan.creditRange) {
      setQuoteState({ status: "idle" });
      return;
    }

    let isActive = true;
    const key = cacheKey(contact, loan);
    const cachedRaw = window.localStorage.getItem(key);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as { data: QuoteData; storedAt: string };
        setQuoteState({ status: "stale", data: cached.data, staleAt: cached.storedAt });
      } catch {
        window.localStorage.removeItem(key);
        setQuoteState({ status: "loading" });
      }
    } else {
      setQuoteState({ status: "loading" });
    }

    const url = new URL(`${API_BASE}/api/panels/rate-quote`);
    url.searchParams.set("zip", contact.zip);
    url.searchParams.set("creditRange", loan.creditRange);
    url.searchParams.set("homeValue", loan.homeValue);
    url.searchParams.set("currentBalance", loan.currentBalance);

    fetchWithTimeout(url.toString(), { method: "GET" }, 5000)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`quote_fetch_${res.status}`);
        }
        const data = (await res.json()) as QuoteData;
        if (!isActive) return;
        setQuoteState({ status: "ready", data });
        window.localStorage.setItem(key, JSON.stringify({ data, storedAt: new Date().toISOString() }));
      })
      .catch((err: unknown) => {
        if (!isActive) return;
        setQuoteState((prev) => {
          if (prev.status === "stale") {
            return {
              status: "error",
              message: "Live quote unavailable. Showing cached estimate.",
              data: prev.data,
              staleAt: prev.staleAt
            };
          }
          return { status: "error", message: "Unable to load estimated rate right now." };
        });
        emitClientEvent({
          eventType: "async_failure",
          step,
          details: { panel: "rate_quote", reason: err instanceof Error ? err.message : "unknown" }
        });
      });

    return () => {
      isActive = false;
    };
  }, [API_BASE, contact, loan, step, quoteRefreshNonce]);

  useEffect(() => {
    if (!runtimeConfig.featureFlags.advisorFeed) {
      setAdvisorState((prev) => ({ ...prev, status: "idle" }));
      return;
    }
    if (!isOnline) {
      setAdvisorState((prev) => ({ ...prev, status: "error", errorMessage: "Offline" }));
      return;
    }

    let disposed = false;
    let reconnectTimer = 0;
    let reconnectAttempt = 0;

    const resync = async (afterSeq: number) => {
      try {
        const url = new URL(`${API_BASE}/api/advisor-availability/resync`);
        url.searchParams.set("after", String(afterSeq));
        const res = await fetchWithTimeout(url.toString(), { method: "GET" }, 3500);
        if (!res.ok) return;
        const payload = (await res.json()) as { seq: number; advisors: Advisor[] };
        lastAdvisorSeqRef.current = payload.seq;
        setAdvisorState((prev) => ({
          ...prev,
          advisors: payload.advisors,
          lastSeq: payload.seq,
          lastUpdated: new Date().toISOString(),
          errorMessage: ""
        }));
      } catch {
        setAdvisorState((prev) => ({ ...prev, errorMessage: "Resync failed" }));
      }
    };

    const connect = () => {
      if (disposed) return;

      setAdvisorState((prev) => ({
        ...prev,
        status: reconnectAttempt === 0 ? "connecting" : "reconnecting",
        errorMessage: ""
      }));

      const ws = new WebSocket(`${WS_BASE}/ws/advisor-availability`);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempt = 0;
        setAdvisorState((prev) => ({ ...prev, status: "connected", errorMessage: "" }));
        void resync(lastAdvisorSeqRef.current);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(String(event.data)) as
            | { type: "heartbeat" }
            | { type: "snapshot"; seq: number; advisors: Advisor[] }
            | { type: "availability"; seq: number; advisors: Advisor[] };

          if (payload.type === "heartbeat") {
            return;
          }

          if (payload.type === "snapshot") {
            lastAdvisorSeqRef.current = payload.seq;
            setAdvisorState((prev) => ({
              ...prev,
              advisors: payload.advisors,
              lastSeq: payload.seq,
              lastUpdated: new Date().toISOString()
            }));
            return;
          }

          if (payload.seq > lastAdvisorSeqRef.current + 1) {
            void resync(lastAdvisorSeqRef.current);
            return;
          }

          lastAdvisorSeqRef.current = payload.seq;
          setAdvisorState((prev) => ({
            ...prev,
            advisors: payload.advisors,
            lastSeq: payload.seq,
            lastUpdated: new Date().toISOString()
          }));
        } catch {
          setAdvisorState((prev) => ({ ...prev, errorMessage: "Invalid realtime payload" }));
        }
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        if (disposed) return;
        reconnectAttempt += 1;
        const backoff = Math.min(1000 * 2 ** (reconnectAttempt - 1), 8000) + Math.floor(Math.random() * 300);
        setAdvisorState((prev) => ({
          ...prev,
          status: "reconnecting",
          errorMessage: `Disconnected. Reconnecting in ${Math.ceil(backoff / 1000)}s.`
        }));
        reconnectTimer = window.setTimeout(() => connect(), backoff);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [API_BASE, WS_BASE, isOnline, runtimeConfig.featureFlags.advisorFeed]);

  function goToStep(nextStep: Step, source: "manual" | "validation") {
    setStep(nextStep);
    setErrors({});
    emitClientEvent({ eventType: "step_advanced", step: nextStep, details: { source } });
  }

  function startUpload(file: File) {
    if (!runtimeConfig.featureFlags.uploads) return;

    if (uploadRef.current) {
      uploadRef.current.abort();
    }

    const xhr = new XMLHttpRequest();
    uploadRef.current = xhr;

    setUploadState({ status: "uploading", progress: 0, fileName: file.name, fileId: "", error: "" });

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      setUploadState((prev) => ({ ...prev, status: "uploading", progress }));
    };

    xhr.onerror = () => {
      setUploadState((prev) => ({
        status: "error",
        progress: prev.progress,
        fileName: prev.fileName,
        fileId: "",
        error: "Upload failed due to network error."
      }));
    };

    xhr.onabort = () => {
      setUploadState((prev) => ({
        status: "canceled",
        progress: prev.progress,
        fileName: prev.fileName,
        fileId: "",
        error: "Upload canceled."
      }));
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        setUploadState((prev) => ({
          status: "error",
          progress: prev.progress,
          fileName: prev.fileName,
          fileId: "",
          error: `Upload failed (${xhr.status}).`
        }));
        return;
      }
      const parsed = JSON.parse(xhr.responseText) as { fileId: string };
      setUploadState((prev) => ({
        status: "uploaded",
        progress: 100,
        fileName: prev.fileName,
        fileId: parsed.fileId,
        error: ""
      }));
    };

    const form = new FormData();
    form.append("document", file);
    xhr.open("POST", `${API_BASE}/api/uploads`);
    xhr.setRequestHeader("x-scenario-id", SCENARIO_ID);
    xhr.send(form);
  }

  function cancelUpload() {
    if (uploadRef.current) {
      uploadRef.current.abort();
      uploadRef.current = null;
    }
  }

  async function submit() {
    setErrors({});

    if (!isOnline) {
      setStatusMessage("Submission blocked while offline.");
      return;
    }

    if (!consent.agreed) {
      setErrors({ agreed: "You must agree before submitting." });
      return;
    }

    setStatusMessage("Submitting application...");
    setSubmitAttempt(0);
    setIsSubmitting(true);

    const idempotencyKey = crypto.randomUUID();
    const payload = {
      scenarioId: SCENARIO_ID,
      scenarioVersion: SCENARIO_VERSION,
      idempotencyKey,
      contact,
      loan: {
        homeValue: Number(loan.homeValue),
        currentBalance: Number(loan.currentBalance),
        creditRange: loan.creditRange
      },
      consent: {
        agreed: consent.agreed,
        timestamp: new Date().toISOString()
      },
      attachments: uploadState.status === "uploaded" ? [{ type: "income-document", fileId: uploadState.fileId }] : []
    };

    let lastError = "unknown";
    let attemptsUsed = 0;

    for (let attempt = 1; attempt <= MAX_SUBMIT_ATTEMPTS; attempt += 1) {
      attemptsUsed = attempt;
      setSubmitAttempt(attempt);
      try {
        const res = await fetchWithTimeout(
          `${API_BASE}/api/leads/submit`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
          },
          7000
        );

        if (res.ok) {
          const json = (await res.json()) as { trackingId: string };
          emitClientEvent({
            eventType: "lead_submitted",
            step,
            details: { attempts: attempt, trackingId: json.trackingId }
          });
          setStatusMessage(`Application received. Tracking ID: ${json.trackingId}`);
          setIsSubmitting(false);
          setStep(1);
          setContact({ fullName: "", email: "", phone: "", zip: "" });
          setLoan({ homeValue: "", currentBalance: "", creditRange: "" });
          setConsent({ agreed: false });
          setUploadState({ status: "idle", progress: 0, fileName: "", fileId: "", error: "" });
          window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
          return;
        }

        lastError = `http_${res.status}`;
        if (!shouldRetryStatus(res.status)) {
          break;
        }
      } catch {
        lastError = "network_or_timeout";
      }

      if (attempt < MAX_SUBMIT_ATTEMPTS) {
        const backoffMs = Math.min(350 * 2 ** (attempt - 1), 2000) + Math.floor(Math.random() * 120);
        setStatusMessage(`Retrying submission (attempt ${attempt + 1}/${MAX_SUBMIT_ATTEMPTS})...`);
        await wait(backoffMs);
      }
    }

    emitClientEvent({
      eventType: "async_failure",
      step,
      details: { action: "lead_submit", reason: lastError, attempts: attemptsUsed }
    });

    setStatusMessage("Submission failed after retries. Please review details and try again.");
    setIsSubmitting(false);
  }

  const hasQuoteInputs = Boolean(contact.zip && loan.homeValue && loan.currentBalance && loan.creditRange);

  return (
    <main>
      {!isOnline && (
        <div className="offline-banner" role="status" aria-live="polite">
          You are offline. Form input is available, but submission and realtime data are paused.
        </div>
      )}

      <header className="header">
        <h1>SCN-001 Mortgage Refinance Lead Funnel</h1>
        <p className="meta">Release: {runtimeConfig.release}</p>
      </header>

      <div className="layout">
        <section className="funnel" aria-labelledby="step-title">
          <h2 id="step-title" tabIndex={-1} ref={headingRef}>
            {step === 1 && "Step 1 of 3: Contact"}
            {step === 2 && "Step 2 of 3: Loan Profile"}
            {step === 3 && "Step 3 of 3: Consent + Submit"}
          </h2>

          {Object.keys(errors).length > 0 && (
            <div className="error-summary" role="alert" tabIndex={-1} ref={errorSummaryRef}>
              <p>Fix the following before continuing:</p>
              <ul>
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <section>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                autoComplete="name"
                value={contact.fullName}
                onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "error-fullName" : undefined}
              />
              {errors.fullName && (
                <p className="error" id="error-fullName">
                  {errors.fullName}
                </p>
              )}

              <label htmlFor="email">Email</label>
              <input
                id="email"
                autoComplete="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              {errors.email && (
                <p className="error" id="error-email">
                  {errors.email}
                </p>
              )}

              <label htmlFor="phone">Phone (10 digits)</label>
              <input
                id="phone"
                inputMode="numeric"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "error-phone" : undefined}
              />
              {errors.phone && (
                <p className="error" id="error-phone">
                  {errors.phone}
                </p>
              )}

              <label htmlFor="zip">ZIP</label>
              <input
                id="zip"
                inputMode="numeric"
                value={contact.zip}
                onChange={(e) => setContact({ ...contact, zip: e.target.value })}
                aria-invalid={Boolean(errors.zip)}
                aria-describedby={errors.zip ? "error-zip" : undefined}
              />
              {errors.zip && (
                <p className="error" id="error-zip">
                  {errors.zip}
                </p>
              )}

              <div className="actions">
                <button
                  onClick={() => {
                    const nextErrors = validateContact(contact);
                    setErrors(nextErrors as Record<string, string>);
                    if (Object.keys(nextErrors).length === 0) {
                      goToStep(2, "validation");
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <label htmlFor="homeValue">Estimated Home Value</label>
              <input
                id="homeValue"
                type="number"
                value={loan.homeValue}
                onChange={(e) => setLoan({ ...loan, homeValue: e.target.value })}
                aria-invalid={Boolean(errors.homeValue)}
                aria-describedby={errors.homeValue ? "error-homeValue" : undefined}
              />
              {errors.homeValue && (
                <p className="error" id="error-homeValue">
                  {errors.homeValue}
                </p>
              )}

              <label htmlFor="currentBalance">Current Loan Balance</label>
              <input
                id="currentBalance"
                type="number"
                value={loan.currentBalance}
                onChange={(e) => setLoan({ ...loan, currentBalance: e.target.value })}
                aria-invalid={Boolean(errors.currentBalance)}
                aria-describedby={errors.currentBalance ? "error-currentBalance" : undefined}
              />
              {errors.currentBalance && (
                <p className="error" id="error-currentBalance">
                  {errors.currentBalance}
                </p>
              )}

              <label htmlFor="creditRange">Credit Range</label>
              <select
                id="creditRange"
                value={loan.creditRange}
                onChange={(e) => setLoan({ ...loan, creditRange: e.target.value })}
                aria-invalid={Boolean(errors.creditRange)}
                aria-describedby={errors.creditRange ? "error-creditRange" : undefined}
              >
                <option value="">Select one</option>
                <option value="760+">760+</option>
                <option value="720-759">720-759</option>
                <option value="680-719">680-719</option>
                <option value="below-680">Below 680</option>
              </select>
              {errors.creditRange && (
                <p className="error" id="error-creditRange">
                  {errors.creditRange}
                </p>
              )}

              <div className="actions">
                <button className="secondary" onClick={() => goToStep(1, "manual")}>
                  Back
                </button>
                <button
                  onClick={() => {
                    const nextErrors = validateLoan(loan);
                    setErrors(nextErrors as Record<string, string>);
                    if (Object.keys(nextErrors).length === 0) {
                      goToStep(3, "validation");
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              {runtimeConfig.featureFlags.uploads && (
                <div className="upload-block">
                  <label htmlFor="incomeDocument">Optional income document upload (PDF/JPG/PNG)</label>
                  <input
                    id="incomeDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) startUpload(file);
                    }}
                  />

                  {uploadState.status === "uploading" && (
                    <div>
                      <p>Uploading {uploadState.fileName}: {uploadState.progress}%</p>
                      <progress value={uploadState.progress} max={100} />
                      <button className="secondary" onClick={cancelUpload}>Cancel Upload</button>
                    </div>
                  )}

                  {uploadState.status === "uploaded" && <p className="ok">Upload complete: {uploadState.fileName}</p>}
                  {uploadState.status === "error" && <p className="error">{uploadState.error}</p>}
                  {uploadState.status === "canceled" && <p className="error">{uploadState.error}</p>}
                </div>
              )}

              <label htmlFor="agreed" className="checkbox-row">
                <input
                  id="agreed"
                  type="checkbox"
                  checked={consent.agreed}
                  onChange={(e) => setConsent({ agreed: e.target.checked })}
                  aria-invalid={Boolean(errors.agreed)}
                  aria-describedby={errors.agreed ? "error-agreed" : undefined}
                />
                I agree to be contacted for refinance options.
              </label>
              {errors.agreed && (
                <p className="error" id="error-agreed">
                  {errors.agreed}
                </p>
              )}

              <div className="actions">
                <button className="secondary" onClick={() => goToStep(2, "manual")} disabled={isSubmitting}>
                  Back
                </button>
                <button onClick={submit} disabled={isSubmitting || !isOnline}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </section>
          )}

          <p className="status" role="status" aria-live="polite">
            {statusMessage}
            {isSubmitting && ` Attempt ${submitAttempt}/${MAX_SUBMIT_ATTEMPTS}.`}
          </p>

          <details>
            <summary>Trace payload</summary>
            <pre>{JSON.stringify(trackingPayload, null, 2)}</pre>
          </details>
        </section>

        <aside className="panel-stack" aria-label="Support panels">
          <section className="panel">
            <header>
              <h3>Estimated Rate Panel</h3>
              <button className="secondary compact" onClick={() => setQuoteRefreshNonce((v) => v + 1)}>
                Refresh
              </button>
            </header>

            {!hasQuoteInputs && <p className="muted">Enter ZIP, home value, balance, and credit range to load estimate.</p>}

            {hasQuoteInputs && quoteState.status === "loading" && <p className="muted">Loading estimate...</p>}
            {quoteState.status === "stale" && (
              <div>
                <p className="muted">Showing cached estimate while refreshing.</p>
                <p>Rate: <strong>{formatRate(quoteState.data.estimatedRate)}</strong></p>
                <p>Monthly payment: <strong>{formatCurrency(quoteState.data.monthlyPayment)}</strong></p>
              </div>
            )}
            {quoteState.status === "ready" && (
              <div>
                <p>Rate: <strong>{formatRate(quoteState.data.estimatedRate)}</strong></p>
                <p>Monthly payment: <strong>{formatCurrency(quoteState.data.monthlyPayment)}</strong></p>
                <p className="muted">Updated: {new Date(quoteState.data.refreshedAt).toLocaleTimeString()}</p>
              </div>
            )}
            {quoteState.status === "error" && (
              <div>
                <p className="error">{quoteState.message}</p>
                {quoteState.data && (
                  <>
                    <p>Cached rate: <strong>{formatRate(quoteState.data.estimatedRate)}</strong></p>
                    <p>Cached payment: <strong>{formatCurrency(quoteState.data.monthlyPayment)}</strong></p>
                    {quoteState.staleAt && <p className="muted">Cached at: {new Date(quoteState.staleAt).toLocaleString()}</p>}
                  </>
                )}
              </div>
            )}
          </section>

          <section className="panel">
            <header>
              <h3>Advisor Availability</h3>
            </header>

            <p className="muted">Connection: {advisorState.status}</p>
            {advisorState.errorMessage && <p className="error">{advisorState.errorMessage}</p>}

            {advisorState.advisors.length === 0 ? (
              <p className="muted">No advisor availability yet.</p>
            ) : (
              <ul className="advisor-list">
                {advisorState.advisors.map((advisor) => (
                  <li key={advisor.id}>
                    <span>{advisor.name}</span>
                    <strong>{advisor.availableSlots} slots</strong>
                  </li>
                ))}
              </ul>
            )}

            {advisorState.lastUpdated && (
              <p className="muted">Last update: {new Date(advisorState.lastUpdated).toLocaleTimeString()}</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
