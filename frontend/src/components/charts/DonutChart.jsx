import { useEffect, useMemo, useRef } from "react";

const colors = ["#d4aa5a", "#5a84e8", "#4a9a6f", "#e8883a", "#9a6ae8", "#e85a84"];

export default function DonutChart({ menu, orders }) {
  const ref = useRef(null);
  const entries = useMemo(() => {
    const cuisineCount = {};
    orders.forEach((order) => order.items?.forEach((item) => {
      const dish = menu.find((entry) => entry.name === item.name);
      const cuisine = dish ? dish.cuisine : "Other";
      cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + Number(item.qty || 0);
    }));
    return Object.entries(cuisineCount);
  }, [menu, orders]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
    ctx.clearRect(0, 0, 120, 120);
    let start = -Math.PI / 2;
    entries.forEach(([, value], index) => {
      const angle = (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(60, 60);
      ctx.arc(60, 60, 52, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      start += angle;
    });
    ctx.beginPath();
    ctx.arc(60, 60, 32, 0, Math.PI * 2);
    ctx.fillStyle = "#161411";
    ctx.fill();
    ctx.fillStyle = "#d4aa5a";
    ctx.font = "bold 11px DM Sans";
    ctx.textAlign = "center";
    ctx.fillText(String(orders.length || 0), 60, 62);
    ctx.fillStyle = "#8a7d6a";
    ctx.font = "9px DM Sans";
    ctx.fillText("orders", 60, 74);
  }, [entries, orders.length]);

  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;

  return (
    <div className="flex items-center gap-5">
      <canvas ref={ref} width="120" height="120" />
      <div className="flex flex-1 flex-col gap-2.5">
        {entries.slice(0, 4).map(([name, value], index) => (
          <div className="flex items-center gap-2 text-xs text-mesa-text" key={name}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[index % colors.length] }} />
            {name}
            <span className="ml-auto text-[11px] text-mesa-muted">{Math.round((value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
