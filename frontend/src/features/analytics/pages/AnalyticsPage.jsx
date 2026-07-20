import { useEffect, useMemo, useState } from "react";
import { rupee } from "../../../utils/format";
import BarChart from "../../../components/charts/BarChart";
import DonutChart from "../../../components/charts/DonutChart";
import { analyticsService } from "../services/analyticsService";

export default function AnalyticsPage({ menu = [], orders = [] }) {
  const [chartMode, setChartMode] = useState("daily");
  const [backendSummary, setBackendSummary] = useState(null);

  useEffect(() => {
    let mounted = true;
    analyticsService
      .getSummary()
      .then((response) => {
        if (mounted) setBackendSummary(response.data || response);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0,
    );
    const served = orders.filter((order) => order.status === "served").length;
    const avg = orders.length ? Math.round(revenue / orders.length) : 0;
    return {
      revenue: backendSummary?.totalRevenue ?? revenue,
      served,
      avg: backendSummary?.totalOrders
        ? Math.round(
            (backendSummary.totalRevenue || 0) / backendSummary.totalOrders,
          )
        : avg,
      totalOrders: backendSummary?.totalOrders ?? orders.length,
    };
  }, [backendSummary, orders]);

  // FIX: चार्ट को ब्लैंक होने से बचाने के लिए मोड के अनुसार डेटा को ग्रुप और प्रोसेस करना
  const processedChartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      // फॉलबैक डेटा: अगर कोई ऑर्डर न हो तब भी चार्ट खाली या टूटा हुआ न दिखे
      return [
        { label: "Opening", revenue: 0 },
        { label: "Current", revenue: summary.revenue },
      ];
    }

    if (chartMode === "daily") {
      // हर ऑर्डर के समय के हिसाब से पॉइंट्स बनाना
      return orders.map((order, index) => {
        const timeLabel = order.createdAt
          ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : `Order ${index + 1}`;
        return {
          label: timeLabel,
          revenue: Number(order.total || 0),
        };
      });
    }

    // वीकली या मंथली मोड के लिए डिफ़ॉल्ट ग्रुपिंग फॉलबैक
    return orders.map((order, index) => ({
      label: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : `O-${index + 1}`,
      revenue: Number(order.total || 0),
    }));
  }, [orders, chartMode, summary.revenue]);

  const bestSelling = useMemo(() => {
    const dishCount = {};
    orders.forEach((order) =>
      order.items?.forEach((item) => {
        if (!dishCount[item.name])
          dishCount[item.name] = { emoji: item.emoji, qty: 0, revenue: 0 };
        dishCount[item.name].qty += Number(item.qty || 0);
        dishCount[item.name].revenue += Number(
          item.total || item.price * item.qty || 0,
        );
      }),
    );
    return Object.entries(dishCount)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 8);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* 4 Metrics Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "💰",
            "+12%",
            rupee(summary.revenue),
            "Today's Revenue",
            "rgba(212,170,90,.1)",
          ],
          [
            "📋",
            "+5%",
            summary.totalOrders,
            "Total Orders Today",
            "rgba(90,132,232,.1)",
          ],
          ["✅", "100%", summary.served, "Served Today", "rgba(74,154,111,.1)"],
          [
            "⭐",
            "4.8",
            rupee(summary.avg),
            "Avg Order Value",
            "rgba(154,106,232,.1)",
          ],
        ].map(([icon, trend, value, label, bg], index) => (
          <div
            className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#161411] p-5 shadow-md transition-all duration-200 hover:border-[rgba(212,170,90,0.3)]"
            style={{ animationDelay: `${(index + 1) * 0.05}s` }}
            key={label}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                {trend}
              </div>
            </div>
            <div className="font-sans text-3xl font-semibold tracking-tight text-[#f5ede0] tabular-nums">
              {value}
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#8a7d6a]">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Layout Fixed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Area/Bar Section */}
        <div className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#161411] p-5 shadow-md lg:col-span-2 flex flex-col">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-serif text-xl font-semibold text-[#f5ede0]">
              Revenue Overview
            </div>
            <div className="flex gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/5">
              {["daily", "weekly", "monthly"].map((mode) => (
                <button
                  key={mode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    chartMode === mode
                      ? "bg-[#d4aa5a] text-black shadow-md shadow-[#d4aa5a]/10"
                      : "text-[#8a7d6a] hover:text-[#f5ede0] hover:bg-white/5"
                  }`}
                  onClick={() => setChartMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[300px] min-h-[300px]">
            {/* अब यहाँ प्रोसेस्ड चार्ट डेटा पास होगा जिससे ब्लैंक स्क्रीन फिक्स हो जाएगी */}
            <BarChart mode={chartMode} chartData={processedChartData} />
          </div>
        </div>

        {/* Share Distribution Section */}
        <div className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#161411] p-5 shadow-md lg:col-span-1 flex flex-col">
          <div className="mb-6 font-serif text-xl font-semibold text-[#f5ede0]">
            Orders by Type
          </div>
          <div className="w-full h-[300px] min-h-[300px] flex items-center justify-center">
            <DonutChart menu={menu} orders={orders} />
          </div>
        </div>
      </div>

      {/* Best Selling Table Area */}
      <div className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#161411] p-5 shadow-md overflow-hidden">
        <div className="mb-5">
          <div className="font-serif text-xl font-semibold text-[#f5ede0]">
            Best Selling Items
          </div>
          <div className="text-xs text-[#8a7d6a] mt-1">
            Based on orders today
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-[#8a7d6a]">
                <th className="pb-3 w-16">#</th>
                <th className="pb-3">Item</th>
                <th className="pb-3">Cuisine</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {bestSelling.map(([name, data], index) => {
                const dish = menu.find((entry) => entry.name === name) || {
                  cuisine: "—",
                };
                return (
                  <tr
                    key={name}
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-3.5 text-base">
                      {["🥇", "🥈", "🥉"][index] || `#${index + 1}`}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0">{data.emoji}</span>
                        <span className="font-serif text-base text-[#f5ede0] group-hover:text-[#d4aa5a] transition-colors">
                          {name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-[#8a7d6a]">
                      {dish.cuisine}
                    </td>
                    <td className="py-3.5 text-sm font-sans">
                      <strong className="text-[#d4aa5a] font-semibold">
                        {data.qty}
                      </strong>{" "}
                      <span className="text-xs text-[#8a7d6a]">orders</span>
                    </td>
                    <td className="py-3.5 font-sans text-base font-medium text-[#d4aa5a]">
                      {rupee(data.revenue)}
                    </td>
                    <td className="py-3.5 text-sm text-[#d4aa5a]">
                      ⭐ 4.{7 + (index % 3)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
