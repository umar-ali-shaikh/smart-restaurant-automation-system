import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  Send,
  Sparkles,
  Star,
  User,
  Mail,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { reviewService } from "../../../reviews/services/reviewService";
import TopBar from "../shared/TopBar";
import { tableService } from "../../../tables/services/tableService";

// Premium Interactive Micro-animated Star Rating Component with Glow
function PremiumStarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isLit = starValue <= (hovered || value);
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(0)}
              className="relative rounded-full p-1 transition-all duration-300 hover:scale-125 active:scale-90 focus:outline-none"
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                className={`h-11 w-11 transition-all duration-500 ease-out ${
                  isLit
                    ? "fill-[#d4aa5a] text-[#d4aa5a] drop-shadow-[0_0_15px_rgba(212,170,90,0.6)] scale-110"
                    : "text-[#1d1912] hover:text-[#8a7d6a]/40"
                }`}
              />
              {isLit && (
                <span className="absolute inset-0 rounded-full bg-[#d4aa5a]/10 blur-md animate-pulse pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 h-5">
        <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#c17a3a] animate-fade-in">
          {value === 5 && "Exceptional"}
          {value === 4 && "Delightful"}
          {value === 3 && "Satisfactory"}
          {value === 2 && "Could Improve"}
          {value === 1 && "Unacceptable"}
          {value === 0 && "Select your rating"}
        </p>
      </div>
    </div>
  );
}

export default function FeedbackScreen({
  cart = {},
  orderId,
  tableNo,
  onDone,
  initialStep = "form",
}) {
  const [step, setStep] = useState(initialStep);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 0,
    comment: "",
    anonymous: false,
  });

  const cartItems = useMemo(() => Object.values(cart || {}), [cart]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };
  console.log("Cart Items:", cartItems);
  const submit = async () => {
    if (!form.rating) {
      setError("Please select an overall rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        tableNo: tableNo ? Number(tableNo) : undefined,
        orderId: orderId || undefined,

        // ✅ Add this
        menuItem: cartItems[0]?.menuItem || cartItems[0]?.id,

        rating: Number(form.rating),
        comment: form.comment.trim(),
        anonymous: form.anonymous,

        selectedItems: cartItems.map((item) => ({
          menuItem: item.menuItem || item.id,
          name: item.name,
          quantity: item.qty || item.quantity || 1,
        })),
      };

      await reviewService.create(payload);

      // Leave table automatically
      const savedTable = localStorage.getItem("tableNumber");

      if (savedTable) {
        try {
          await tableService.leaveTable(savedTable);
          localStorage.removeItem("tableNumber");
        } catch (err) {
          console.error("Leave table failed:", err);
        }
      }

      setStep("done");
    } catch (submitError) {
      setError(submitError.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-[#0a0906] text-[#e8dcc8] relative flex flex-col overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,170,90,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Premium Header */}
        <div className="relative z-10 border-b border-[#2d2418]/60 bg-[#0a0906]/90 backdrop-blur-md">
          <div className="mx-auto max-w-xl px-6 py-5 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#c17a3a] font-semibold">
              THE GRAND MESA
            </p>

            <h1 className="mt-2 font-serif text-3xl font-light text-[#e8dcc8]">
              <span className="text-[#d4aa5a]">Your</span> Feedback
            </h1>

            <p className="mt-2 text-xs text-[#8a7d6a]">
              Thank you for sharing your dining experience
            </p>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex-1 max-w-md mx-auto w-full flex flex-col items-center justify-center px-6 text-center relative z-10">
          <div className="relative group mb-10">
            <div className="absolute inset-0 rounded-[36px] bg-[#d4aa5a]/20 blur-xl group-hover:scale-110 transition-transform duration-700" />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-[36px] border border-[#d4aa5a]/30 bg-[#0f0c08] text-[#d4aa5a] shadow-[0_24px_50px_rgba(0,0,0,0.8)]">
              <CheckCircle2 className="h-14 w-14 stroke-[1.2] animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl font-serif font-light text-[#d4aa5a] tracking-wide">
            Review Submitted
          </h2>

          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#8a7d6a] mt-2">
            The Grand Mesa Hotel
          </p>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8a7d6a]/80 font-light">
            Thank you for your valuable feedback. Your bespoke assessment plays
            a signature role in curating our exceptional standards.
          </p>

          <button
            onClick={onDone}
            className="mt-12 w-full rounded-2xl bg-gradient-to-r from-[#d4aa5a] to-[#c17a3a] px-6 py-4 text-xs uppercase tracking-[0.25em] font-bold text-black shadow-[0_20px_45px_rgba(212,170,90,0.18)] hover:brightness-110 active:scale-[0.98] transition-all duration-300"
          >
            Back to My Orders
          </button>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center text-[9px] tracking-[0.3em] text-[#8a7d6a]/30 uppercase font-medium">
          The Grand Mesa Hotel & Resorts
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0906] text-[#e8dcc8] relative pb-20 selection:bg-[#d4aa5a]/30 overflow-hidden">
      {/* Luxury Radial Top Ambiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#d4aa5a]/5 via-transparent to-transparent pointer-events-none z-0" />

      <TopBar
        goldPart="Your"
        title="Feedback"
        onBack={() => {}}
        onCartClick={() => {}}
        cartCount={0}
      />

      {/* Cinematic Luxury Header & Details Panel */}
      <div className="relative z-10 max-w-xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-[#8a7d6a] hover:text-[#d4aa5a] transition-colors duration-300"
          >
            <ChevronLeft className="h-3.5 w-3.5 -mt-0.5" />
            Back
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4aa5a]/25 bg-[#d4aa5a]/5 px-3.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d4aa5a]">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Patron Portal
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c17a3a] font-semibold mb-2">
            Valued Patron Assessment
          </p>
          <h1 className="text-4xl font-serif font-light tracking-wide text-[#e8dcc8]">
            Your Experience
          </h1>
          <p className="text-xs text-[#8a7d6a] mt-2 font-light">
            Your evaluation keeps our legendary standards impeccable
          </p>
        </div>

        {/* Elegant Meta-Badge Details Card */}
        <div className="mt-8 grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0f0c08]/80 border border-[#2d2418]/60 backdrop-blur-md text-center">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#8a7d6a] font-semibold">
              Order Reference
            </p>
            <p className="text-sm font-mono text-[#d4aa5a] font-bold mt-1">
              {orderId ? `#${String(orderId).slice(-4).toUpperCase()}` : "N/A"}
            </p>
          </div>
          <div className="border-l border-[#2d2418]/60">
            <p className="text-[9px] uppercase tracking-widest text-[#8a7d6a] font-semibold">
              Assigned Table
            </p>
            <p className="text-sm font-mono text-[#e8dcc8] font-bold mt-1">
              {tableNo ? `Table ${tableNo}` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-8 px-6 py-8 relative z-10">
        {/* Rating Block */}
        <section className="rounded-[2.5rem] border border-[#2d2418] bg-gradient-to-b from-[#0f0c08] to-[#0a0906] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-at-t from-[#d4aa5a]/5 to-transparent pointer-events-none" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4aa5a]">
            Overall Culinary & Service Rating
          </p>
          <PremiumStarRating
            value={form.rating}
            onChange={(value) => updateField("rating", value)}
          />
        </section>

        {/* Dynamic Ordered Items Section */}
        {cartItems.length > 0 && (
          <section className="rounded-[2.5rem] border border-[#2d2418] bg-[#0f0c08]/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.65)] relative">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#2d2418]/60">
              <ClipboardList className="h-4 w-4 text-[#d4aa5a] stroke-[1.5]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4aa5a]">
                Ordered Selection
              </p>
            </div>

            <div className="divide-y divide-[#2d2418]/40 space-y-4">
              {cartItems.map((item) => {
                const id = item._id || item.id;
                return (
                  <div
                    key={id}
                    className="flex justify-between items-center text-sm pt-4 first:pt-0 group"
                  >
                    <div className="flex items-center gap-3.5">
                      {item.emoji ? (
                        <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                          {item.emoji}
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4aa5a]/60" />
                      )}
                      <span className="text-[#e8dcc8] font-light tracking-wide transition-colors group-hover:text-white">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#8a7d6a] bg-[#0a0906] border border-[#2d2418] px-3 py-1 rounded-full font-semibold">
                      ×{item.qty || item.quantity || 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Patron Input Form Container */}
        <section className="space-y-6 rounded-[2.5rem] border border-[#2d2418] bg-gradient-to-b from-[#0f0c08] to-[#0a0906] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4aa5a] border-b border-[#2d2418]/60 pb-3">
            Aesthetic Details
          </p>

          <div className="grid gap-6">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#8a7d6a] font-semibold pl-1 flex items-center gap-1.5">
                <User className="h-3 w-3 text-[#d4aa5a]" /> Full Name
              </label>
              <input
                value={form.customerName}
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
                placeholder="Ex. Lord Chesterfield"
                className="h-13 rounded-xl border border-[#2d2418] bg-[#0a0906] px-4 text-sm text-[#e8dcc8] outline-none placeholder:text-[#8a7d6a]/40 focus:border-[#d4aa5a]/60 focus:shadow-[0_0_15px_rgba(212,170,90,0.05)] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#8a7d6a] font-semibold pl-1 flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-[#d4aa5a]" /> Private Email
                (Optional)
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(event) =>
                  updateField("customerEmail", event.target.value)
                }
                placeholder="Ex. concierge@grandmesa.com"
                className="h-13 rounded-xl border border-[#2d2418] bg-[#0a0906] px-4 text-sm text-[#e8dcc8] outline-none placeholder:text-[#8a7d6a]/40 focus:border-[#d4aa5a]/60 focus:shadow-[0_0_15px_rgba(212,170,90,0.05)] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#8a7d6a] font-semibold pl-1 flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3 text-[#d4aa5a]" /> Patron
                Commentary
              </label>
              <textarea
                value={form.comment}
                onChange={(event) => updateField("comment", event.target.value)}
                rows={4}
                placeholder="Share your culinary experiences, architectural impressions or service critiques..."
                className="resize-none rounded-xl border border-[#2d2418] bg-[#0a0906] px-4 py-3.5 text-sm leading-relaxed text-[#e8dcc8] outline-none placeholder:text-[#8a7d6a]/40 focus:border-[#d4aa5a]/60 focus:shadow-[0_0_15px_rgba(212,170,90,0.05)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Diagnostic Error Log */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Luxurious Interaction Call To Action Button */}
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4aa5a] to-[#c17a3a] px-5 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black shadow-[0_20px_45px_rgba(212,170,90,0.18)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Transmitting..." : "Submit Review"}
          </button>
        </section>
      </div>
    </div>
  );
}
