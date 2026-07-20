import { useEffect, useState } from "react";
import { C } from "../../../../styles/theme";
import { tableService } from "../../../tables/services/tableService";

export default function WelcomeScreen({ onExplore }) {
  const [tableNo, setTableNo] = useState("");
  const [isQrScan, setIsQrScan] = useState(false); // Tracks if user scanned QR or selected manually
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const initializeTable = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const tableParam = queryParams.get("table");

      if (!tableParam) return;

      const parsedNum = Number(tableParam);

      if (isNaN(parsedNum)) return;

      try {
        // Table occupy
        await tableService.bookTableOnScan(parsedNum);

        // Save locally
        localStorage.setItem("tableNumber", parsedNum);

        setTableNo(parsedNum);
        setIsQrScan(true);
      } catch (err) {
        alert(err.message || "Unable to book table");
      }
    };

    initializeTable();
  }, []);

  useEffect(() => {
    const loadTables = async () => {
      try {
        setTables(await tableService.getAll());
      } catch (err) {
        console.log(err);
      }
    };

    loadTables();
  }, []);

  // Form submit handling jab user manual table select karega
  const handleExploreClick = () => {
    if (!tableNo) {
      alert("Please select or enter your Table Number to proceed!");
      return;
    }

    // Agar manually select kiya hai aur URL me parameter nahi hai, toh use URL update karke bhej sakte hain
    if (!isQrScan) {
      const newUrl = `${window.location.pathname}?table=${tableNo}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
    localStorage.setItem("tableNumber", tableNo);
    onExplore();
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg,#1a1308 0%,#0a0906 60%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg,rgba(212,170,90,.03) 0,rgba(212,170,90,.03) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(-45deg,rgba(212,170,90,.03) 0,rgba(212,170,90,.03) 1px,transparent 1px,transparent 20px)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "40px 28px",
          textAlign: "center",
        }}
      >
        <div
          className="anim-glow"
          style={{
            width: 88,
            height: 88,
            border: `1.5px solid ${C.gold}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            background:
              "radial-gradient(circle,rgba(212,170,90,.08),transparent)",
            fontSize: 36,
          }}
        >
          🍽️
        </div>
        <p
          className="anim-fadeUp"
          style={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.muted,
            marginBottom: 8,
            animationDelay: ".1s",
          }}
        >
          THE GRAND MESA HOTEL
        </p>
        <h1
          className="serif anim-fadeUp"
          style={{
            fontSize: 50,
            fontWeight: 300,
            lineHeight: 1.1,
            color: C.cream,
            marginBottom: 8,
            animationDelay: ".2s",
          }}
        >
          Fine <em style={{ color: C.gold, fontStyle: "italic" }}>Dining,</em>
          <br />
          Reimagined
        </h1>
        <div
          className="anim-fadeUp"
          style={{
            fontSize: 12,
            color: C.gold,
            marginBottom: 28,
            background: C.goldDim,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "8px 18px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            lineHeight: 1.5,
            animationDelay: ".32s",
          }}
        >
          <span style={{ fontSize: 9, opacity: 0.7 }}>✦</span>
          Your AI helper to find and enjoy great food experiences
          <span style={{ fontSize: 9, opacity: 0.7 }}>✦</span>
        </div>
        <div
          className="anim-fadeUp"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            marginBottom: 32,
            animationDelay: ".35s",
          }}
        >
          <span style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
          <span style={{ flex: 1, height: 1, background: C.border }} />
        </div>
        <div
          className="anim-fadeUp"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            width: "100%",
            marginBottom: 32,
            animationDelay: ".4s",
          }}
        >
          {[
            ["🤖", "AI Picks"],
            ["💬", "Live Reviews"],
            ["⚡", "Fast Order"],
          ].map(([icon, label]) => (
            <div
              key={label}
              style={{
                background: C.goldDim,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "14px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                fontSize: 9,
                color: C.muted,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* DYNAMIC TABLE SELECTOR OPTION BLOCK */}
        {!isQrScan && (
          <div
            className="anim-fadeUp"
            style={{
              width: "100%",
              marginBottom: 24,
              textAlign: "left",
              animationDelay: ".45s",
            }}
          >
            <label
              style={{
                fontSize: 11,
                color: C.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              Select Your Table Number:
            </label>
            <select
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#14110c",
                border: `1px solid ${tableNo ? C.gold : C.border}`,
                borderRadius: 12,
                color: tableNo ? C.cream : C.muted,
                fontSize: 14,
                outline: "none",
                cursor: "pointer",
                transition: ".3s",
              }}
            >
              <option value="" disabled>
                -- Choose Table --
              </option>
              {tables.map((table) => (
                <option
                  key={table._id}
                  value={table.tableNumber}
                  style={{ background: "#14110c", color: C.cream }}
                >
                  Table #{table.tableNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="anim-fadeUp"
          onClick={handleExploreClick}
          style={{
            width: "100%",
            padding: 17,
            background: `linear-gradient(135deg,${C.gold},${C.accent})`,
            border: "none",
            borderRadius: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: C.black,
            cursor: "pointer",
            transition: ".3s",
            animationDelay: ".5s",
          }}
        >
          Explore Menu →
        </button>

        {/* FOOTER TABLE NUMBER STATUS PREVIEW */}
        <p
          className="anim-fadeUp"
          style={{
            fontSize: 12,
            color: C.muted,
            marginTop: 14,
            animationDelay: ".6s",
          }}
        >
          {tableNo ? (
            <>
              Selected:{" "}
              <strong style={{ color: C.gold }}>Table #{tableNo}</strong>
            </>
          ) : (
            <span style={{ color: "rgba(212,170,90,0.5)" }}>
              No Table Selected Yet
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
