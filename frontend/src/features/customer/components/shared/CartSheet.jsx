import { useState } from "react";
import { C } from "../../../../styles/theme";

export default function CartSheet({
  cart,
  onClose,
  onAdd,
  onRemove,
  onPlaceOrder,
}) {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const serviceCharge = Math.round(subtotal * 0.05);
  const gst = Math.round(subtotal * 0.18);
  const total = Math.round(subtotal * 1.23);
  const [note, setNote] = useState("");

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.7)",
          zIndex: 100,
          backdropFilter: "blur(4px)",
          animation: "fadeIn .2s ease",
        }}
      />
      <div
        className="anim-slideUp"
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: C.deep,
          borderTop: `1px solid ${C.border}`,
          borderRadius: "24px 24px 0 0",
          zIndex: 101,
          padding: "0 20px 40px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: C.border,
            margin: "14px auto 20px",
          }}
        />
        <h3
          className="serif"
          style={{ fontSize: 27, color: C.cream, marginBottom: 4 }}
        >
          Your Order
        </h3>
        <p style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>
          Table #12 · {items.length} item{items.length !== 1 ? "s" : ""}
        </p>

        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 0",
              borderBottom: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <span style={{ fontSize: 26, width: 42, textAlign: "center" }}>
              {item.emoji}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.cream }}>{item.name}</div>
              <div style={{ fontSize: 12, color: C.gold, marginTop: 2 }}>
                Rs {item.price} each
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <button
                onClick={() => onRemove(item.id)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: C.goldDim,
                  border: `1px solid ${C.border}`,
                  color: C.gold,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                -
              </button>
              <span
                style={{
                  fontSize: 15,
                  color: C.cream,
                  fontWeight: 500,
                  minWidth: 16,
                  textAlign: "center",
                }}
              >
                {item.qty}
              </span>
              <button
                onClick={() => onAdd(item)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: C.goldDim,
                  border: `1px solid ${C.border}`,
                  color: C.gold,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 14,
            padding: 14,
            background: C.goldDim,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
          }}
        >
          {[
            ["Subtotal", `Rs ${subtotal}`],
            ["Service (5%)", `Rs ${serviceCharge}`],
            ["GST (18%)", `Rs ${gst}`],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 7,
                fontSize: 13,
                color: C.muted,
              }}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 8,
              borderTop: `1px solid ${C.border}`,
              fontSize: 15,
              color: C.cream,
              fontWeight: 500,
            }}
          >
            <span>Total</span>
            <span className="serif" style={{ color: C.gold, fontSize: 19 }}>
              Rs {total}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.muted,
              display: "block",
              marginBottom: 7,
            }}
          >
            Special Instructions
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Allergies, preferences, special requests..."
            style={{
              width: "100%",
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              color: C.text,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              padding: 11,
              resize: "none",
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={() => onPlaceOrder(note)}
          style={{
            width: "100%",
            marginTop: 18,
            padding: 17,
            background: `linear-gradient(135deg,${C.gold},${C.accent})`,
            border: "none",
            borderRadius: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: C.black,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span>Place Order & Send to Kitchen</span>
          <span>🍳</span>
        </button>
      </div>
    </>
  );
}
