import { useMemo, useState } from "react";
import { ArrowDownUp, ChevronLeft, ChevronRight, Search, Wallet } from "lucide-react";
import { rupee } from "../../utils/format";

const PAGE_SIZE = 10;

const statusStyles = {
  Completed: "bg-emerald-500/10 text-emerald-200 border-emerald-400/20",
  Served: "bg-emerald-500/10 text-emerald-200 border-emerald-400/20",
  Ready: "bg-sky-500/10 text-sky-200 border-sky-400/20",
  Preparing: "bg-blue-500/10 text-blue-200 border-blue-400/20",
  Pending: "bg-[var(--gold-dim)] text-[var(--gold)] border-[var(--gold)]/20",
  Cancelled: "bg-red-500/10 text-red-200 border-red-400/20",
};

function compareValues(a, b, direction) {
  if (typeof a === "number" && typeof b === "number") {
    return direction === "asc" ? a - b : b - a;
  }

  return direction === "asc"
    ? String(a).localeCompare(String(b), undefined, { numeric: true })
    : String(b).localeCompare(String(a), undefined, { numeric: true });
}

export default function TransactionTable({ rows }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "time", direction: "desc" });
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searched = query
      ? rows.filter((row) => {
          const haystack = [
            row.id,
            row.table,
            row.paymentMethod,
            row.status,
            row.items.map((item) => item.name).join(" "),
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        })
      : rows;

    return [...searched].sort((a, b) => compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction));
  }, [rows, search, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [activePage, filteredRows]);
  const showingStart = filteredRows.length ? (activePage - 1) * PAGE_SIZE + 1 : 0;
  const showingEnd = Math.min(activePage * PAGE_SIZE, filteredRows.length);

  const sortBy = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const columns = [
    ["id", "Order ID"],
    ["table", "Table"],
    ["items", "Items"],
    ["subtotal", "Subtotal"],
    ["tax", "Tax"],
    ["discount", "Discount"],
    ["total", "Total"],
    ["paymentMethod", "Payment Method"],
    ["time", "Time"],
    ["status", "Status"],
  ];

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[var(--cream)]">Transaction History</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Showing {showingStart}-{showingEnd} of {filteredRows.length} transactions
          </p>
        </div>
        <label className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search transactions"
            className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] pl-11 pr-4 text-sm text-[var(--cream)] outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
          />
        </label>
      </div>

      {rows.length ? (
        <>
          <div className="max-h-[640px] overflow-auto">
            <table className="w-full min-w-[1180px]">
              <thead className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card2)]">
                <tr>
                  {columns.map(([key, label]) => (
                    <th key={key} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      {key === "items" ? (
                        label
                      ) : (
                        <button className="inline-flex items-center gap-2 transition hover:text-[var(--gold)]" onClick={() => sortBy(key)}>
                          {label}
                          <ArrowDownUp className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="transition-all duration-300 hover:bg-white/[0.04]">
                    <td className="px-5 py-4 align-top text-lg font-bold text-[var(--gold)]">#{row.id}</td>
                    <td className="px-5 py-4 align-top text-sm font-semibold text-[var(--cream)]">Table {row.table}</td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex max-w-[280px] flex-wrap gap-2">
                        {row.items.length ? (
                          row.items.map((item, index) => (
                            <span key={`${row.id}-${item.name}-${index}`} className="rounded-full border border-[var(--border)] bg-[var(--card2)] px-3 py-1 text-xs text-[var(--muted)]">
                              {item.name || "Item"} x{item.qty ?? item.quantity ?? 1}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[var(--muted)]">No items</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--cream)]">{rupee(row.subtotal)}</td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--muted)]">{rupee(row.tax)}</td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--muted)]">{rupee(row.discount)}</td>
                    <td className="px-5 py-4 align-top text-base font-bold text-[var(--gold)]">{rupee(row.total)}</td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--cream)]">{row.paymentMethod}</td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--muted)]">{row.time}</td>
                    <td className="px-5 py-4 align-top">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[row.status] || statusStyles.Pending}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--muted)]">
              Showing {showingStart}-{showingEnd} of {filteredRows.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={activePage === 1}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card2)] px-3 py-2 text-sm font-semibold text-[var(--cream)] transition hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="rounded-xl border border-[var(--border)] bg-[var(--card2)] px-4 py-2 text-sm text-[var(--muted)]">
                {activePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                disabled={activePage === totalPages}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card2)] px-3 py-2 text-sm font-semibold text-[var(--cream)] transition hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="px-6 py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-[var(--border)] bg-[var(--card2)] text-[var(--gold)] shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
            <Wallet className="h-10 w-10" />
          </div>
          <h4 className="mt-5 text-2xl font-bold text-[var(--cream)]">No transactions yet</h4>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
            Transactions will appear here as soon as orders are available for the selected period.
          </p>
        </div>
      )}
    </div>
  );
}
