import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { rupee } from "../../utils/format";

export default function TableUsageChart({ data }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--cream)]">Revenue by Table</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Table-level revenue contribution.</p>
      </div>
      {data.length ? (
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#8a7d6a", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={rupee} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fill: "#f5ede0", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [rupee(value), "Revenue"]}
                contentStyle={{
                  background: "#161411",
                  border: "1px solid rgba(212,170,90,0.22)",
                  borderRadius: 16,
                  color: "#f5ede0",
                }}
              />
              <Bar dataKey="revenue" fill="#60a5fa" radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[340px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
          No table revenue data available
        </div>
      )}
    </div>
  );
}
