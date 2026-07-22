import Review from "../../models/Review.js";

const startOfToday = () => {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value;
};

const startOfMonth = () => {
  const value = new Date();
  value.setDate(1);
  value.setHours(0, 0, 0, 0);
  return value;
};

const round = (value) => Number(Number(value || 0).toFixed(1));

export async function getReviewAnalyticsData(match = {}) {
  const [result] = await Review.aggregate([
    { $match: match },
    {
      $facet: {
        summary: [
          { $group: { _id: null, total: { $sum: 1 }, rating: { $sum: "$rating" } } },
        ],
        statuses: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        ratings: [{ $group: { _id: "$rating", count: { $sum: 1 } } }],
        today: [{ $match: { createdAt: { $gte: startOfToday() } } }, { $count: "count" }],
        month: [{ $match: { createdAt: { $gte: startOfMonth() } } }, { $count: "count" }],
        foods: [
          { $unwind: { path: "$selectedItems", preserveNullAndEmptyArrays: false } },
          {
            $group: {
              _id: { $ifNull: ["$selectedItems.name", "Unnamed Item"] },
              count: { $sum: 1 },
              totalRating: { $sum: "$rating" },
            },
          },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 5 },
          { $project: { _id: 0, name: "$_id", count: 1, averageRating: { $round: [{ $divide: ["$totalRating", "$count"] }, 1] } } },
        ],
      },
    },
  ]);

  const summary = result?.summary?.[0] || { total: 0, rating: 0 };
  const statusCount = (status) => result?.statuses?.find((entry) => entry._id === status)?.count || 0;
  const ratingCount = (rating) => result?.ratings?.find((entry) => entry._id === rating)?.count || 0;
  const foods = result?.foods || [];

  return {
    totalReviews: summary.total,
    averageRating: summary.total ? round(summary.rating / summary.total) : 0,
    todayReviews: result?.today?.[0]?.count || 0,
    monthlyReviews: result?.month?.[0]?.count || 0,
    approvedReviews: statusCount("approved"),
    pendingReviews: statusCount("pending"),
    rejectedReviews: statusCount("rejected"),
    ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({ rating, count: ratingCount(rating) })),
    mostReviewedFood: foods[0] || null,
    topReviewedFoods: foods,
  };
}
