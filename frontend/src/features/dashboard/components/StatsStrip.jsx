import { formatCurrency } from "../../../utils/dashboardHelpers";

function StatCard({ icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border border-[rgba(212,170,90,0.15)] bg-[#161411] px-5 py-4 transition-all duration-300 hover:border-[rgba(212,170,90,0.32)] shadow-md">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${tone}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-['DM_Sans'] text-3xl font-bold leading-none tabular-nums text-[#f5ede0] truncate">
          {value}
        </div>
        <div className="mt-1.5 text-[11px] font-medium tracking-[0.02em] text-[#8a7d6a] uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function StatsStrip({ summary }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-b border-[rgba(212,170,90,0.15)] pb-6">
      <StatCard
        icon="📋"
        label="Total Orders"
        value={summary.total}
        tone="bg-[rgba(232,136,58,0.08)]"
      />
      <StatCard
        icon="🍳"
        label="Active (Pending)"
        value={summary.active}
        tone="bg-[rgba(90,132,232,0.08)]"
      />
      <StatCard
        icon="✅"
        label="Served Today"
        value={summary.served}
        tone="bg-[rgba(74,154,111,0.08)]"
      />
      <StatCard
        icon="💰"
        label="Revenue Today"
        value={formatCurrency(summary.revenue)}
        tone="bg-[rgba(212,170,90,0.08)]"
      />
    </section>
  );
}
