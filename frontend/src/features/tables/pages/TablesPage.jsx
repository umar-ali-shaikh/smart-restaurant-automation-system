import { useState, useEffect } from "react";
import { getSocket } from "../../../api/socket"; // 🔥 Centralized instance imported cleanly
import QRModal from "../components/QRModal";
import TableModal from "../components/TableModal";
import { tableService } from "../services/tableService";

export default function TablesPage({ tables, setTables, showToast }) {
  const [addOpen, setAddOpen] = useState(false);
  const [qrTable, setQrTable] = useState(null);

  /* ======================================
      REAL-TIME WEBSOCKET LISTENER
  ====================================== */
  useEffect(() => {
    // Framework client socket initialized safely
    const socket = getSocket();

    if (socket) {
      // Connect directly with admin pipeline channel bounds
      socket.emit("joinAdmin");

      // Listen for instant updates from backend scan tracking pipeline
      socket.on("tableUpdated", (updatedTableEvent) => {
        console.log(
          "Real-time table update received via WebSocket on Admin Panel:",
          updatedTableEvent,
        );

        setTables((prevTables) =>
          prevTables.map((item) => {
            const identifier = item._id || item.id;
            const targetId =
              updatedTableEvent.data?._id || updatedTableEvent.data?.id;

            if (
              identifier === targetId ||
              item.tableNumber === updatedTableEvent.tableNumber
            ) {
              // Deep copy fresh sync values seamlessly
              return (
                updatedTableEvent.data || {
                  ...item,
                  status: updatedTableEvent.status,
                }
              );
            }
            return item;
          }),
        );

        showToast(
          `Table ${updatedTableEvent.tableNumber} status synced real-time!`,
          "info",
        );
      });
    }

    // Cleanup hook wrapper instance on component unmount lifecycle phase
    return () => {
      if (socket) {
        socket.off("tableUpdated");
      }
    };
  }, [setTables, showToast]);

  /* ======================================
      CYCLE STATUS TOGGLE
  ====================================== */
  const cycle = async (id) => {
    const statuses = ["Available", "Occupied"];

    const table = tables.find((item) => item._id === id || item.id === id);
    const identifier = table?._id || table?.id;

    const currentStatus =
      table?.status === "available"
        ? "Available"
        : table?.status === "occupied"
          ? "Occupied"
          : table?.status || "Available";
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    const updated = await tableService.update(identifier, {
      ...table,
      status: nextStatus,
    });

    setTables(
      tables.map((item) =>
        item._id === identifier || item.id === identifier ? updated : item,
      ),
    );
    showToast(`Table status changed to ${nextStatus}`, "success");
  };

  /* ======================================
      REMOVE TABLE
  ====================================== */
  const remove = async (id) => {
    if (!confirm("Delete this table?")) return;

    await tableService.delete(id);

    setTables(tables.filter((table) => table.id !== id && table._id !== id));
    showToast("Table deleted successfully", "success");
  };

  /* ======================================
      ADD TABLE
  ====================================== */
  const add = async (form, reset) => {
    const tableNumber = parseInt(form.tableNo || form.tableNumber, 10);
    const capacity = parseInt(form.capacity, 10) || 4;

    if (!tableNumber) {
      showToast("Enter table number", "error");
      return;
    }

    if (
      tables.find(
        (table) =>
          table.tableNumber === tableNumber || table.tableNo === tableNumber,
      )
    ) {
      showToast("Table number already exists", "error");
      return;
    }

    const created = await tableService.create({
      tableNumber,
      capacity,
      status: form.status || "Available",
    });

    setTables([...tables, created]);

    reset();
    setAddOpen(false);

    showToast(`Table ${tableNumber} added successfully!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h2
            className="
              text-3xl
              font-bold
              text-[var(--cream)]
            "
          >
            Table Management
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-[var(--muted)]
            "
          >
            Manage restaurant tables, capacity & dynamic QR codes
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setAddOpen(true)}
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--card2)]
              px-5
              py-3
              font-medium
              text-[var(--cream)]
              transition-all
              duration-300
              hover:border-[var(--gold)]
              cursor-pointer
            "
          >
            ＋ Add Table
          </button>

          <button
            onClick={() =>
              showToast(
                "All operational QR codes synced successfully",
                "success",
              )
            }
            className="
              rounded-2xl
              bg-[var(--gold)]
              px-5
              py-3
              font-semibold
              text-black
              transition-all
              duration-300
              hover:scale-[1.03]
              cursor-pointer
            "
          >
            📱 Generate All QRs
          </button>
        </div>
      </div>

      {/* STATUS LEGEND */}
      <div className="flex flex-wrap gap-5">
        {[
          ["Available", "var(--green)"],
          ["Occupied", "var(--red)"],
        ].map(([label, color]) => (
          <div
            key={label}
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-3
                w-3
                rounded-full
              "
              style={{
                background: color,
              }}
            />
            <span
              className="
                text-sm
                text-[var(--muted)]
              "
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* TABLE CARDS GRID */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-5
        "
      >
        {tables.map((table) => {
          const displayNum = table.tableNumber || table.tableNo;
          const currentStatus = table.status?.toLowerCase();
          const isAvailable =
            currentStatus === "available" || currentStatus === "free";

          return (
            <button
              key={table._id || table.id}
              onClick={() => setQrTable(table)}
              className={`
                relative
                overflow-hidden
                rounded-[28px]
                border
                p-5
                text-left
                transition-all
                duration-300
                hover:-translate-y-1
                hover:scale-[1.02]
                cursor-pointer

                ${
                  isAvailable
                    ? "border-green-500/20 bg-[var(--green-dim)]"
                    : "border-red-500/20 bg-[var(--red-dim)]"
                }
              `}
            >
              <div className="absolute right-4 top-4 text-lg opacity-40">
                📱
              </div>

              <h3 className="text-4xl font-bold text-[var(--cream)]">
                {displayNum}
              </h3>

              <p className="mt-3 text-sm text-[var(--muted)]">
                Capacity:{" "}
                <span className="text-[var(--cream)] font-medium">
                  {table.capacity || 4} Seats
                </span>
              </p>

              <div
                className={`
                  mt-4
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  ${
                    isAvailable
                      ? "bg-green-500/10 text-green-300"
                      : "bg-red-500/10 text-red-300"
                  }
                `}
              >
                {table.status}
              </div>
            </button>
          );
        })}
      </div>

      {/* TABLE DATA LIST VIEW TABLE */}
      <div
        className="
          overflow-hidden
          rounded-[32px]
          border
          border-[var(--border)]
          bg-[var(--card)]
        "
      >
        <div className="border-b border-[var(--border)] px-6 py-5">
          <h3 className="text-xl font-semibold text-[var(--cream)]">
            Table Operations Overview
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-[var(--border)] bg-[var(--card2)]">
              <tr>
                {[
                  "Table ID",
                  "Capacity Configuration",
                  "Current Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-sm font-medium text-[var(--muted)]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tables.map((table) => {
                const targetId = table._id || table.id;
                const displayNum = table.tableNumber || table.tableNo;
                const currentStatus = table.status?.toLowerCase();
                const isAvailable =
                  currentStatus === "available" || currentStatus === "free";

                return (
                  <tr
                    key={targetId}
                    className="border-b border-[var(--border)] transition-all duration-300 hover:bg-[var(--card2)]"
                  >
                    <td className="px-6 py-5">
                      <div className="text-xl font-bold text-[var(--gold)]">
                        Table {displayNum}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-[var(--cream)] font-medium">
                      {table.capacity || 4} Available Seats
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          uppercase

                          ${
                            isAvailable
                              ? "bg-green-500/10 text-green-300"
                              : "bg-red-500/10 text-red-300"
                          }
                        `}
                      >
                        {table.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setQrTable(table)}
                          className="rounded-xl border border-[var(--border)] bg-[var(--card2)] px-4 py-2 text-sm text-[var(--cream)] hover:border-[var(--gold)] cursor-pointer transition-all"
                        >
                          📱 View QR
                        </button>
                        <button
                          onClick={() => cycle(targetId)}
                          className="rounded-xl border border-[var(--border)] bg-[var(--card2)] px-3 py-2 hover:border-[var(--gold)] cursor-pointer transition-all"
                          title="Toggle Status"
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => remove(targetId)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-red-300 cursor-pointer hover:bg-red-500/20 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS PERSISTENCE LOCKS */}
      <TableModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={add}
      />

      <QRModal
        table={qrTable}
        onClose={() => setQrTable(null)}
        showToast={showToast}
      />
    </div>
  );
}
