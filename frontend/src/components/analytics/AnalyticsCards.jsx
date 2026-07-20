import { createElement } from "react";
import CountUp from "react-countup";
import {
  AlertCircle,
  Award,
  Banknote,
  CheckCircle2,
  ChefHat,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Crown,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Table2,
  Timer,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { rupee } from "../../utils/format";

function formatPercent(value) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

function StatCard({ title, value, icon, formatter, change, tone = "gold" }) {
  const numberValue = Number(value || 0);
  const isNumeric = typeof value === "number";
  const displayFormatter =
    formatter || ((item) => item.toLocaleString("en-IN"));
  const toneClass =
    tone === "green"
      ? "from-emerald-500/20 text-emerald-200"
      : tone === "red"
        ? "from-red-500/20 text-red-200"
        : tone === "blue"
          ? "from-sky-500/20 text-sky-200"
          : "from-[var(--gold)]/25 text-[var(--gold)]";

  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/30">
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${toneClass} to-transparent opacity-80`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            {title}
          </p>
          <div className="mt-3 text-2xl font-bold tracking-normal text-[var(--cream)]">
            {isNumeric ? (
              <CountUp
                end={numberValue}
                duration={0.8}
                separator=","
                formattingFn={displayFormatter}
                preserveValue
              />
            ) : (
              <span className="line-clamp-1">{value}</span>
            )}
          </div>
          {typeof change === "number" && (
            <div
              className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                change >= 0
                  ? "bg-emerald-500/10 text-emerald-200"
                  : "bg-red-500/10 text-red-200"
              }`}
            >
              {formatPercent(change)}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/15 p-3 text-[var(--gold)] transition-all duration-300 group-hover:scale-105">
          {createElement(icon, { className: "h-5 w-5" })}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsCards({ analytics }) {
  const cards = [
    {
      title: "Total Revenue",
      value: analytics.revenue,
      icon: CircleDollarSign,
      formatter: rupee,
      change: analytics.revenueChange,
    },
    {
      title: "Today's Revenue",
      value: analytics.todayRevenue,
      icon: Banknote,
      formatter: rupee,
      tone: "green",
    },
    {
      title: "Weekly Revenue",
      value: analytics.weeklyRevenue,
      icon: TrendingUp,
      formatter: rupee,
      tone: "blue",
    },
    {
      title: "Monthly Revenue",
      value: analytics.monthlyRevenue,
      icon: WalletCards,
      formatter: rupee,
    },
    {
      title: "Yearly Revenue",
      value: analytics.yearlyRevenue,
      icon: CreditCard,
      formatter: rupee,
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders,
      icon: ReceiptText,
      change: analytics.ordersChange,
      tone: "blue",
    },
    {
      title: "Completed Orders",
      value: analytics.completedOrders,
      icon: CheckCircle2,
      tone: "green",
    },
    { title: "Pending Orders", value: analytics.pendingOrders, icon: Clock3 },
    {
      title: "Cancelled Orders",
      value: analytics.cancelledOrders,
      icon: AlertCircle,
      tone: "red",
    },
    {
      title: "Preparing Orders",
      value: analytics.preparingOrders,
      icon: ChefHat,
      tone: "blue",
    },
    {
      title: "Ready Orders",
      value: analytics.readyOrders,
      icon: PackageCheck,
      tone: "green",
    },
    {
      title: "Average Order Value",
      value: analytics.averageOrderValue,
      icon: ShoppingBag,
      formatter: rupee,
      change: analytics.averageOrderChange,
    },
    {
      title: "Highest Order",
      value: analytics.highestOrder,
      icon: Crown,
      formatter: rupee,
    },
    {
      title: "Lowest Order",
      value: analytics.lowestOrder,
      icon: Timer,
      formatter: rupee,
    },
    {
      title: "Total Customers",
      value: analytics.totalCustomers,
      icon: Users,
      tone: "blue",
    },
    { title: "Most Used Table", value: analytics.mostUsedTable, icon: Table2 },
    {
      title: "Top Selling Item",
      value: analytics.topSellingItem,
      icon: Award,
      tone: "green",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
