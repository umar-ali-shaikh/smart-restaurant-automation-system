import { useRef, useState } from "react";
import { C } from "../../../../styles/theme";

function getRankBg(index) {
  if (index === 0) return "linear-gradient(135deg,#FFD700,#FFA500)";
  if (index === 1) return "linear-gradient(135deg,#C0C0C0,#A0A0A0)";
  if (index === 2) return "linear-gradient(135deg,#CD7F32,#A0522D)";
  return "rgba(212,170,90,.3)";
}

function getRankColor(index) {
  return index <= 1 ? "#000" : "#fff";
}

function formatShortDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TrendingCarousel({
  dishes = [],
  title = "Trending Tonight",
}) {
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (event) => {
    setIsDragging(true);
    startX.current = event.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };

  const onMouseMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft =
      scrollLeft.current - (x - startX.current) * 1.5;
  };

  const stopDrag = () => setIsDragging(false);

  const onScroll = () => {
    if (!trackRef.current) return;
    setActiveDot(
      Math.min(
        Math.round(trackRef.current.scrollLeft / 234),
        dishes.length - 1,
      ),
    );
  };

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          marginBottom: 12,
        }}
      >
        <span className="serif" style={{ fontSize: 22, color: C.cream }}>
          {title}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10,
            color: C.gold,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          <span
            className="anim-pulse"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.green,
              display: "inline-block",
            }}
          />
          Live
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="no-scrollbar grab"
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          padding: "4px 20px 14px",
          WebkitOverflowScrolling: "touch",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onScroll={onScroll}
      >
        {dishes.map((dish, index) => (
          <div
            key={dish.id}
            className="anim-cardSlide"
            style={{
              flexShrink: 0,
              width: 220,
              background: C.card,
              border: `1px solid ${index === 0 ? "rgba(212,170,90,.5)" : C.border}`,
              borderRadius: 16,
              overflow: "hidden",
              transition: "border-color .25s, transform .25s",
              animationDelay: `${index * 0.06}s`,
            }}
          >
            {/* Image & Rank */}
            <div
              style={{
                height: 120,
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg,rgba(212,170,90,.06),rgba(193,122,58,.03))",
              }}
            >
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 44,
                  }}
                >
                  {dish.emoji}
                </div>
              )}

              {/* Rank Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: getRankBg(index),
                  color: getRankColor(index),
                  fontSize: 10,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : index + 1}
              </div>

              {dish.tags?.includes("hot") && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(201,64,64,.85)",
                    color: "#fff",
                    fontSize: 8,
                    fontWeight: 600,
                    padding: "3px 6px",
                    borderRadius: 20,
                  }}
                >
                  🔥 Hot
                </div>
              )}
            </div>

            {/* Content Body */}
            <div
              style={{
                padding: 12,
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 120px)",
              }}
            >
              {/* Name and Price Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    className="serif"
                    style={{
                      fontSize: 16,
                      color: C.cream,
                      marginBottom: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    {dish.name}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: C.muted,
                      marginBottom: 6,
                    }}
                  >
                    {dish.cuisine}
                  </div>
                </div>

                {/* Price placed right beside the name header context */}
                <div
                  className="serif"
                  style={{
                    fontSize: 16,
                    color: C.gold,
                    whiteSpace: "nowrap",
                    paddingTop: 1,
                  }}
                >
                  ₹{dish.price}
                </div>
              </div>

              {/* Card Stars & Rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <span>{"⭐".repeat(Math.round(dish.avg))}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>
                  {Number(dish.avg).toFixed(1)}
                </span>
                <span style={{ fontSize: 10, color: C.muted }}>
                  💬 {dish.count} Reviews
                </span>
              </div>

              {/* Proper Review Box (Space Filled, No Icon) */}
              {dish.topReview && (
                <div
                  style={{
                    background: "rgba(255,255,255,.02)",
                    border: "1px solid rgba(255,255,255,.06)",
                    borderRadius: 10,
                    padding: "10px",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: C.muted,
                      lineHeight: 1.4,
                      fontStyle: "italic",
                      marginBottom: 8,
                    }}
                  >
                    "{dish.topReview.text.slice(0, 65)}
                    {dish.topReview.text.length > 65 ? "..." : ""}"
                  </div>

                  {/* Meta Details Container: Left-Right Balance to Fill Space */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{ fontSize: 10, fontWeight: 600, color: C.cream }}
                    >
                      {dish.topReview.user}
                    </span>
                    <span style={{ fontSize: 8.5, color: C.muted }}>
                      {formatShortDate(dish.topReview.time)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 5,
          paddingBottom: 4,
        }}
      >
        {dishes.slice(0, 6).map((_, index) => (
          <div
            key={index}
            style={{
              width: index === activeDot ? 14 : 5,
              height: 5,
              borderRadius: index === activeDot ? 3 : "50%",
              background: index === activeDot ? C.gold : C.border,
              transition: ".3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}