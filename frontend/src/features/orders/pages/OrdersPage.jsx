import { useEffect, useMemo, useState } from "react";
import { rupee } from "../../../utils/format";
import { orderService } from "../services/orderService";
import { tableService } from "../../tables/services/tableService";

const ORDERS_PER_PAGE = 10;

const statusLabel = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

const statusOptions = [
  ["all", "All"],
  ["new", "New"],
  ["preparing", "Preparing"],
  ["ready", "Ready"],
  ["served", "Served"],
];

const dateOptions = [
  ["all", "All Time"],
  ["today", "Today"],
  ["week", "This Week"],
  ["month", "This Month"],
  ["year", "This Year"],
];

const statusStyles = {
  new: "border-red-400/25 bg-red-500/10 text-red-200",
  preparing: "border-sky-400/25 bg-sky-500/10 text-sky-200",
  ready: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
  served: "border-[var(--gold)]/25 bg-[var(--gold-dim)] text-[var(--gold)]",
};

const statusDotStyles = {
  new: "bg-red-300",
  preparing: "bg-sky-300",
  ready: "bg-emerald-300",
  served: "bg-[var(--gold)]",
};

const getOrderDate = (order) => {
  const value = order.createdAt || order.timestamp;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const isSameDay = (date, now) =>
  date.getFullYear() === now.getFullYear() &&
  date.getMonth() === now.getMonth() &&
  date.getDate() === now.getDate();

const isInCurrentWeek = (date, now) => {
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
};

const matchesDateFilter = (order, filter) => {
  if (filter === "all") return true;

  const date = getOrderDate(order);
  if (!date) return false;

  const now = new Date();

  if (filter === "today") return isSameDay(date, now);
  if (filter === "week") return isInCurrentWeek(date, now);
  if (filter === "month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }
  if (filter === "year") return date.getFullYear() === now.getFullYear();

  return true;
};

export default function OrdersPage({ orders, setOrders, showToast }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tables = await tableService.getAll();
        setTables(tables || []);
      } catch (error) {
        console.error("Failed to load tables:", error);
        setTables([]);
      }
    };

    loadTables();
  }, []);

  const dashboardStats = useMemo(() => {
    return orders.reduce(
      (summary, order) => {
        summary.totalOrders += 1;
        summary.totalRevenue += Number(order.total || 0);

        if (order.status === "new") summary.pendingOrders += 1;
        if (order.status === "served") summary.servedOrders += 1;

        return summary;
      },
      {
        totalOrders: 0,
        pendingOrders: 0,
        servedOrders: 0,
        totalRevenue: 0,
      },
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch = normalizedSearch
        ? String(order._id || order.id || "")
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesTable =
        tableFilter === "all" || String(order.tableNo) === tableFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesTable &&
        matchesDateFilter(order, dateFilter)
      );
    });
  }, [orders, searchQuery, statusFilter, tableFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE),
  );

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [currentPage, filteredOrders]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const showingStart = filteredOrders.length
    ? (currentPage - 1) * ORDERS_PER_PAGE + 1
    : 0;

  const showingEnd = Math.min(
    currentPage * ORDERS_PER_PAGE,
    filteredOrders.length,
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTableChange = (e) => {
    setTableFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTableFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  const advance = async (id) => {
    const seq = ["new", "preparing", "ready", "served"];

    const currentOrder = orders.find((order) => order.id === id);

    if (!currentOrder) {
      showToast("Order not found", "error");
      return;
    }

    const nextStatus =
      seq[Math.min(seq.indexOf(currentOrder.status) + 1, seq.length - 1)];

    try {
      const updated = await orderService.updateStatus(id, nextStatus);

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === id ? updated : order)),
      );

      showToast("Order status updated", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update order", "error");
    }
  };

  const cancel = (id) => {
    if (!confirm("Cancel this order?")) return;

    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));

    showToast("Order cancelled", "error");
  };

  const clearServed = () => {
    if (!confirm("Clear all served orders?")) return;

    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.status !== "served"),
    );

    showToast("Served orders cleared", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--cream)]">
            Order Management
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage all restaurant orders and statuses
          </p>
        </div>

        <button
          onClick={clearServed}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 shadow-[0_12px_28px_rgba(239,68,68,0.08)] transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/20"
        >
          <span aria-hidden="true">Clear</span>
          <span>Served Orders</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Orders",
            value: dashboardStats.totalOrders,
            accent: "from-[var(--gold)]/20 to-transparent",
            ring: "border-[var(--gold)]/25",
          },
          {
            label: "Pending Orders",
            value: dashboardStats.pendingOrders,
            accent: "from-red-500/20 to-transparent",
            ring: "border-red-400/20",
          },
          {
            label: "Served Orders",
            value: dashboardStats.servedOrders,
            accent: "from-emerald-500/20 to-transparent",
            ring: "border-emerald-400/20",
          },
          {
            label: "Total Revenue",
            value: rupee(dashboardStats.totalRevenue),
            accent: "from-sky-500/20 to-transparent",
            ring: "border-sky-400/20",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl border ${card.ring} bg-[var(--card)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)]`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${card.accent}`}
            />
            <div className="relative">
              <p className="text-sm font-medium text-[var(--muted)]">
                {card.label}
              </p>
              <div className="mt-3 text-3xl font-bold tracking-normal text-[var(--cream)]">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.16)]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Search Order ID
            </span>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Order ID"
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            >
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Table
            </span>
            <select
              value={tableFilter}
              onChange={handleTableChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            >
              <option value="all">All Tables</option>
              {tables.map((table) => (
                <option key={table._id} value={table.tableNumber}>
                  Table {table.tableNumber}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Date
            </span>
            <select
              value={dateFilter}
              onChange={handleDateChange}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm text-[var(--cream)] outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            >
              {dateOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] xl:w-auto"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-[0_22px_60px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h3 className="text-xl font-semibold text-[var(--cream)]">
              All Orders
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Showing {showingStart}-{showingEnd} of {filteredOrders.length}{" "}
              Orders
            </p>
          </div>

          <div className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--card2)] px-3 py-1 text-sm text-[var(--muted)]">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {paginatedOrders.length ? (
          <>
            <div className="max-h-[680px] overflow-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card2)] shadow-[0_10px_22px_rgba(0,0,0,0.16)]">
                  <tr>
                    {[
                      "Order",
                      "Table",
                      "Items",
                      "Total",
                      "Status",
                      "Time",
                      "Note",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border)]">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-all duration-300 hover:bg-[var(--card2)]/80"
                    >
                      <td className="px-6 py-5 align-top">
                        <div className="text-lg font-bold text-[var(--gold)]">
                          #
                          {String(order._id || order.id)
                            .slice(-4)
                            .toUpperCase()}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--card2)] px-3 py-1 text-sm font-medium text-[var(--cream)]">
                          Table {order.tableNo}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="space-y-2">
                          {order.items?.length ? (
                            order.items.map((item, index) => (
                              <div
                                key={`${order.id}-${item.id || item.name}-${index}`}
                                className="flex items-center gap-2 text-sm text-[var(--muted)]"
                              >
                                <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[var(--cream)]">
                                  {item.emoji ? `${item.emoji} ` : ""}
                                  {item.name || "Item"}
                                </span>
                                <span className="rounded-full bg-[var(--gold-dim)] px-2 py-0.5 text-xs font-semibold text-[var(--gold)]">
                                  x{item.qty}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-[var(--muted)]">
                              No items
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="text-lg font-bold text-[var(--gold)]">
                          {rupee(order.total)}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[order.status] || statusStyles.new
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              statusDotStyles[order.status] ||
                              statusDotStyles.new
                            }`}
                          />
                          {statusLabel[order.status] || statusLabel.new}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top text-sm text-[var(--muted)]">
                        {order.time || "-"}
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-sm italic text-[var(--muted)]">
                          {order.note || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-wrap gap-2">
                          {order.status !== "served" && (
                            <button
                              onClick={() => advance(order.id)}
                              className="rounded-xl border border-[var(--border)] bg-[var(--card2)] px-3 py-2 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                              title="Advance"
                            >
                              Advance
                            </button>
                          )}

                          <button
                            onClick={() => cancel(order.id)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/20"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
              <div className="text-sm text-[var(--muted)]">
                Showing {showingStart}-{showingEnd} of {filteredOrders.length}{" "}
                Orders
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card2)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                        : "border-[var(--border)] bg-[var(--card2)] text-[var(--cream)] hover:border-[var(--gold)]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card2)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card2)] text-[var(--gold)]">
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
                />
              </svg>
            </div>
            <h4 className="mt-5 text-xl font-semibold text-[var(--cream)]">
              No orders found
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              No orders match the selected filters. Reset the filters to return
              to the full order list.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-2xl border border-[var(--gold)] bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:brightness-110"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
