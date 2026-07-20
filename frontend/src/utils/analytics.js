import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";

export const DATE_FILTERS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Date Range" },
];

export const STATUS_LABELS = {
  new: "Pending",
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Completed",
  completed: "Completed",
  cancelled: "Cancelled",
  canceled: "Cancelled",
};

const DAY_LABEL_FORMAT = "dd MMM";
const MONTH_LABEL_FORMAT = "MMM yyyy";

export function getOrderDate(order) {
  const value = order?.createdAt || order?.timestamp || order?.time;
  if (!value) return null;

  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(date) ? date : null;
}

export function getRevenue(order) {
  return Number(order?.total ?? order?.totalPrice ?? order?.amount ?? 0);
}

export function getOrderSubtotal(order) {
  const explicitSubtotal = Number(order?.subtotal ?? order?.subTotal);
  if (Number.isFinite(explicitSubtotal) && explicitSubtotal > 0) return explicitSubtotal;

  const itemSubtotal = (order?.items || []).reduce((sum, item) => {
    const itemTotal = Number(item?.total);
    if (Number.isFinite(itemTotal) && itemTotal > 0) return sum + itemTotal;

    return sum + Number(item?.price || 0) * Number(item?.qty ?? item?.quantity ?? 1);
  }, 0);

  return itemSubtotal || getRevenue(order);
}

export function getOrderDiscount(order) {
  return Number(order?.discount ?? order?.discountAmount ?? 0);
}

export function getOrderTax(order) {
  const explicitTax = Number(order?.tax ?? order?.gst ?? order?.taxAmount);
  if (Number.isFinite(explicitTax) && explicitTax > 0) return explicitTax;

  const taxFromTotals = getRevenue(order) - getOrderSubtotal(order) + getOrderDiscount(order);
  return taxFromTotals > 0 ? taxFromTotals : 0;
}

export function getPaymentMethod(order) {
  return order?.paymentMethod || order?.paymentMode || order?.payment?.method || "Not recorded";
}

export function normalizeStatus(status) {
  const key = String(status || "new").toLowerCase();
  return STATUS_LABELS[key] || key;
}

export function isCompletedOrder(order) {
  const status = String(order?.status || "").toLowerCase();
  return status === "served" || status === "completed";
}

export function isCancelledOrder(order) {
  const status = String(order?.status || "").toLowerCase();
  return status === "cancelled" || status === "canceled";
}

export function getDateRange(filter, customRange = {}) {
  const now = new Date();

  if (filter === "yesterday") {
    const yesterday = subDays(now, 1);
    return {
      start: startOfDay(yesterday),
      end: endOfDay(yesterday),
      label: "Yesterday",
    };
  }

  if (filter === "last7") {
    return {
      start: startOfDay(subDays(now, 6)),
      end: endOfDay(now),
      label: "Last 7 Days",
    };
  }

  if (filter === "last30") {
    return {
      start: startOfDay(subDays(now, 29)),
      end: endOfDay(now),
      label: "Last 30 Days",
    };
  }

  if (filter === "month") {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
      label: "This Month",
    };
  }

  if (filter === "year") {
    return {
      start: startOfYear(now),
      end: endOfYear(now),
      label: "This Year",
    };
  }

  if (filter === "custom") {
    const start = customRange.start ? startOfDay(parseISO(customRange.start)) : startOfDay(now);
    const end = customRange.end ? endOfDay(parseISO(customRange.end)) : endOfDay(now);

    return {
      start: isValid(start) ? start : startOfDay(now),
      end: isValid(end) ? end : endOfDay(now),
      label: "Custom Range",
    };
  }

  return {
    start: startOfDay(now),
    end: endOfDay(now),
    label: "Today",
  };
}

export function filterOrdersByDate(orders, range) {
  if (!Array.isArray(orders) || !range?.start || !range?.end) return [];
  return orders.filter((order) => {
    const date = getOrderDate(order);
    return date ? date >= range.start && date <= range.end : false;
  });
}

export function getPreviousRange(range) {
  const span = Math.max(differenceInCalendarDays(range.end, range.start), 0);
  const previousEnd = endOfDay(subDays(range.start, 1));
  const previousStart = startOfDay(subDays(previousEnd, span));

  return {
    start: previousStart,
    end: previousEnd,
    label: "Previous Period",
  };
}

export function getPercentChange(current, previous) {
  if (!previous && !current) return 0;
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function getDateKey(date, useMonthBucket) {
  return format(date, useMonthBucket ? MONTH_LABEL_FORMAT : DAY_LABEL_FORMAT);
}

function createTimeSeries(range) {
  const days = eachDayOfInterval({ start: range.start, end: range.end });
  const useMonthBucket = days.length > 75;
  const buckets = new Map();

  days.forEach((day) => {
    const key = getDateKey(day, useMonthBucket);
    if (!buckets.has(key)) {
      buckets.set(key, {
        label: key,
        revenue: 0,
        orders: 0,
      });
    }
  });

  return { buckets, useMonthBucket };
}

function topEntry(map, fallback = "None") {
  const entries = Array.from(map.values()).sort((a, b) => {
    const primary = Number(b.value || b.quantity || b.orders || b.revenue || 0);
    const secondary = Number(a.value || a.quantity || a.orders || a.revenue || 0);
    return primary - secondary;
  });

  return entries[0] || { name: fallback, value: 0 };
}

function bottomEntry(map, fallback = "None") {
  const entries = Array.from(map.values())
    .filter((item) => Number(item.value || item.quantity || item.orders || item.revenue || 0) > 0)
    .sort((a, b) => {
      const primary = Number(a.value || a.quantity || a.orders || a.revenue || 0);
      const secondary = Number(b.value || b.quantity || b.orders || b.revenue || 0);
      return primary - secondary;
    });

  return entries[0] || { name: fallback, value: 0 };
}

// OPTIMIZED BUILD ANALYTICS TO PREVENT INFINITE RE-RENDERS
export function buildAnalytics(orders = [], allOrders = [], range) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeAllOrders = Array.isArray(allOrders) ? allOrders : [];

  const previousOrders = filterOrdersByDate(safeAllOrders, getPreviousRange(range));

  // High Performance Fix: Aaj ka aur baki ranges ka calculation loop ke bina single-pass optimize kiya
  const now = new Date();
  const startOfToday = startOfDay(now).getTime();
  const endOfToday = endOfDay(now).getTime();
  const startOfWeek = startOfDay(subDays(now, 6)).getTime();
  const startOfMonthTime = startOfMonth(now).getTime();
  const startOfYearTime = startOfYear(now).getTime();

  let todayRevenue = 0;
  let weeklyRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;

  // Single loop over safeAllOrders to calculate absolute timeline values (No filter chaining!)
  safeAllOrders.forEach((order) => {
    const date = getOrderDate(order);
    if (!date) return;
    const time = date.getTime();
    const rev = getRevenue(order);

    if (time >= startOfToday && time <= endOfToday) todayRevenue += rev;
    if (time >= startOfWeek && time <= endOfToday) weeklyRevenue += rev;
    if (time >= startOfMonthTime && time <= endOfToday) monthlyRevenue += rev;
    if (time >= startOfYearTime && time <= endOfToday) yearlyRevenue += rev;
  });

  const revenue = safeOrders.reduce((sum, order) => sum + getRevenue(order), 0);
  const previousRevenue = previousOrders.reduce((sum, order) => sum + getRevenue(order), 0);
  const previousOrderCount = previousOrders.length;

  const orderValues = safeOrders.map(getRevenue).filter((value) => value > 0);

  let completedOrders = 0;
  let cancelledOrders = 0;
  let pendingOrders = 0;
  let preparingOrders = 0;
  let readyOrders = 0;

  const customerIds = new Set();
  const itemMap = new Map();
  const itemProfitMap = new Map();
  const tableMap = new Map();
  const categoryMap = new Map();
  const statusMap = new Map();
  const hourMap = new Map();
  const dayMap = new Map();
  const { buckets, useMonthBucket } = createTimeSeries(range);
  let itemCount = 0;

  safeOrders.forEach((order) => {
    const revenueValue = getRevenue(order);
    const tableName = `Table ${order.tableNo ?? order.tableNumber ?? order.table ?? "-"}`;
    const statusName = normalizeStatus(order.status);
    const date = getOrderDate(order);

    // Status counts optimization
    const lowerStatus = String(order.status || "").toLowerCase();
    if (lowerStatus === "served" || lowerStatus === "completed") completedOrders++;
    else if (lowerStatus === "cancelled" || lowerStatus === "canceled") cancelledOrders++;
    else if (["new", "pending"].includes(lowerStatus)) pendingOrders++;
    else if (lowerStatus === "preparing") preparingOrders++;
    else if (lowerStatus === "ready") readyOrders++;

    const customerKey =
      order.customerId ||
      order.customer?._id ||
      order.customer?.id ||
      order.customerName ||
      order.customer?.name ||
      order.user ||
      order.userId;

    if (customerKey) customerIds.add(String(customerKey));

    if (!tableMap.has(tableName)) {
      tableMap.set(tableName, { name: tableName, orders: 0, revenue: 0, value: 0 });
    }
    const table = tableMap.get(tableName);
    table.orders += 1;
    table.revenue += revenueValue;
    table.value = table.orders;

    statusMap.set(statusName, {
      name: statusName,
      value: (statusMap.get(statusName)?.value || 0) + 1,
    });

    if (date) {
      const key = getDateKey(date, useMonthBucket);
      const existingBucket = buckets.get(key) || { label: key, revenue: 0, orders: 0 };
      existingBucket.revenue += revenueValue;
      existingBucket.orders += 1;
      buckets.set(key, existingBucket);

      const hour = format(date, "ha");
      hourMap.set(hour, { name: hour, value: (hourMap.get(hour)?.value || 0) + 1 });

      const day = format(date, "EEEE");
      dayMap.set(day, { name: day, value: (dayMap.get(day)?.value || 0) + 1 });
    }

    (order.items || []).forEach((item) => {
      const quantity = Number(item.qty ?? item.quantity ?? 1);
      const name = item.name || item.menuItem?.name || "Unnamed Item";
      const category = item.category || item.cuisine || item.menuItem?.category?.name || item.menuItem?.category || "Uncategorized";
      const lineRevenue =
        Number(item.total) || Number(item.price || item.menuItem?.price || 0) * quantity;

      itemCount += quantity;

      if (!itemMap.has(name)) {
        itemMap.set(name, { name, quantity: 0, revenue: 0, value: 0 });
      }
      const itemEntry = itemMap.get(name);
      itemEntry.quantity += quantity;
      itemEntry.revenue += lineRevenue;
      itemEntry.value = itemEntry.quantity;

      if (!itemProfitMap.has(name)) {
        itemProfitMap.set(name, { name, value: 0, revenue: 0 });
      }
      const profitEntry = itemProfitMap.get(name);
      profitEntry.value += lineRevenue;
      profitEntry.revenue += lineRevenue;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { name: category, revenue: 0, value: 0 });
      }
      const categoryEntry = categoryMap.get(category);
      categoryEntry.revenue += lineRevenue;
      categoryEntry.value += lineRevenue;
    });
  });

  const averageOrderValue = safeOrders.length ? revenue / safeOrders.length : 0;
  const previousAverageOrderValue = previousOrderCount ? previousRevenue / previousOrderCount : 0;
  const highestOrder = orderValues.length ? Math.max(...orderValues) : 0;
  const lowestOrder = orderValues.length ? Math.min(...orderValues) : 0;

  const topSellingItem = topEntry(itemMap);
  const leastSellingItem = bottomEntry(itemMap);
  const mostProfitableItem = topEntry(itemProfitMap);
  const mostUsedTable = topEntry(tableMap);
  const leastUsedTable = bottomEntry(tableMap);
  const peakOrderingHour = topEntry(hourMap);
  const peakOrderingDay = topEntry(dayMap);

  const revenueByTable = Array.from(tableMap.values()).sort((a, b) => b.revenue - a.revenue);
  const revenueByCategory = Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue);
  const topSellingItems = Array.from(itemMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);

  return {
    revenue,
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    totalOrders: safeOrders.length,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    preparingOrders,
    readyOrders,
    averageOrderValue,
    highestOrder,
    lowestOrder,
    totalCustomers: customerIds.size,
    mostUsedTable: mostUsedTable.name,
    topSellingItem: topSellingItem.name,
    leastSellingItem: leastSellingItem.name,
    leastUsedTable: leastUsedTable.name,
    mostProfitableItem: mostProfitableItem.name,
    peakOrderingHour: peakOrderingHour.name,
    peakOrderingDay: peakOrderingDay.name,
    averageItemsPerOrder: safeOrders.length ? itemCount / safeOrders.length : 0,
    revenueChange: getPercentChange(revenue, previousRevenue),
    ordersChange: getPercentChange(safeOrders.length, previousOrderCount),
    averageOrderChange: getPercentChange(averageOrderValue, previousAverageOrderValue),
    revenueOverTime: Array.from(buckets.values()),
    orderVolume: Array.from(buckets.values()).map((item) => ({
      label: item.label,
      orders: item.orders,
    })),
    statusDistribution: Array.from(statusMap.values()),
    revenueByTable,
    revenueByCategory,
    topSellingItems,
    revenueTrend: Array.from(buckets.values()).map((item, index, list) => {
      const previous = list[index - 1]?.revenue || 0;
      return {
        label: item.label,
        revenue: item.revenue,
        change: item.revenue - previous,
      };
    }),
    dateWindow: {
      start: range.start,
      end: range.end,
      startLabel: format(range.start, "dd MMM yyyy"),
      endLabel: format(range.end, "dd MMM yyyy"),
      nextDayAfterEnd: addDays(range.end, 1),
    },
  };
}

export function buildTransactionRows(orders = []) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  return safeOrders.map((order) => ({
    id: order.id || order._id,
    table: order.tableNo ?? order.tableNumber ?? order.table ?? "-",
    items: order.items || [],
    subtotal: getOrderSubtotal(order),
    tax: getOrderTax(order),
    discount: getOrderDiscount(order),
    total: getRevenue(order),
    paymentMethod: getPaymentMethod(order),
    time: order.time || (getOrderDate(order) ? format(getOrderDate(order), "dd MMM yyyy, hh:mm a") : "-"),
    status: normalizeStatus(order.status),
  }));
}