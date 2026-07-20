import { useMemo, useState } from "react";
import MenuModal from "../components/MenuModal";
import { menuService } from "../services/menuService";

export default function MenuPage({
  menu = [],
  categories = [],
  setMenu,
  showToast,
}) {
  const [filter, setFilter] = useState("All");

  const [search] = useState("");

  const [editing, setEditing] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  /* ======================================
        DYNAMIC CUISINES
    ====================================== */

  const cuisines = useMemo(() => {
    const values = menu
      .map((dish) => dish.category?.name || dish.cuisine)
      .filter(Boolean);

    return [...new Set(values)];
  }, [menu]);

  /* ======================================
        FILTERED DATA
    ====================================== */

  const _filtered = useMemo(
    () =>
      menu.filter((dish) => {
        const matchFilter =
          filter === "All" ||
          (filter === "veg"
            ? dish.tags?.includes("veg") && !dish.tags?.includes("nonveg")
            : (dish.category?.name || dish.cuisine) === filter);

        const matchSearch =
          !search || dish.name?.toLowerCase().includes(search.toLowerCase());

        return matchFilter && matchSearch;
      }),

    [filter, menu, search],
  );

  /* ======================================
        OPEN MODAL
    ====================================== */

  const openModal = (dish = null) => {
    setEditing(dish);

    setModalOpen(true);
  };

  /* ======================================
        SAVE
    ====================================== */

  const save = async (form) => {
    const name = form.name.trim();

    const price = parseInt(form.price, 10) || 0;

    if (!name || !price || !form.cuisine) {
      showToast("Please fill name, price and category", "error");

      return;
    }

    const payload = {
      name,
      price,
      category: form.cuisine,
      description: form.desc,
      type: form.type,
      image: form.image,
    };

    /* EDIT */

    if (editing) {
      const updated = await menuService.updateItem(editing._id, payload);

      setMenu(menu.map((dish) => (dish._id === editing._id ? updated : dish)));

      showToast("✅ Menu item updated", "success");
    } else {
      /* ADD */
      const created = await menuService.createItem(payload);

      setMenu([...menu, created]);

      showToast("✅ New item added", "success");
    }

    setModalOpen(false);
  };

  /* ======================================
        REMOVE
    ====================================== */

  const _remove = async (id) => {
    if (!window.confirm("Delete this menu item?")) {
      return;
    }

    await menuService.deleteItem(id);

    setMenu(menu.filter((dish) => dish._id !== id));

    showToast("Item deleted", "error");
  };

  /* ======================================
        TOGGLE ACTIVE
    ====================================== */

  const _toggleActive = async (id) => {
    const updated = await menuService.toggleItem(id);

    setMenu(menu.map((dish) => (dish._id === id ? updated : dish)));

    showToast("Item visibility updated", "success");
  };

  /* ======================================
        UI
    ====================================== */

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
            Menu Management
          </h2>

          <p
            className="
                mt-1
                text-sm
                text-[var(--muted)]
              "
          >
            Add, edit or remove menu items
          </p>
        </div>

        <button
          onClick={() => openModal()}
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
          ＋ Add Menu Item
        </button>
      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3">
        {["All", ...cuisines, "veg"].map((chip) => (
          <button
            key={chip}
            onClick={() => setFilter(chip)}
            className={`
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  transition-all
                  duration-300

                  ${
                    filter === chip
                      ? `
                        border-[var(--gold)]
                        bg-[var(--gold)]
                        text-black
                      `
                      : `
                        border-[var(--border)]
                        bg-[var(--card2)]
                        text-[var(--cream)]
                        hover:border-[var(--gold)]
                      `
                  }
                `}
          >
            {chip === "veg" ? "🟢 Veg Only" : chip}
          </button>
        ))}
      </div>

      {/* KEEP YOUR REMAINING TABLE UI SAME */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {_filtered.map((dish) => (
          <div
            key={dish._id}
            className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[var(--border)]
        bg-gradient-to-br
        from-[#15100b]
        to-[#0c0906]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--gold)]
        hover:shadow-[0_0_30px_rgba(212,170,90,0.15)]
      "
          >
            {/* Glow */}
            <div
              className="
          absolute
          right-0
          top-0
          h-24
          w-24
          rounded-full
          bg-[var(--gold)]
          opacity-5
          blur-3xl
        "
            />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="overflow-hidden rounded-2xl">
                {dish.image ? (
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className="
      flex
      h-48
      items-center
      justify-center
      rounded-2xl
      bg-[var(--card2)]
      text-6xl
    "
                  >
                    🍽️
                  </div>
                )}
              </div>

              <span
                className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            absolute
            right-[6%]
           top-[4.5%]

            ${
              dish.tags?.includes("veg")
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }
          `}
              >
                {dish.tags?.includes("veg") ? "🟢 Veg" : "🔴 Non Veg"}
              </span>
            </div>

            {/* Content */}
            <div className="mt-5">
              <h3 className="text-xl font-bold text-[var(--cream)]">
                {dish.name}
              </h3>

              <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                {dish.description || dish.desc}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                  Category
                </p>

                <p className="font-medium text-[var(--cream)]">
                  {dish.category?.name || dish.cuisine || "Uncategorized"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                  Price
                </p>

                <p className="text-2xl font-bold text-[var(--gold)]">
                  ₹{dish.price}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => openModal(dish)}
                className="
            flex-1
            rounded-xl
            border
            border-[var(--gold)]
            px-4
            py-2
            text-sm
            font-medium
            text-[var(--gold)]
            transition-all
            hover:bg-[var(--gold)]
            hover:text-black
          "
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => _remove(dish._id)}
                className="
            flex-1
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-red-400
            transition-all
            hover:bg-red-500/20
          "
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}

      <MenuModal
        key={`${modalOpen ? "open" : "closed"}-${editing?._id ?? "new"}`}
        open={modalOpen}
        item={editing}
        menus={menu}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />
    </div>
  );
}
