import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

const blank = {
  name: "",
  image: "",
  cuisine: "",
  price: "",
  desc: "",
  type: "veg",
  chef: "false",
};

export default function MenuModal({
  open,
  item,
  onClose,
  onSave,
  categories = [],
}) {
  const initialForm = useMemo(() => {
    if (item) {
      return {
        name: item.name || "",
        image: item.image || "",
        cuisine: item.category?._id || item.category || item.cuisine || "",
        price: item.price || "",
        desc: item.description || "",
        type: item.tags?.[0] || "veg",
        chef: String(item.chef || false),
      };
    }

    return blank;
  }, [item]);

  const [form, setForm] = useState(initialForm);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="
          relative
          z-10
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-[32px]
          border
          border-[var(--border)]
          bg-[var(--card)]
          shadow-2xl
          animate-[popup_.25s_ease]
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-start
            justify-between
            border-b
            border-[var(--border)]
            bg-[var(--card)]
            px-6
            py-5
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-[var(--cream)]">
              {item ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Item will reflect live in the customer app
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[var(--card2)]
              text-[var(--cream)]
            "
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DISH NAME */}
            <label className="space-y-2">
              <span className="text-sm text-[var(--cream)]">Dish Name</span>

              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Paneer Tikka"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--card2)]
                  px-4
                  py-3
                "
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-[var(--cream)]">Item Image</span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  update("image", file);
                }}
              />

              {form.image && (
                <img
                  src={typeof form.image === "string" ? form.image : URL.createObjectURL(form.image)}
                  alt="preview"
                  className="
        mt-3
        h-32
        w-full
        rounded-2xl
        object-cover
        border
        border-[var(--border)]
      "
                />
              )}
            </label>

            {/* CATEGORY */}
            <label className="space-y-2">
              <span className="text-sm text-[var(--cream)]">Category</span>

              <select
                value={form.cuisine}
                onChange={(e) => update("cuisine", e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--card2)]
                  px-4
                  py-3
                "
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.emoji || "🍽️"} {category.name}
                  </option>
                ))}
              </select>
            </label>

            {/* PRICE */}
            <label className="space-y-2">
              <span className="text-sm text-[var(--cream)]">Price</span>

              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="499"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--card2)]
                  px-4
                  py-3
                "
              />
            </label>

            {/* TYPE */}
            <label className="space-y-2">
              <span className="text-sm text-[var(--cream)]">Food Type</span>

              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className="
      w-full
      rounded-2xl
      border
      border-[var(--border)]
      bg-[var(--card2)]
      px-4
      py-3
      text-[var(--cream)]
      outline-none
    "
              >
                <option value="veg">🟢 Vegetarian</option>

                <option value="nonveg">🔴 Non Vegetarian</option>
              </select>
            </label>
          </div>

          {/* DESCRIPTION */}
          <label className="space-y-2 block">
            <span className="text-sm text-[var(--cream)]">Description</span>

            <textarea
              rows={4}
              value={form.desc}
              onChange={(e) => update("desc", e.target.value)}
              placeholder="Dish description..."
              className="
                w-full
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card2)]
                px-4
                py-3
              "
            />
          </label>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onSave(form)}
              className="
                flex-1
                rounded-2xl
                bg-[var(--gold)]
                px-5
                py-3
                font-semibold
                text-black
              "
            >
              Save Item
            </button>

            <button
              onClick={onClose}
              className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card2)]
                px-5
                py-3
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
