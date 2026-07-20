import StatsStrip from "./StatsStrip";

export default function DashboardOverview({
  summary,
  menu = [],
  categories = [],
  tables = [],
  staff = [],
  reviewAnalytics = null, // पैरेंट से आ रहा नया लाइव प्रॉप
  onNavigate,
}) {
  // डायनामिक डेटा के साथ एक्शन्स और लाइव ओवरव्यू काउंट्स का ऐरे
  const quickActions = [
    {
      id: "analytics",
      title: "Analytics",
      renderDesc: () => {
        const isUp = summary.revenue > 0;
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs ${isUp ? "text-emerald-400" : "text-amber-500"}`}
          >
            {isUp ? "▲ Revenue Growing" : "▼ Reviewing Trends"}
          </span>
        );
      },
      icon: "📊",
    },
    {
      id: "category",
      title: "Categories",
      renderDesc: () => (
        <span className="text-[#8a7d6a]">
          {categories.length} Total Categories
        </span>
      ),
      icon: "📁",
    },
    {
      id: "menu",
      title: "Menu Items",
      renderDesc: () => (
        <span className="text-[#8a7d6a]">{menu.length} Dishes Configured</span>
      ),
      icon: "🍔",
    },
    {
      id: "orders",
      title: "Live Orders",
      renderDesc: () => (
        <span className="text-amber-400 font-medium">
          {summary.active || 0} Active In Kitchen
        </span>
      ),
      icon: "📝",
    },
    {
      id: "tables",
      title: "Tables Setup",
      renderDesc: () => (
        <span className="text-[#8a7d6a]">
          {tables.length} Active Tables Layout
        </span>
      ),
      icon: "🪑",
    },
    {
      id: "staff",
      title: "Staff Directory",
      renderDesc: () => (
        <span className="text-[#8a7d6a]">{staff.length} Active Members</span>
      ),
      icon: "👥",
    },
    {
      id: "billing",
      title: "Billing & Invoices",
      renderDesc: () => (
        <span className="text-[#8a7d6a]">
          {summary.total || 0} Settled Invoices
        </span>
      ),
      icon: "💳",
    },
    {
      id: "reviews",
      title: "Guest Reviews",
      renderDesc: () => {
        const avgRating = reviewAnalytics?.averageRating || 0;
        const totalCount = reviewAnalytics?.totalReviews || 0;
        return (
          <span className="text-[#d4aa5a]">
            ⭐ {avgRating > 0 ? Number(avgRating).toFixed(1) : "0.0"} (
            {totalCount} Reviews)
          </span>
        );
      },
      icon: "💬",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Premium Stat Cards Row */}
      <StatsStrip summary={summary} />

      {/* Top Performer & Kitchen Health Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-[rgba(212,170,90,0.12)] bg-[#14110c] p-5 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#8a7d6a]">
                Top Performer
              </p>
              <p className="text-lg font-medium text-[#f5ede0] mt-0.5">
                {summary.topDishes?.[0]?.name || "No data"}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d4aa5a]/15 text-[#d4aa5a]">
            Best Item
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[rgba(212,170,90,0.12)] bg-[#14110c] p-5 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#8a7d6a]">
                Kitchen Health
              </p>
              <p className="text-lg font-medium text-[#f5ede0] mt-0.5">
                Stable Performance
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
            Growth
          </span>
        </div>
      </div>

      {/* Section Title for Quick Actions */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4aa5a]/70 mb-4">
          Quick Management Actions
        </h4>

        {/* Dynamic Grid Container */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onNavigate?.(action.id)}
              className="group flex items-center text-left gap-4 rounded-2xl border border-[rgba(212,170,90,0.08)] bg-[#161411]/40 p-4 transition-all duration-300 hover:border-[rgba(212,170,90,0.3)] hover:bg-[#161411] hover:translate-y-[-2px] shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-2xl group-hover:bg-[#d4aa5a]/10 transition-colors duration-300">
                {action.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#f5ede0] group-hover:text-[#d4aa5a] transition-colors duration-200">
                  {action.title}
                </p>
                <div className="mt-1 flex items-center">
                  {action.renderDesc()}
                </div>
              </div>
              {/* Soft arrow indicator on hover */}
              <span className="text-[#8a7d6a] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 text-sm">
                ➔
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
