import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#d4aa5a", "#60a5fa", "#34d399", "#f87171", "#c084fc", "#fbbf24"];

export default function StatusPieChart({ data }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[var(--cream)]">Status Distribution</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Current order lifecycle split.</p>
      </div>
      {data.length ? (
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#161411",
                    border: "1px solid rgba(212,170,90,0.22)",
                    borderRadius: 16,
                    color: "#f5ede0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 text-sm text-[var(--cream)]">
                <span className="h-3 w-3 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span>{item.name}</span>
                <span className="ml-auto text-[var(--muted)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[280px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
          No status data available
        </div>
      )}
    </div>
  );
}
