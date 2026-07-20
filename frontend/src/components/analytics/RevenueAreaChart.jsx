import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rupee } from "../../utils/format";

function EmptyChart({ title }) {
  return (
    <div className="flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
      No {title.toLowerCase()} data available
    </div>
  );
}

export default function RevenueAreaChart({ data }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--cream)]">Revenue Over Time</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Sales value grouped by the selected date range.</p>
      </div>
      {data.length ? (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4aa5a" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#d4aa5a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8a7d6a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8a7d6a", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={rupee} />
              <Tooltip
                formatter={(value) => [rupee(value), "Revenue"]}
                contentStyle={{
                  background: "#161411",
                  border: "1px solid rgba(212,170,90,0.22)",
                  borderRadius: 16,
                  color: "#f5ede0",
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#d4aa5a" strokeWidth={3} fill="url(#revenueArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart title="Revenue" />
      )}
    </div>
  );
}
