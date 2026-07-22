import { useMemo } from "react";
import { rupee } from "../../utils/format";

export default function BarChart({ mode = "daily", orders = [], chartData: inputChartData = null, emptyMessage = "No revenue exists for the selected period." }) {
  const chartData = useMemo(() => {
    if (Array.isArray(inputChartData)) {
      return inputChartData
        .map((item) => ({ label: item.label, value: Number(item.revenue ?? item.value ?? 0), orders: Number(item.orders || 0) }))
        .filter((item) => Number.isFinite(item.value));
    }
    const grouped = {};

    orders.forEach((order) => {
      const date = order.createdAt ? new Date(order.createdAt) : null;

      if (!date || Number.isNaN(date.getTime())) {
        return;
      }

      let key = "";

      /* DAILY */
      if (mode === "daily") {
        key = date.toLocaleDateString("en-IN", {
          weekday: "short",
        });
      } else if (mode === "weekly") {

      /* WEEKLY */
        key = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else {

      /* MONTHLY */
        key = date.toLocaleDateString("en-IN", {
          month: "short",
        });
      }

      grouped[key] = (grouped[key] || 0) + Number(order.total || 0);
    });

    return Object.entries(grouped).map(([label, value]) => ({
      label,
      value,
    }));
  }, [inputChartData, orders, mode]);

  const max = Math.max(...chartData.map((item) => item.value), 1);

  if (import.meta.env.DEV) {
    console.debug("[analytics] final Revenue Overview chart props", { mode, chartData });
  }

  if (!chartData.length) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-mesa-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[140px] items-end gap-1.5 pt-2.5">
        {chartData.map((item, index) => (
          <div
            className="flex flex-1 flex-col items-center gap-1.5"
            key={`${mode}-${index}`}
          >
            <div
              className="min-h-1 w-full rounded-t-lg bg-[var(--gold)] shadow-[0_0_18px_rgba(212,170,90,0.28)] transition-all duration-500 hover:bg-[#f1c66e]"
              style={{
                height: `${Math.round((item.value / max) * 130)}px`,
              }}
              data-val={rupee(Math.round(item.value))}
              title={`${item.label}: ${rupee(Math.round(item.value))}`}
              aria-label={`${item.label}: ${rupee(Math.round(item.value))}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5">
        {chartData.map((item) => (
          <div
            key={item.label}
            className="flex-1 text-center text-[9px] text-mesa-muted"
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
}
