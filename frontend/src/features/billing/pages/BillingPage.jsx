import { createElement, useCallback, useMemo, useState, memo } from "react";
import { format } from "date-fns";
import { CalendarClock, Flame, ReceiptText, Utensils } from "lucide-react";
import AnalyticsCards from "../../../components/analytics/AnalyticsCards";
import ExportMenu from "../../../components/analytics/ExportMenu";
import FilterBar from "../../../components/analytics/FilterBar";
import OrdersBarChart from "../../../components/analytics/OrdersBarChart";
import RevenueAreaChart from "../../../components/analytics/RevenueAreaChart";
import RevenueTrendChart from "../../../components/analytics/RevenueTrendChart";
import StatusPieChart from "../../../components/analytics/StatusPieChart";
import TableUsageChart from "../../../components/analytics/TableUsageChart";
import TopSellingChart from "../../../components/analytics/TopSellingChart";
import TransactionTable from "../../../components/analytics/TransactionTable";
import {
  buildAnalytics,
  buildTransactionRows,
  filterOrdersByDate,
  getDateRange,
} from "../../../utils/analytics";
import { exportCsv } from "../../../utils/exportCsv";
import { exportExcel } from "../../../utils/exportExcel";
import { exportPdf } from "../../../utils/exportPdf";
import { rupee } from "../../../utils/format";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.045]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-[26px] border border-white/10 bg-white/[0.045]"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.045]" />
    </div>
  );
}

// Memoized InsightCard to prevent unnecessary UI flash
const InsightCard = memo(function InsightCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/25">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-dim)] p-3 text-[var(--gold)]">
          {createElement(icon, { className: "h-5 w-5" })}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            {label}
          </p>
          <p className="mt-2 text-lg font-bold text-[var(--cream)]">{value}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{sub}</p>
        </div>
      </div>
    </div>
  );
});

function BillingPage({ orders = [], showToast }) {
  console.count("⚡ BillingPage Rendered");

  const [filter, setFilter] = useState("today");
  const [customRange, setCustomRange] = useState({
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  // CRITICAL FIX: Array references change constantly on parent state updates.
  // Hum length aur update indicators ko track karenge text structure ke through loop prevent karne ke liye.
  const ordersKey = useMemo(() => {
    if (!Array.isArray(orders)) return "empty";
    return `${orders.length}-${orders[0]?.updatedAt || orders[0]?.id || ""}`;
  }, [orders]);

  const safeOrders = useMemo(() => {
    return Array.isArray(orders) ? orders : [];
  }, [ordersKey]); // Only recreates array if items actually change

  const dateRange = useMemo(
    () => getDateRange(filter, customRange),
    [customRange, filter],
  );

  const filteredOrders = useMemo(
    () => filterOrdersByDate(safeOrders, dateRange),
    [dateRange, safeOrders],
  );

  const analytics = useMemo(
    () => buildAnalytics(filteredOrders, safeOrders, dateRange),
    [dateRange, filteredOrders, safeOrders],
  );

  const transactionRows = useMemo(
    () => buildTransactionRows(filteredOrders),
    [filteredOrders],
  );

  const currentDate = useMemo(
    () => format(new Date(), "EEEE, dd MMM yyyy"),
    [],
  );

  const notifyExport = useCallback(
    (type) => {
      if (showToast) showToast(`${type} report exported`, "success");
    },
    [showToast],
  );

  const handleCsvExport = useCallback(() => {
    exportCsv("mesa-billing-report.csv", transactionRows);
    notifyExport("CSV");
  }, [notifyExport, transactionRows]);

  const handleExcelExport = useCallback(() => {
    exportExcel("mesa-billing-report.xlsx", transactionRows);
    notifyExport("Excel");
  }, [notifyExport, transactionRows]);

  const handlePdfExport = useCallback(() => {
    exportPdf(
      "mesa-billing-report.pdf",
      transactionRows,
      "Mesa Billing Report",
    );
    notifyExport("PDF");
  }, [notifyExport, transactionRows]);

  if (!Array.isArray(orders)) return <DashboardSkeleton />;

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(212,170,90,0.16),rgba(255,255,255,0.045)_42%,rgba(96,165,250,0.11))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:rounded-[34px] sm:p-6">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[var(--gold-dim)] blur-3xl" />
        <div className="relative flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)] sm:px-4 sm:tracking-[0.22em]">
              <CalendarClock className="h-4 w-4 shrink-0" />
              {currentDate}
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-normal text-[var(--cream)] sm:text-4xl">
              Billing Dashboard
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Real-time restaurant revenue, order status, table usage, and item
              performance from your live order data.
            </p>
          </div>
          <ExportMenu
            onCsv={handleCsvExport}
            onExcel={handleExcelExport}
            onPdf={handlePdfExport}
            disabled={!transactionRows.length}
          />
        </div>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        customRange={customRange}
        setCustomRange={setCustomRange}
        dateWindow={analytics.dateWindow}
      />

      <AnalyticsCards analytics={analytics} />

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          icon={Flame}
          label="Peak Ordering Hour"
          value={analytics.peakOrderingHour}
          sub="Busiest hour in selected period"
        />
        <InsightCard
          icon={CalendarClock}
          label="Peak Ordering Day"
          value={analytics.peakOrderingDay}
          sub="Highest order count by weekday"
        />
        <InsightCard
          icon={Utensils}
          label="Most Profitable Item"
          value={analytics.mostProfitableItem}
          sub={`Avg items per order: ${analytics.averageItemsPerOrder.toFixed(1)}`}
        />
        <InsightCard
          icon={ReceiptText}
          label="Category Revenue"
          value={analytics.revenueByCategory[0]?.name || "None"}
          sub={
            analytics.revenueByCategory[0]
              ? rupee(analytics.revenueByCategory[0].revenue)
              : rupee(0)
          }
        />
      </div>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <RevenueAreaChart data={analytics.revenueOverTime} />
        <StatusPieChart data={analytics.statusDistribution} />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <OrdersBarChart data={analytics.orderVolume} />
        <RevenueTrendChart data={analytics.revenueTrend} />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <TopSellingChart data={analytics.topSellingItems} />
        <TableUsageChart data={analytics.revenueByTable} />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <InsightCard
          icon={Utensils}
          label="Least Selling Item"
          value={analytics.leastSellingItem}
          sub="Lowest positive quantity sold"
        />
        <InsightCard
          icon={ReceiptText}
          label="Least Used Table"
          value={analytics.leastUsedTable}
          sub="Lowest positive table order count"
        />
        <InsightCard
          icon={Flame}
          label="Revenue by Category"
          value={`${analytics.revenueByCategory.length} categories`}
          sub={
            analytics.revenueByCategory
              .map((item) => `${item.name}: ${rupee(item.revenue)}`)
              .slice(0, 2)
              .join(" | ") || "No category data"
          }
        />
      </div>

      <TransactionTable rows={transactionRows} />
    </div>
  );
}

export default memo(BillingPage);
