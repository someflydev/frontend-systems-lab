import test from "node:test";
import assert from "node:assert/strict";
import { validateContact, validateLoan } from "../../shared/validation/leadValidation.mjs";

test("validateContact returns no errors for valid contact", () => {
  const errors = validateContact({
    fullName: "Alex Morgan",
    email: "alex@example.com",
    phone: "4155551212",
    zip: "94107"
  });
  assert.equal(Object.keys(errors).length, 0);
});

test("validateLoan rejects impossible balance", () => {
  const errors = validateLoan({
    homeValue: 100000,
    currentBalance: 120000,
    creditRange: "720-759"
  });
  assert.equal(errors.currentBalance, "Current balance cannot exceed home value.");
});
