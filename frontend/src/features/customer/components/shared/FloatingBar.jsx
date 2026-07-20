import { C } from "../../../../styles/theme";

export default function FloatingBar({ count, price, onClick }) {
  if (count === 0) return null;

  return (
    <div
      onClick={onClick}
      className="anim-fadeUp"
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 390,
        background:
          "linear-gradient(135deg,rgba(212,170,90,.97),rgba(193,122,58,.97))",
        borderRadius: 16,
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 50,
        cursor: "pointer",
        boxShadow: "0 8px 40px rgba(212,170,90,.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            background: "rgba(0,0,0,.2)",
            color: C.black,
            width: 28,
            height: 28,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {count}
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: C.black }}>
          Add to Cart
        </span>
      </div>
      <span
        className="serif"
        style={{ fontSize: 20, color: C.black, fontWeight: 600 }}
      >
        Rs {price.toLocaleString()}
      </span>
    </div>
  );
}
