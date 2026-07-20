import { C } from "../../../../styles/theme";

export default function TopBar({
  title,
  goldPart,
  onBack,
  orderCount = 0,
  onOrdersClick,
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,9,6,.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Back */}
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: C.gold,
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ←
        </button>
      ) : (
        <div style={{ width: 24 }} />
      )}

      {/* Title */}
      <div
        className="serif"
        style={{
          fontSize: 22,
          color: C.cream,
        }}
      >
        {goldPart && <span style={{ color: C.gold }}>{goldPart}</span>}
        {title && ` ${title}`}
      </div>

      {/* My Orders */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log("Orders clicked");
          console.log(onOrdersClick);
          onOrdersClick?.();
        }}
        style={{
          position: "relative",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 28,
          color: C.gold,
        }}
        title="My Orders"
      >
        🛒
        {orderCount > 0 && (
          <span
            className="anim-badgePop"
            style={{
              position: "absolute",
              top: -6,
              right: -8,
              background: "#E53935",
              color: "#fff",
              minWidth: 18,
              height: 18,
              padding: "0 5px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {orderCount}
          </span>
        )}
      </button>
    </div>
  );
}
