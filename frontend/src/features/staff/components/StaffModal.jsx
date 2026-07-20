import { useState } from "react";
import Modal from "../../../components/ui/Modal";

const blank = {
  name: "",
  role: "kitchen",
  employeeId: "",
  password: "",
};

export default function StaffModal({
  open,
  staffUser,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState(() =>
      staffUser
        ? {
            name: staffUser.name,
            role: staffUser.role,
            employeeId:
              staffUser.employeeId || staffUser.username,
            password: "",
          }
        : blank
    );

  const update = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        staffUser
          ? "Edit Staff"
          : "Add Staff Account"
      }
      subtitle="Create login credentials for hotel staff"
    >
      <div className="space-y-6">

        {/* TOP INFO */}
        <div
          className="
            flex
            items-center
            gap-4
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--card2)]
            p-5
          "
        >
          {/* AVATAR */}
          <div
            className="
              flex
              h-[72px]
              w-[72px]
              items-center
              justify-center
              rounded-full
              bg-[var(--gold)]
              text-3xl
              font-bold
              text-black
            "
          >
            {form.name
              ? form.name[0]
                  .toUpperCase()
              : "S"}
          </div>

          {/* INFO */}
          <div>

            <h3
              className="
                text-2xl
                font-bold
                text-[var(--cream)]
              "
            >
              {form.name ||
                "Staff Member"}
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-[var(--muted)]
              "
            >
              {form.role ===
              "admin"
                ? "Administrator Access"
                : "Kitchen Staff Access"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* FULL NAME */}
          <label className="space-y-2">

            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              Full Name
            </span>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                update(
                  "name",
                  e.target.value
                )
              }
              placeholder="e.g. Ravi Kumar"
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

          {/* ROLE */}
          <label className="space-y-2">

            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              Role
            </span>

            <select
              value={form.role}
              onChange={(e) =>
                update(
                  "role",
                  e.target.value
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
            >
              <option value="admin">
                Admin
              </option>

              <option value="kitchen">
                Kitchen Staff
              </option>
            </select>
          </label>

          {/* USERNAME */}
          <label className="space-y-2">

            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              Employee ID
            </span>

            <input
              type="text"
              value={form.employeeId}
              onChange={(e) =>
                update(
                  "employeeId",
                  e.target.value
                )
              }
              placeholder="EMP001"
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

          {/* PASSWORD */}
          <label className="space-y-2">

            <span
              className="
                text-sm
                font-medium
                text-[var(--cream)]
              "
            >
              {staffUser ? "New Password" : "Password"}
            </span>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                update(
                  "password",
                  e.target.value
                )
              }
              placeholder={staffUser ? "Leave blank to keep current password" : "password"}
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
        </div>

        {/* ACCESS BOX */}
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
              mb-2
              text-xs
              uppercase
              tracking-[2px]
              text-[var(--muted)]
            "
          >
            Access Level
          </div>

          <div
            className="
              text-sm
              leading-relaxed
              text-[var(--cream)]
            "
          >
            {form.role ===
            "admin"
              ? "Admin users can manage staff, tables, menu items, and orders."
              : "Kitchen staff can manage orders and food preparation status."}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">

          <button
            onClick={() =>
              onSave(form)
            }
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
            "
          >
            {staffUser
              ? "Save Staff"
              : "Add Staff"}
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
              transition-all
              duration-300
              hover:bg-[var(--card)]
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
