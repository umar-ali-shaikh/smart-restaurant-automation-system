import Order from "../../models/Order.js";

function dateRange(query = {}) {
  const now = new Date();
  let start;
  let end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (query.start || query.end) {
    start = query.start ? new Date(query.start) : new Date(0);
    end = query.end ? new Date(query.end) : end;
  } else {
    const period = query.period || "today";
    start = new Date(now);
    if (period === "yesterday") {
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    } else if (period === "7d") start.setDate(start.getDate() - 6);
    else if (period === "30d") start.setDate(start.getDate() - 29);
    else if (period === "month") start = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (period === "year") start = new Date(now.getFullYear(), 0, 1);
    else start.setHours(0, 0, 0, 0);
  }

  if (Number.isNaN(start.getTime())) start = new Date(0);
  if (Number.isNaN(end.getTime())) end = new Date(now);
  return { createdAt: { $gte: start, $lte: end } };
}

export async function getOrderAnalytics(query = {}) {
  const match = dateRange(query);
  const [summary] = await Order.aggregate([
    { $match: { $and: [match, { $or: [{ paymentStatus: "Paid" }, { status: "served" }] }] } },
    {
      $facet: {
        totals: [{ $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: "$totalPrice" }, customers: { $addToSet: "$user" }, highest: { $max: "$totalPrice" }, lowest: { $min: "$totalPrice" } } }],
        statuses: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        trend: [{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, orders: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } }, { $sort: { _id: 1 } }],
        hours: [{ $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }],
        weekdays: [{ $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }],
        tables: [{ $match: { tableNo: { $ne: null } } }, { $group: { _id: "$tableNo", orders: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } }, { $sort: { revenue: -1 } }],
        items: [{ $unwind: "$items" }, { $group: { _id: "$items.menuItem", quantity: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } }, { $sort: { quantity: -1 } }, { $limit: 10 }, { $lookup: { from: "menuitems", localField: "_id", foreignField: "_id", as: "menuItem" } }, { $unwind: { path: "$menuItem", preserveNullAndEmptyArrays: true } }, { $project: { _id: 0, id: "$_id", name: { $ifNull: ["$menuItem.name", "Unknown item"] }, quantity: 1, revenue: 1 } }],
        categories: [{ $unwind: "$items" }, { $lookup: { from: "menuitems", localField: "items.menuItem", foreignField: "_id", as: "menuItem" } }, { $unwind: "$menuItem" }, { $group: { _id: "$menuItem.category", revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }, quantity: { $sum: "$items.quantity" } } }, { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } }, { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, { $project: { _id: 0, name: { $ifNull: ["$category.name", "Uncategorized"] }, revenue: 1, quantity: 1 } }, { $sort: { revenue: -1 } }],
      },
    },
  ]);

  const totals = summary?.totals?.[0] || {};
  const status = (name) => summary?.statuses?.find((entry) => entry._id === name)?.count || 0;
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hour = summary?.hours?.[0]?._id;
  const day = summary?.weekdays?.[0]?._id;

  return {
    totalOrders: totals.orders || 0,
    totalRevenue: totals.revenue || 0,
    customerCount: totals.customers?.length || 0,
    averageOrderValue: totals.orders ? Number((totals.revenue / totals.orders).toFixed(2)) : 0,
    highestOrder: totals.highest || 0,
    lowestOrder: totals.lowest || 0,
    pending: status("pending"),
    preparing: status("preparing"),
    ready: status("ready"),
    completed: status("served"),
    cancelled: status("cancelled"),
    peakHour: hour === undefined ? null : `${String(hour).padStart(2, "0")}:00`,
    peakDay: day === undefined ? null : weekdayNames[day - 1],
    revenueTrend: summary?.trend || [],
    revenueByTable: summary?.tables || [],
    topSellingItems: summary?.items || [],
    revenueByCategory: summary?.categories || [],
  };
}
