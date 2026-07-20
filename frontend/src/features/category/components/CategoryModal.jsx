import { useState } from "react";
import { createPortal } from "react-dom";

const blank = {
  name: "",
  description: "",
  image: null,
};

export default function CategoryModal({
  open,
  item,
  onClose,
  onSave,
}) {
  const [preview, setPreview] = useState(item?.image || "");

  const [form, setForm] = useState(() =>
    item
      ? {
          name: item.name || "",
          description: item.description || "",
          image: null,
        }
      : blank
  );

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[var(--cream)]">
              {item ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage food categories
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--card2)] text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Image */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--cream)]">
              Category Image
            </span>

            <div className="overflow-hidden rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--card2)]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center gap-3 text-[var(--muted)]">
                  <span className="text-6xl">🖼️</span>
                  <p>Upload Category Image</p>
                </div>
              )}

              <label className="block cursor-pointer bg-[var(--gold)] px-4 py-3 text-center font-semibold text-black transition hover:opacity-90">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>
          </label>

          {/* Name */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--cream)]">
              Category Name
            </span>

            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Italian"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          {/* Description */}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--cream)]">
              Description
            </span>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Authentic Italian cuisine including pizza, pasta and risotto."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onSave(form)}
              className="flex-1 rounded-2xl bg-[var(--gold)] px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              {item ? "Update Category" : "Save Category"}
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-5 py-3 transition hover:border-red-500 hover:text-red-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}