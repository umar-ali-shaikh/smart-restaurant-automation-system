// Navbar.jsx

import { formatDateLabel } from "../../utils/dashboardHelpers";

export default function Navbar({
  now,
  soundOn,
  onToggleSound,
  // onAddDemoOrder,
  onToggleSidebar,
  user,
  setUser,
}) {
  return (
    <>
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-30 w-full overflow-hidden border-b border-[rgba(212,170,90,0.15)] bg-[rgba(17,16,9,0.92)] px-4 py-4 backdrop-blur xl:px-7">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d4aa5a] text-xl shadow-[0_0_18px_rgba(212,170,90,0.18)]">
              🍽️
            </div>

            <div className="min-w-0">
              <p className="truncate font-['Cormorant_Garamond'] text-2xl text-[#f5ede0] sm:text-3xl">
                Counter <span className="text-[#d4aa5a]">Dashboard</span>
              </p>

              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.18em] text-[#8a7d6a] sm:text-[11px] sm:tracking-[0.22em]">
                The Grand Mesa Hotel · Kitchen View
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 xl:justify-end">
            {/* LIVE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,154,111,0.3)] bg-[rgba(74,154,111,0.1)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#4a9a6f] sm:px-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4a9a6f]" />
              Live Orders
            </div>

            {/* DEMO */}
            {/* <button
              type="button"
              onClick={onAddDemoOrder}
              className="rounded-xl border border-[rgba(212,170,90,0.35)] bg-[rgba(212,170,90,0.1)] px-3 py-2 text-xs font-medium text-[#d4aa5a] transition hover:bg-[rgba(212,170,90,0.16)] sm:px-4"
            >
              <span className="sm:hidden">+ Demo</span>
              <span className="hidden sm:inline">+ Demo Order</span>
            </button> */}

            {/* SOUND */}
            <button
              type="button"
              onClick={onToggleSound}
              className="rounded-xl border border-[rgba(212,170,90,0.15)] bg-[rgba(212,170,90,0.08)] px-3 py-2 text-xs font-medium text-[#8a7d6a] transition hover:border-[rgba(212,170,90,0.35)] hover:text-[#d4aa5a] sm:px-4"
            >
              {soundOn ? "🔔 Sound On" : "🔕 Sound Off"}
            </button>

            {/* MENU BUTTON */}
            <button
              onClick={onToggleSidebar}
              className="
                w-10 h-10 flex items-center justify-center
                rounded-full
                border border-[#2a241d]
                bg-[#14110c]
                text-[#d4aa5a]
                hover:bg-[#1f1a14]
                transition
              "
            >
              ☰
            </button>

            {/* TIME */}
            <div className="min-w-[76px] shrink-0 text-right sm:min-w-[96px]">
              <div className="font-['DM_Sans'] text-3xl font-semibold leading-none tabular-nums text-[#d4aa5a] sm:text-4xl">
                {now?.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-1 text-[11px] text-[#8a7d6a]">
                {formatDateLabel(now)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="hidden">
        {/* SIDEBAR*/}
        <div className="w-[260px] bg-[#111009] border-r border-yellow-700/20 p-4 flex flex-col">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-yellow-500 rounded-full flex items-center justify-center">
              🍽️
            </div>

            <div>
              <h2 className="text-lg">
                Mesa <span className="text-yellow-400">Admin</span>
              </h2>

              <p className="text-xs text-yellow-400">Admin Panel</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="space-y-2 flex-1">
            <div className="p-2 rounded hover:bg-yellow-500/10">
              📊 Analytics
            </div>

            <div className="p-2 rounded hover:bg-yellow-500/10">🍽 Menu</div>

            <div className="p-2 rounded hover:bg-yellow-500/10">🪑 Tables</div>

            <div className="p-2 rounded hover:bg-yellow-500/10">📦 Orders</div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black">
              {user?.name?.[0] || "A"}
            </div>

            <div className="text-sm">{user?.name || "Admin"}</div>

            <button
              onClick={() => setUser(null)}
              className="ml-auto text-red-400"
            >
              ⏻
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
