export const ORDER_STATUSES = ["pending", "preparing", "ready", "served", "cancelled"];

export function isGuestOrderOwner(order, guest) {
  const orderUserId = order.user?._id?.toString() || order.user?.toString();
  return Boolean(guest && orderUserId === guest._id.toString());
}

export function canAccessOrder(order, { staff, guest }) {
  return Boolean(staff) || isGuestOrderOwner(order, guest);
}
