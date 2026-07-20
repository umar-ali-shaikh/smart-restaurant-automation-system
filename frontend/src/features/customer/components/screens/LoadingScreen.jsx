import { C } from "../../../../styles/theme";

export default function LoadingScreen() {
  return (
    <div style={{ background: C.black, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div className="anim-spin" style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTopColor: C.gold, borderRadius: "50%" }} />
      <p className="anim-shimmer" style={{ fontSize: 13, color: C.muted }}>Curating your experience...</p>
    </div>
  );
}
