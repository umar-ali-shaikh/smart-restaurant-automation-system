import { useMemo } from "react";
import { rupee } from "../../utils/format";

export default function BarChart({ mode = "daily", orders = [] }) {
  const chartData = useMemo(() => {
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
  }, [orders, mode]);

  const max = Math.max(...chartData.map((item) => item.value), 1);

  if (!chartData.length) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-mesa-muted">
        No Chart Data Available
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
              className="bar"
              style={{
                height: `${Math.round((item.value / max) * 130)}px`,
              }}
              data-val={rupee(Math.round(item.value))}
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
