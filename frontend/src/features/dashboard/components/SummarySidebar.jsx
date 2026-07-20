import { formatCurrency } from "../../../utils/dashboardHelpers";

const DASHBOARD_INFO_STEPS = [
  {
    title: "Customer places order",
    text: "frontend sends order data through the shared order service.",
  },
  {
    title: "Demo sync",
    text: "the dashboard listens to localStorage and browser events in real time.",
  },
  {
    title: "Production path",
    text: "replace the demo sync layer with API or WebSocket updates later.",
  },
  {
    title: "Kitchen flow",
    text: "orders move from new to preparing to ready to served inside the dashboard.",
  },
];

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#161411] p-5 shadow-lg">
      <h3 className="border-b border-[rgba(212,170,90,0.15)] pb-3 font-['Cormorant_Garamond'] text-2xl font-semibold text-[#f5ede0]">
        {title}
      </h3>
      <div className="pt-3">{children}</div>
    </section>
  );
}

export default function SummarySidebar({ summary, onClearServed }) {
  const maxDishCount = summary.topDishes?.[0]?.count || 1;

  return (
    <div className="space-y-5 w-full">
      {/* Today's Summary */}
      <Card title="Today's Summary">
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.04)] py-2.5 text-sm">
            <span className="text-[#8a7d6a]">Orders received</span>
            <span className="font-['DM_Sans'] font-medium tabular-nums text-[#f5ede0]">
              {summary.total}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.04)] py-2.5 text-sm">
            <span className="text-[#8a7d6a]">Tables served</span>
            <span className="font-['DM_Sans'] font-medium tabular-nums text-[#f5ede0]">
              {summary.tables}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.04)] py-2.5 text-sm">
            <span className="text-[#8a7d6a]">Avg order value</span>
            <span className="font-['DM_Sans'] font-medium tabular-nums text-[#f5ede0]">
              {formatCurrency(summary.avg)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-[#8a7d6a]">Total revenue</span>
            <span className="font-['DM_Sans'] text-xl font-semibold tabular-nums text-[#d4aa5a]">
              {formatCurrency(summary.revenue)}
            </span>
          </div>
        </div>
      </Card>

      {/* Top Dishes */}
      <Card title="Top Dishes Today">
        {summary.topDishes?.length ? (
          <div className="space-y-2">
            {summary.topDishes.map((dish) => (
              <div
                key={dish.name}
                className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] py-2.5 last:border-b-0"
              >
                <div className="w-8 text-center text-xl">{dish.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate text-[#f5ede0]">
                    {dish.name}
                  </div>
                  <div className="text-xs text-[#8a7d6a]">
                    {dish.count} ordered
                  </div>
                </div>
                <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#d4aa5a] to-[#c17a3a]"
                    style={{
                      width: `${Math.round((dish.count / maxDishCount) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8a7d6a] py-2">No orders yet.</p>
        )}
      </Card>

      {/* Real-Time Setup Flow */}
      <section className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#1c1814] p-5 shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#d4aa5a]">
          Real-Time Setup
        </p>
        <div className="mt-4 space-y-3">
          {DASHBOARD_INFO_STEPS.map((step, index) => (
            <div key={step.title} className="flex gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(212,170,90,0.15)] bg-[rgba(212,170,90,0.08)] text-[10px] font-bold text-[#d4aa5a]">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-[#8a7d6a]">
                <strong className="text-[#f5ede0] font-medium">
                  {step.title}
                </strong>{" "}
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Clear Action Button */}
      <button
        type="button"
        onClick={onClearServed}
        className="w-full rounded-2xl border border-[rgba(201,64,64,0.2)] bg-[rgba(201,64,64,0.06)] px-4 py-3 text-sm font-medium text-[#e88888] transition hover:bg-[rgba(201,64,64,0.14)] active:scale-[0.98]"
      >
        🗑️ Clear Served Orders
      </button>
    </div>
  );
}
