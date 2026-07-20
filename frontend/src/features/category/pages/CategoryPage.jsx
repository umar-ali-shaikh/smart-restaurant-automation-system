import { useState } from "react";
import CategoryModal from "../components/CategoryModal";
import { categoryService } from "../services/categoryService";

export default function CategoryPage({
  categories = [],
  setCategories,
  showToast,
}) {
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (category = null) => {
    setEditing(category);
    setModalOpen(true);
  };

  const save = async (form) => {
    if (!form.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    const payload = new FormData();

    payload.append("name", form.name.trim());
    payload.append("description", form.description.trim());

    if (form.image) {
      payload.append("image", form.image);
    }

    try {
      if (editing) {
        const updated = await categoryService.update(editing._id, payload);

        setCategories(
          categories.map((cat) => (cat._id === editing._id ? updated : cat)),
        );

        showToast("✅ Category Updated", "success");
      } else {
        const created = await categoryService.create(payload);

        setCategories([...categories, created]);

        showToast("✅ Category Added", "success");
      }

      setModalOpen(false);
    } catch (error) {
      showToast(error.message || "Failed to save category", "error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await categoryService.delete(id);

      setCategories(categories.filter((cat) => cat._id !== id));

      showToast("Category Deleted", "success");
    } catch (error) {
      showToast(error.message || "Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--cream)]">Categories</h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage menu categories
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
          "
        >
          + Add Category
        </button>
      </div>

      {/* CATEGORY GRID */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category._id}
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
            {/* Glow Effect */}
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

            {/* Icon */}
            <div className="relative overflow-hidden rounded-2xl">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-48 w-full rounded-2xl object-cover"
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

              <span
                className="
      absolute
      right-3
      top-3
      rounded-full
      border
      border-[var(--gold)]/30
      bg-black/60
      px-3
      py-1
      text-xs
      font-medium
      text-[var(--gold)]
      backdrop-blur-sm
    "
              >
                Category
              </span>
            </div>

            {/* Content */}
            <div className="mt-5">
              <h3 className="text-2xl font-bold text-[var(--cream)]">
                {category.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] min-h-[48px]">
                {category.description || "No description available"}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                  Created
                </p>

                <p className="text-sm text-[var(--cream)]">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                  Status
                </p>

                <p className="font-medium text-green-400">Active</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => openModal(category)}
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
                onClick={() => remove(category._id)}
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

      {/* EMPTY STATE */}

      {categories.length === 0 && (
        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-[var(--border)]
            p-10
            text-center
          "
        >
          <p className="text-[var(--muted)]">No categories found.</p>
        </div>
      )}

      <CategoryModal
        key={`${modalOpen ? "open" : "closed"}-${editing?._id ?? "new"}`}
        open={modalOpen}
        item={editing}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />
    </div>
  );
}
