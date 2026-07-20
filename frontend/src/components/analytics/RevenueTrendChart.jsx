import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rupee } from "../../utils/format";

export default function RevenueTrendChart({ data }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--cream)]">Revenue Trend</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Line trend across the selected date range.</p>
      </div>
      {data.length ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
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
              <Line type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
          No trend data available
        </div>
      )}
    </div>
  );
}
