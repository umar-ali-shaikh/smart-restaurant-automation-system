const tabs = [
  "dashboard",
  "analytics",
  "category",
  "menu",
  "tables",
  "orders",
  "staff",
  "billing",
  "reviews",
];

export default function AdminTabs({ activeTab, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-4 py-2 text-sm capitalize ${
            activeTab === tab
              ? "bg-[#d4aa5a] font-semibold text-black"
              : "border border-[#2a241d] bg-[#14110c] hover:bg-[#1f1a14]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
