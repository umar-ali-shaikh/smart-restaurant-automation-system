export function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export function formatDateLabel(value) {
  return value.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatClock(value) {
  return value.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeAgo(timestamp) {
  const diff = Math.max(0, Math.floor((Date.now() - Number(timestamp || 0)) / 1000));

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function getOrderSummary(orders) {
  const total = orders.length;
  const active = orders.filter((order) => order.status !== "served").length;
  const served = orders.filter((order) => order.status === "served").length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const tables = new Set(orders.map((order) => order.tableNo)).size;
  const avg = total ? Math.round(revenue / total) : 0;

  const topDishMap = {};
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!topDishMap[item.name]) {
        topDishMap[item.name] = { emoji: item.emoji, count: 0 };
      }
      topDishMap[item.name].count += Number(item.qty || 0);
    });
  });

  const topDishes = Object.entries(topDishMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([name, meta]) => ({ name, ...meta }));

  return { total, active, served, revenue, tables, avg, topDishes };
}

export function playChime(enabled) {
  if (!enabled || typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    [523, 659, 784].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.15);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + index * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.15 + 0.5);
      osc.start(ctx.currentTime + index * 0.15);
      osc.stop(ctx.currentTime + index * 0.15 + 0.6);
    });
  } catch {
    // Audio is optional.
  }
}
