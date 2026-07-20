import { useState } from "react";
import Modal from "../../../components/ui/Modal";

export default function TableModal({
  open,
  onClose,
  onAdd,
}) {
  const [form, setForm] = useState({
    tableNo: "",
    capacity: 4,
    status: "Available", // Synced to uppercase backend standards
  });

  const update = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  const submit = () =>
    onAdd(form, () =>
      setForm({
        tableNo: "",
        capacity: 4,
        status: "Available",
      })
    );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Table"
      subtitle="Create a new table and generate QR code"
    >
      <div className="space-y-6">

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* TABLE NUMBER */}
          <label className="space-y-2">
            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              Table Number
            </span>

            <input
              type="number"
              value={form.tableNo}
              onChange={(event) =>
                update(
                  "tableNo",
                  event.target.value
                )
              }
              placeholder="e.g. 15"
              className="
                w-full
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card2)]
                px-4
                py-3
                text-[var(--text)]
                placeholder:text-[var(--muted)]
                outline-none
                transition-all
                duration-300
                focus:border-[var(--gold)]
              "
            />
          </label>

          {/* CAPACITY */}
          <label className="space-y-2">
            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              Capacity (Seats)
            </span>

            <input
              type="number"
              value={form.capacity}
              onChange={(event) =>
                update(
                  "capacity",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card2)]
                px-4
                py-3
                text-[var(--text)]
                outline-none
                transition-all
                duration-300
                focus:border-[var(--gold)]
              "
            />
          </label>

          {/* STATUS */}
          <label className="space-y-2 md:col-span-2">
            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              Status
            </span>

            <select
              value={form.status}
              onChange={(event) =>
                update(
                  "status",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card2)]
                px-4
                py-3
                text-[var(--text)]
                outline-none
                transition-all
                duration-300
                focus:border-[var(--gold)]
                cursor-pointer
              "
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
            </select>
          </label>
        </div>

        {/* PREVIEW */}
        <div
          className="
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--card2)]
            p-5
          "
        >
          <div
            className="
              mb-3
              text-xs
              uppercase
              tracking-[2px]
              text-[var(--muted)]
            "
          >
            Table Preview
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3
                className="
                  text-5xl
                  font-bold
                  text-[var(--gold)]
                "
              >
                {form.tableNo || "--"}
              </h3>
            </div>

            <div className="text-right">
              <div
                className="
                  text-sm
                  text-[var(--cream)]
                  font-medium
                "
              >
                {form.capacity} Seats
              </div>

              <div
                className={`
                  mt-3
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider

                  ${
                    form.status === "Available"
                      ? `
                        bg-green-500/10
                        text-green-300
                      `
                      : `
                        bg-red-500/10
                        text-red-300
                      `
                  }
                `}
              >
                {form.status}
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={submit}
            className="
              flex-1
              rounded-2xl
              bg-[var(--gold)]
              px-5
              py-3
              font-semibold
              text-black
              transition-all
              duration-300
              hover:scale-[1.02]
              cursor-pointer
            "
          >
            Add Table
          </button>

          <button
            onClick={onClose}
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--card3)]
              px-5
              py-3
              font-medium
              text-[var(--cream)]
              cursor-pointer
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}