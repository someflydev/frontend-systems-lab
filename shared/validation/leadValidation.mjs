const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;
const ZIP_RE = /^\d{5}$/;

export function validateContact(contact = {}) {
  const errors = {};
  if (!contact.fullName || contact.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }
  if (!EMAIL_RE.test(contact.email || "")) {
    errors.email = "Enter a valid email address.";
  }
  if (!PHONE_RE.test((contact.phone || "").replace(/\D/g, ""))) {
    errors.phone = "Enter a 10-digit phone number.";
  }
  if (!ZIP_RE.test(contact.zip || "")) {
    errors.zip = "Enter a valid 5-digit ZIP code.";
  }
  return errors;
}

export function validateLoan(loan = {}) {
  const errors = {};
  const homeValue = Number(loan.homeValue);
  const currentBalance = Number(loan.currentBalance);
  if (!Number.isFinite(homeValue) || homeValue < 50000) {
    errors.homeValue = "Home value must be at least $50,000.";
  }
  if (!Number.isFinite(currentBalance) || currentBalance < 0) {
    errors.currentBalance = "Current balance must be zero or greater.";
  }
  if (Number.isFinite(homeValue) && Number.isFinite(currentBalance) && currentBalance > homeValue) {
    errors.currentBalance = "Current balance cannot exceed home value.";
  }
  if (!loan.creditRange) {
    errors.creditRange = "Select your credit range.";
  }
  return errors;
}

export function validateConsent(consent = {}) {
  const errors = {};
  if (!consent.agreed) {
    errors.agreed = "You must agree before submitting.";
  }
  return errors;
}

export function validateLead(payload = {}) {
  return {
    contact: validateContact(payload.contact),
    loan: validateLoan(payload.loan),
    consent: validateConsent(payload.consent)
  };
}

export function hasErrors(errorGroups) {
  return Object.values(errorGroups).some((group) => Object.keys(group).length > 0);
}
