import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  MessageSquareReply,
  RefreshCw,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { reviewService } from "../services/reviewService";

const statusStyles = {
  approved: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  pending: "border-[var(--gold)]/20 bg-[var(--gold-dim)] text-[var(--gold)]",
  rejected: "border-red-400/20 bg-red-500/10 text-red-200",
};

function Stars({ value }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Number(value || 0)
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "text-[var(--muted)]"
          }`}
        />
      ))}
    </div>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--gold)]/15 to-transparent" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          {label}
        </p>
        <p className="mt-3 text-3xl font-bold text-[var(--cream)]">{value}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{sub}</p>
      </div>
    </div>
  );
}

export default function ReviewsPage({ showToast }) {
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState({});

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const [reviewList, reviewAnalytics] = await Promise.all([
        reviewService.getAll(),
        reviewService.getAnalytics(),
      ]);
      setReviews(reviewList);
      setAnalytics(reviewAnalytics);
    } catch (error) {
      showToast?.(error.message || "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(loadReviews, 0);
    return () => window.clearTimeout(timeout);
  }, [loadReviews]);

  const filteredReviews = useMemo(
    () =>
      statusFilter === "all"
        ? reviews
        : reviews.filter((review) => review.status === statusFilter),
    [reviews, statusFilter],
  );

  const updateStatus = async (id, status) => {
    try {
      const updated = await reviewService.updateStatus(id, status);
      setReviews((current) =>
        current.map((review) => (review.id === id ? updated : review)),
      );
      showToast?.(`Review ${status}`, "success");
      loadReviews();
    } catch (error) {
      showToast?.(error.message || "Failed to update review", "error");
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;

    try {
      await reviewService.delete(id);
      setReviews((current) => current.filter((review) => review.id !== id));
      showToast?.("Review deleted", "success");
      loadReviews();
    } catch (error) {
      showToast?.(error.message || "Failed to delete review", "error");
    }
  };

  const saveReply = async (id) => {
    const text = replyText[id]?.trim();
    if (!text) {
      showToast?.("Reply text is required", "error");
      return;
    }

    try {
      const updated = await reviewService.reply(id, text);
      setReviews((current) =>
        current.map((review) => (review.id === id ? updated : review)),
      );
      setReplyText((current) => ({ ...current, [id]: "" }));
      showToast?.("Reply saved", "success");
    } catch (error) {
      showToast?.(error.message || "Failed to save reply", "error");
    }
  };

  const ratingDistribution = analytics?.ratingDistribution || [];
  const maxRatingCount = Math.max(
    ...ratingDistribution.map((item) => item.count),
    1,
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.045]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-[26px] border border-white/10 bg-white/[0.045]"
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.045]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(212,170,90,0.16),rgba(255,255,255,0.045)_42%,rgba(52,211,153,0.1))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[var(--gold-dim)] blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-[var(--gold)]/20 bg-[var(--gold-dim)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
              Guest Experience
            </div>
            <h2 className="mt-5 text-4xl font-bold text-[var(--cream)]">
              Review Management
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Moderate guest feedback, track rating distribution, reply to
              customers, and inspect selected food item signals.
            </p>
          </div>
          <button
            onClick={loadReviews}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:border-[var(--gold)]"
          >
            <RefreshCw className="h-4 w-4 text-[var(--gold)]" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Average Rating"
          value={(analytics?.averageRating || 0).toFixed(1)}
          sub={`${analytics?.totalReviews || 0} total reviews`}
        />
        <MetricCard
          label="Today's Reviews"
          value={analytics?.todayReviews || 0}
          sub="Submitted today"
        />
        <MetricCard
          label="Monthly Reviews"
          value={analytics?.monthlyReviews || 0}
          sub="Current month"
        />
        <MetricCard
          label="Most Reviewed Food"
          value={analytics?.mostReviewedFood?.name || "None"}
          sub={
            analytics?.mostReviewedFood
              ? `${analytics.mostReviewedFood.count} reviews`
              : "No food reviews yet"
          }
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        {/* Left Side: Rating Progress Bars */}
        <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <h3 className="text-xl font-bold text-[var(--cream)]">
            Rating Distribution
          </h3>
          <div className="mt-5 space-y-4">
            {ratingDistribution.map((item) => (
              <div key={item.rating}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[var(--cream)]">
                    {item.rating} Stars
                  </span>
                  <span className="text-[var(--muted)]">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--gold))]"
                    style={{
                      width: `${Math.round((item.count / maxRatingCount) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Reviews Feed */}
        <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-bold text-[var(--cream)]">
                Guest Reviews
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {filteredReviews.length} records
              </p>
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold)]"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-5 max-h-[760px] space-y-4 overflow-y-auto pr-1">
            {!filteredReviews.length && (
              <div className="rounded-3xl border border-dashed border-[var(--border)] px-6 py-16 text-center text-sm text-[var(--muted)]">
                No reviews found
              </div>
            )}

            {filteredReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--gold)]/30"
              >
                {/* Review Card Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-bold text-[var(--cream)]">
                        {review.anonymous
                          ? "Anonymous Guest"
                          : review.customerName}
                      </h4>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[review.status] || statusStyles.pending
                        }`}
                      >
                        {review.status}
                      </span>
                      {review.tableNo && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-[var(--muted)]">
                          Table: {review.tableNo}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <Stars value={review.rating} />
                      <span className="text-xs text-[var(--muted)]">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "No date"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(review.id, "approved")}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(review.id, "rejected")}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card2)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-red-500/50 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  {review.comment || "No written review"}
                </p>

                {/* Selected Menu Items ( स्कीमा के अनुसार quantity के साथ अपडेट किया गया ) */}
                {!!review.selectedItems?.length && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {review.selectedItems.map((item, index) => (
                      <span
                        key={`${review.id}-${item.menuItem || index}`}
                        className="rounded-full border border-[var(--gold)]/20 bg-[var(--gold-dim)]/30 px-3 py-1 text-xs text-[var(--gold)]"
                      >
                        {item.name || "Item"}{" "}
                        {item.quantity > 1 ? `x${item.quantity}` : ""}
                      </span>
                    ))}
                  </div>
                )}

                {/* Admin Reply History */}
                {review.reply?.text && (
                  <div className="mt-4 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-dim)] p-4 text-sm text-[var(--cream)]">
                    <span className="font-semibold text-[var(--gold)]">
                      Reply:{" "}
                    </span>
                    {review.reply.text}
                  </div>
                )}

                {/* Reply Form */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={replyText[review.id] || ""}
                    onChange={(event) =>
                      setReplyText((current) => ({
                        ...current,
                        [review.id]: event.target.value,
                      }))
                    }
                    placeholder="Write a reply..."
                    className="h-11 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                  />
                  <button
                    onClick={() => saveReply(review.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-dim)] px-4 py-2 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black"
                  >
                    <MessageSquareReply className="h-4 w-4" />
                    Reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
