import { C } from "../../../../styles/theme";

export default function SuccessScreen({ cart, orderNum, onFeedback }) {
  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  return (
    <div
      style={{
        background: C.deep,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        textAlign: "center",
      }}
    >
      <div
        className="anim-glow"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `2px solid ${C.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          marginBottom: 28,
          background: "radial-gradient(circle,rgba(212,170,90,.1),transparent)",
        }}
      >
        ✓
      </div>
      <h2
        className="serif"
        style={{
          fontSize: 40,
          fontWeight: 300,
          color: C.cream,
          marginBottom: 8,
        }}
      >
        Order <em style={{ color: C.gold, fontStyle: "italic" }}>Placed!</em>
      </h2>
      <p
        style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 280 }}
      >
        Sent to the kitchen. Sit back and relax.
      </p>

      <div
        style={{
          marginTop: 28,
          padding: "18px 32px",
          background: C.goldDim,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
        }}
      >
        <label
          style={{
            fontSize: 9,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          Your Order Number
        </label>
        <div
          className="serif"
          style={{ fontSize: 42, color: C.gold, marginTop: 4 }}
        >
          #{orderNum}
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          width: "100%",
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <div
          style={{
            padding: "11px 16px",
            borderBottom: `1px solid ${C.border}`,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          Order Summary
        </div>
        {Object.values(cart).map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 16px",
              fontSize: 13,
              borderBottom: "1px solid rgba(255,255,255,.04)",
            }}
          >
            <span style={{ color: C.text }}>
              {item.emoji} {item.name} × {item.qty}
            </span>
            <span className="serif" style={{ color: C.gold, fontSize: 16 }}>
              Rs {item.qty * item.price}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <span style={{ color: C.cream, fontWeight: 500 }}>Total</span>
          <span className="serif" style={{ color: C.gold, fontSize: 20 }}>
            Rs {Math.round(totalPrice * 1.23)}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          fontSize: 12,
          color: C.muted,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          className="anim-pulse"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.green,
            display: "inline-block",
          }}
        />
        Order live on Counter Dashboard · Preparing now
      </div>

      <button
        onClick={onFeedback}
        style={{
          marginTop: 28,
          color: C.gold,
          fontSize: 13,
          textDecoration: "underline",
          textUnderlineOffset: 3,
          cursor: "pointer",
          background: "none",
          border: "none",
        }}
      >
        Rate your experience →
      </button>
    </div>
  );
}
