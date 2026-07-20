import { CalendarDays, SlidersHorizontal } from "lucide-react";
import { DATE_FILTERS } from "../../utils/analytics";

export default function FilterBar({ filter, setFilter, customRange, setCustomRange, dateWindow }) {
  return (
    <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <label className="block min-w-0">
          <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            <SlidersHorizontal className="h-4 w-4" />
            Filter Period
          </span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm font-semibold text-[var(--cream)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
          >
            {DATE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end xl:flex-nowrap">
          {filter === "custom" && (
            <>
              <label className="block min-w-0 sm:w-[170px]">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  Start
                </span>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(event) => setCustomRange((range) => ({ ...range, start: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold)]"
                />
              </label>
              <label className="block min-w-0 sm:w-[170px]">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  End
                </span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(event) => setCustomRange((range) => ({ ...range, end: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold)]"
                />
              </label>
            </>
          )}

          <div className="inline-flex h-12 min-w-0 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm font-semibold text-[var(--cream)] sm:max-w-full xl:max-w-[280px]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span className="min-w-0 truncate">
              {dateWindow.startLabel} - {dateWindow.endLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
