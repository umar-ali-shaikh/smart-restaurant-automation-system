export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type}`}>
      <span className="text-xl">{toast.type === "success" ? "✅" : "❌"}</span>
      <span>{toast.message}</span>
    </div>
  );
}
