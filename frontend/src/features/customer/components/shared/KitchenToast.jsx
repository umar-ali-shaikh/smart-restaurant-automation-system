import { useEffect } from "react";

export default function KitchenToast({ orderNo, onDone }) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 4000);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <div className="anim-toast" style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,rgba(74,154,111,.96),rgba(30,80,50,.96))", border: "1px solid rgba(74,154,111,.4)", borderRadius: 14, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 300, boxShadow: "0 8px 32px rgba(74,154,111,.3)", maxWidth: 360, width: "90%", pointerEvents: "none" }}>
      <span style={{ fontSize: 24 }}>🍳</span>
      <div>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>Order sent to kitchen!</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.75)", marginTop: 2 }}>Counter Dashboard updated · Order #{orderNo}</div>
      </div>
    </div>
  );
}
