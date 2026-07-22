const STATUS_FROM_API = {
  pending: "new",
  preparing: "preparing",
  ready: "ready",
  served: "served",
  cancelled: "cancelled",
  new: "new",
};

export const STATUS_TO_API = {
  new: "pending",
  preparing: "preparing",
  ready: "ready",
  served: "served",
};

const TABLE_STATUS_FROM_API = {
  free: "available",
  available: "available",
  occupied: "occupied",
  reserved: "reserved",
};

export const TABLE_STATUS_TO_API = {
  available: "free",
  occupied: "occupied",
  reserved: "reserved",
};

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.tables)) return payload.tables;
  if (Array.isArray(payload?.staff)) return payload.staff;
  if (Array.isArray(payload?.reviews)) return payload.reviews;
  return [];
}

export function unwrapData(payload) {
  return payload?.data ?? payload?.order ?? payload?.item ?? payload;
}

export function normalizeMenuItem(item = {}) {
  const id = item._id || item.id;
  const type = item.type || item.dietType;
  const tags = Array.isArray(item.tags)
    ? item.tags
    : [type].filter(Boolean);

  return {
    ...item,
    _id: id,
    id,
    name: item.name || "",
    emoji: item.emoji || "",
    cuisine: item.cuisine || item.category?.name || item.category || "",
    desc: item.desc || item.description || "",
    description: item.description || item.desc || "",
    price: Number(item.price || 0),
    tags,
    type: type || tags[0] || "veg",
    chef: Boolean(item.chef ?? item.isChefSpecial),
    active: item.active ?? item.isAvailable ?? true,
    isAvailable: item.isAvailable ?? item.active ?? true,
    image: item.image || item.imageUrl || "",
  };
}

export function normalizeMenu(payload) {
  return toArray(payload).map(normalizeMenuItem);
}

export function normalizeOrder(order = {}) {
  const id = order._id || order.id;
  const items = toArray(order.items).map((item) => {
    const menuItem = item.menuItem || item.product || item.item || {};
    const dish = typeof menuItem === "object" ? normalizeMenuItem(menuItem) : {};
    const qty = Number(item.qty ?? item.quantity ?? 1);
    const price = Number(item.price ?? dish.price ?? 0);

    return {
      ...item,
      id: dish._id || item._id || item.id || menuItem,
      menuItem: dish._id || item.menuItem,
      name: item.name || dish.name || "",
      emoji: item.emoji || dish.emoji || "",
      qty,
      quantity: qty,
      price,
      total: Number(item.total ?? price * qty),
    };
  });

  const createdAt = order.createdAt || order.timestamp;

  return {
    ...order,
    id,
    _id: id,
    tableNo: order.tableNo || order.tableNumber || order.table || "-",
    items,
    subtotal: Number(order.subtotal ?? order.totalPrice ?? order.total ?? 0),
    total: Number(order.total ?? order.totalPrice ?? 0),
    status: STATUS_FROM_API[order.status] || order.status || "new",
    note: order.note || order.instructions || "",
    time: order.time || (createdAt ? new Date(createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""),
    timestamp: createdAt ? new Date(createdAt).getTime() : Date.now(),
    createdAt,
  };
}

export function normalizeOrders(payload) {
  return toArray(payload).map(normalizeOrder);
}

export function normalizeTable(table = {}) {
  const id = table._id || table.id;

  return {
    ...table,
    id,
    _id: id,
    tableNo: table.tableNo || table.tableNumber || table.number,
    tableNumber: table.tableNumber || table.tableNo || table.number,
    floor: table.floor || "Ground Floor",
    capacity: Number(table.capacity || 4),
    status: TABLE_STATUS_FROM_API[table.status] || table.status || "available",
    qrCode: table.qrCode || table.qr || "",
  };
}

export function normalizeTables(payload) {
  return toArray(payload).map(normalizeTable);
}

export function normalizeStaffUser(user = {}, index = 0) {
  const id = user._id || user.id;

  return {
    ...user,
    id,
    _id: id,
    name: user.name || user.employeeId || user.email || user.username || "Staff",
    employeeId: user.employeeId || user.username || "",
    username: user.username || user.employeeId || user.email || "",
    role: user.role || "kitchen",
    color: user.color || ["#d4aa5a", "#9a6ae8", "#5a84e8", "#e8883a", "#4a9a6f", "#e85a84"][index % 6],
    online: Boolean(user.online),
  };
}

export function normalizeStaff(payload) {
  return toArray(payload).map(normalizeStaffUser);
}

export function normalizeReview(review = {}) {
  return {
    ...review,
    id: review._id || review.id,
    dishId: review.dishId || review.menuItem || review.menuItemId,
    rating: Number(review.rating || 0),
    foodRating: Number(review.foodRating || 0),
    serviceRating: Number(review.serviceRating || 0),
    atmosphereRating: Number(review.atmosphereRating || 0),
    staffRating: Number(review.staffRating || 0),
    cleanlinessRating: Number(review.cleanlinessRating || 0),
    text: review.text || review.comment || "",
    comment: review.comment || review.text || "",
    user: review.user || review.customerName || "Guest",
    customerName: review.customerName || review.user || "Guest",
    selectedItems: Array.isArray(review.selectedItems) ? review.selectedItems : [],
    status: review.status || "pending",
    imageUrl: review.imageUrl || "",
    anonymous: Boolean(review.anonymous),
    reply: review.reply || {},
    time: review.time || review.createdAt || "",
    createdAt: review.createdAt || review.time || "",
  };
}

export function normalizeReviews(payload) {
  return toArray(payload).map(normalizeReview);
}
