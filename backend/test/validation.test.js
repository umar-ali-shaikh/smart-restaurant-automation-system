import test from "node:test";
import assert from "node:assert/strict";
import { createOrderSchema, adminLoginSchema } from "../src/shared/validation/schemas.js";
import { paymentSchema } from "../src/shared/validation/paymentSchemas.js";

test("order schema accepts frontend productId/qty payloads", () => {
  const result = createOrderSchema.safeParse({
    items: [{ productId: "507f1f77bcf86cd799439011", qty: 2 }],
    tableNo: 4,
  });

  assert.equal(result.success, true);
});

test("admin login schema rejects invalid email", () => {
  const result = adminLoginSchema.safeParse({ email: "invalid", password: "secret" });
  assert.equal(result.success, false);
});

test("payment schema accepts supported payment methods", () => {
  const result = paymentSchema.safeParse({ paymentMethod: "UPI" });
  assert.equal(result.success, true);
});
