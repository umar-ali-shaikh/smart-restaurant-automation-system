import { useState } from "react";
import StaffModal from "../components/StaffModal";
import { staffService } from "../services/staffService";

const colors = [
  "#d4aa5a",
  "#9a6ae8",
  "#5a84e8",
  "#e8883a",
  "#4a9a6f",
  "#e85a84",
];

export default function StaffPage({
  staff,
  setStaff,
  showToast,
}) {
  const [editing, setEditing] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const save = async (form) => {
    const name = form.name.trim();
    const employeeId =
      (form.employeeId || form.username).trim();
    const password =
      form.password.trim();

    if (
      !name ||
      !employeeId ||
      (!editing && !password)
    ) {
      showToast(
        editing ? "Name and Employee ID are required" : "Fill all fields",
        "error"
      );
      return;
    }

    if (
      !editing &&
      staff.find(
        (user) =>
          user.employeeId ===
          employeeId
      )
    ) {
      showToast(
        "Employee ID already exists",
        "error"
      );
      return;
    }

    if (editing) {
      const updated = await staffService.update(editing.id, {
        name,
        role: form.role,
        employeeId,
        username: employeeId,
        ...(password ? { password } : {}),
      });

      setStaff(
        staff.map((user) =>
          user.id === editing.id
            ? updated
            : user
        )
      );
    } else {
      const created = await staffService.create({
        name,
        role: form.role,
        employeeId,
        username: employeeId,
        password,
        color: colors[staff.length % colors.length],
      });

      setStaff([...staff, created]);
    }

    setOpen(false);

    showToast(
      editing
        ? "Staff account updated!"
        : "Staff account created!",
      "success"
    );
  };

  const remove = async (id) => {
    if (
      !confirm(
        "Delete this staff account?"
      )
    )
      return;

    await staffService.delete(id);

    setStaff(
      staff.filter(
        (user) => user.id !== id
      )
    );

    showToast(
      "Staff account removed",
      "error"
    );
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
            Staff Accounts
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-[var(--muted)]
            "
          >
            Manage kitchen staff &
            admin accounts
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
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
          "
        >
          ＋ Add Staff
        </button>
      </div>

      {/* STAFF GRID */}
      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {staff.map(
          (user, index) => (
            <div
              key={user.id}
              className="
                group
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-[var(--border)]
                bg-[var(--card)]
                p-6
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-[var(--gold)]
              "
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
            >

              {/* GLOW */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  transition-all
                  duration-500
                  group-hover:opacity-100
                "
                style={{
                  background: `radial-gradient(circle at top right, ${user.color}20, transparent 60%)`,
                }}
              />

              {/* TOP */}
              <div
                className="
                  relative
                  z-10
                  flex
                  items-start
                  justify-between
                "
              >

                {/* AVATAR */}
                <div
                  className="
                    flex
                    h-[64px]
                    w-[64px]
                    items-center
                    justify-center
                    rounded-full
                    text-2xl
                    font-bold
                    text-[var(--bg)]
                    shadow-lg
                  "
                  style={{
                    background:
                      user.color ||
                      colors[
                        index %
                          colors.length
                      ],
                  }}
                >
                  {user.name[0]}
                </div>

                {/* ROLE */}
                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider

                    ${
                      user.role ===
                      "admin"
                        ? `
                          bg-[var(--gold-dim)]
                          text-[var(--gold)]
                        `
                        : `
                          bg-blue-500/10
                          text-blue-300
                        `
                    }
                  `}
                >
                  {user.role}
                </span>
              </div>

              {/* NAME */}
              <div className="relative z-10 mt-5">

                <h3
                  className="
                    text-2xl
                    font-bold
                    text-[var(--cream)]
                  "
                >
                  {user.name}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[var(--muted)]
                  "
                >
                  @{user.employeeId || user.username}
                </p>
              </div>

              {/* STATUS */}
              <div
                className={`
                  relative
                  z-10
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  uppercase
                  tracking-wider

                  ${
                    user.online
                      ? `
                        bg-green-500/10
                        text-green-300
                      `
                      : `
                        bg-[var(--card2)]
                        text-[var(--muted)]
                      `
                  }
                `}
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                  "
                  style={{
                    background:
                      user.online
                        ? "var(--green)"
                        : "var(--muted)",
                  }}
                />

                {user.online
                  ? "Online"
                  : "Offline"}
              </div>

              {/* ACTIONS */}
              <div
                className="
                  relative
                  z-10
                  mt-6
                  flex
                  gap-2
                "
              >

                {/* EDIT */}
                <button
                  onClick={() => {
                    setEditing(user);
                    setOpen(true);
                  }}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--card2)]
                    px-4
                    py-3
                    text-sm
                    text-[var(--cream)]
                    transition-all
                    duration-300
                    hover:border-[var(--gold)]
                  "
                >
                  ✏️ Edit
                </button>

                {/* ONLINE */}
                <button
                  onClick={async () => {
                    const updated = await staffService.updateStatus(
                      user.id,
                      !user.online,
                    );
                    setStaff(
                      staff.map((item) =>
                        item.id === user.id ? updated : item,
                      ),
                    );
                  }}
                  className={`
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    px-4
                    py-3
                    transition-all
                    duration-300

                    ${
                      user.online
                        ? `
                          bg-red-500/10
                          text-red-300
                        `
                        : `
                          bg-green-500/10
                          text-green-300
                        `
                    }
                  `}
                >
                  {user.online
                    ? "🔴"
                    : "🟢"}
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    remove(user.id)
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-500/10
                    px-4
                    py-3
                    text-red-300
                    transition-all
                    duration-300
                    hover:bg-red-500/20
                  "
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* MODAL */}
      <StaffModal
        key={`${open ? "open" : "closed"}-${editing?.id ?? "new"}`}
        open={open}
        staffUser={editing}
        onClose={() =>
          setOpen(false)
        }
        onSave={save}
      />
    </div>
  );
}
