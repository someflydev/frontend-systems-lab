import { useMemo, useState } from "react";

type Contact = { fullName: string; email: string; phone: string; zip: string };
type Loan = { homeValue: string; currentBalance: string; creditRange: string };
type Consent = { agreed: boolean };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4010";

function validateContact(v: Contact) {
  const errors: Partial<Record<keyof Contact, string>> = {};
  if (v.fullName.trim().length < 2) errors.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email.";
  if (!/^\d{10}$/.test(v.phone.replace(/\D/g, ""))) errors.phone = "Enter a 10-digit phone.";
  if (!/^\d{5}$/.test(v.zip)) errors.zip = "Enter a valid ZIP.";
  return errors;
}

function validateLoan(v: Loan) {
  const errors: Partial<Record<keyof Loan, string>> = {};
  const homeValue = Number(v.homeValue);
  const currentBalance = Number(v.currentBalance);
  if (!Number.isFinite(homeValue) || homeValue < 50000) errors.homeValue = "Home value must be at least $50,000.";
  if (!Number.isFinite(currentBalance) || currentBalance < 0 || currentBalance > homeValue) {
    errors.currentBalance = "Current balance must be >= 0 and <= home value.";
  }
  if (!v.creditRange) errors.creditRange = "Select a credit range.";
  return errors;
}

export function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contact, setContact] = useState<Contact>({ fullName: "", email: "", phone: "", zip: "" });
  const [loan, setLoan] = useState<Loan>({ homeValue: "", currentBalance: "", creditRange: "" });
  const [consent, setConsent] = useState<Consent>({ agreed: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>("");

  const trackingPayload = useMemo(() => ({
    scenarioId: "SCN-001",
    scenarioVersion: "1.0.0",
    step,
    timestamp: new Date().toISOString()
  }), [step]);

  async function submit() {
    setErrors({});
    if (!consent.agreed) {
      setErrors({ agreed: "You must agree before submitting." });
      return;
    }

    setStatus("Submitting...");
    const payload = {
      scenarioId: "SCN-001",
      scenarioVersion: "1.0.0",
      idempotencyKey: crypto.randomUUID(),
      contact,
      loan: {
        homeValue: Number(loan.homeValue),
        currentBalance: Number(loan.currentBalance),
        creditRange: loan.creditRange
      },
      consent: {
        agreed: consent.agreed,
        timestamp: new Date().toISOString()
      }
    };

    try {
      const res = await fetch(`${API_BASE}/api/leads/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        setStatus("Submission failed. Retry.");
        return;
      }
      const json = await res.json();
      setStatus(`Success. Tracking ID: ${json.trackingId}`);
      setStep(1);
      setContact({ fullName: "", email: "", phone: "", zip: "" });
      setLoan({ homeValue: "", currentBalance: "", creditRange: "" });
      setConsent({ agreed: false });
    } catch {
      setStatus("Network error. Retry.");
    }
  }

  return (
    <main>
      <h1>SCN-001 Refinance Funnel (React TS)</h1>
      <p className="meta">{JSON.stringify(trackingPayload)}</p>

      {step === 1 && (
        <section>
          <label>Full Name<input value={contact.fullName} onChange={(e) => setContact({ ...contact, fullName: e.target.value })} /></label>
          {errors.fullName && <p className="error">{errors.fullName}</p>}
          <label>Email<input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></label>
          {errors.email && <p className="error">{errors.email}</p>}
          <label>Phone<input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></label>
          {errors.phone && <p className="error">{errors.phone}</p>}
          <label>ZIP<input value={contact.zip} onChange={(e) => setContact({ ...contact, zip: e.target.value })} /></label>
          {errors.zip && <p className="error">{errors.zip}</p>}
          <button onClick={() => {
            const nextErrors = validateContact(contact);
            setErrors(nextErrors as Record<string, string>);
            if (Object.keys(nextErrors).length === 0) setStep(2);
          }}>Continue</button>
        </section>
      )}

      {step === 2 && (
        <section>
          <label>Home Value<input type="number" value={loan.homeValue} onChange={(e) => setLoan({ ...loan, homeValue: e.target.value })} /></label>
          {errors.homeValue && <p className="error">{errors.homeValue}</p>}
          <label>Current Balance<input type="number" value={loan.currentBalance} onChange={(e) => setLoan({ ...loan, currentBalance: e.target.value })} /></label>
          {errors.currentBalance && <p className="error">{errors.currentBalance}</p>}
          <label>Credit Range
            <select value={loan.creditRange} onChange={(e) => setLoan({ ...loan, creditRange: e.target.value })}>
              <option value="">Select one</option>
              <option value="760+">760+</option>
              <option value="720-759">720-759</option>
              <option value="680-719">680-719</option>
              <option value="below-680">Below 680</option>
            </select>
          </label>
          {errors.creditRange && <p className="error">{errors.creditRange}</p>}
          <div className="actions">
            <button className="secondary" onClick={() => setStep(1)}>Back</button>
            <button onClick={() => {
              const nextErrors = validateLoan(loan);
              setErrors(nextErrors as Record<string, string>);
              if (Object.keys(nextErrors).length === 0) setStep(3);
            }}>Continue</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <label><input type="checkbox" checked={consent.agreed} onChange={(e) => setConsent({ agreed: e.target.checked })} /> I agree to be contacted.</label>
          {errors.agreed && <p className="error">{errors.agreed}</p>}
          <div className="actions">
            <button className="secondary" onClick={() => setStep(2)}>Back</button>
            <button onClick={submit}>Submit</button>
          </div>
        </section>
      )}

      {status && <p className="status">{status}</p>}
    </main>
  );
}
