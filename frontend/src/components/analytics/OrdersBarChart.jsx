import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function OrdersBarChart({ data }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--cream)]">Orders Per Day</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Order volume for the selected range.</p>
      </div>
      {data.length ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8a7d6a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8a7d6a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#161411",
                  border: "1px solid rgba(212,170,90,0.22)",
                  borderRadius: 16,
                  color: "#f5ede0",
                }}
              />
              <Bar dataKey="orders" fill="#6ee7b7" radius={[12, 12, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
          No order data available
        </div>
      )}
    </div>
  );
}
