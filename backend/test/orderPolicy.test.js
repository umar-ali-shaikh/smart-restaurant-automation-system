import test from "node:test";
import assert from "node:assert/strict";
import { canAccessOrder, isGuestOrderOwner } from "../src/modules/orders/orderPolicy.js";

const guest = { _id: "guest-1" };

test("guest can access only their own order", () => {
  const ownOrder = { user: { _id: "guest-1" } };
  const otherOrder = { user: { _id: "guest-2" } };

  assert.equal(isGuestOrderOwner(ownOrder, guest), true);
  assert.equal(isGuestOrderOwner(otherOrder, guest), false);
  assert.equal(canAccessOrder(ownOrder, { guest }), true);
  assert.equal(canAccessOrder(otherOrder, { guest }), false);
});

test("staff can access operational orders", () => {
  assert.equal(canAccessOrder({ user: { _id: "guest-2" } }, { staff: { role: "kitchen" } }), true);
});
