import { C } from "../../../../styles/theme";
import { getCartTotals, getRanked } from "../../../../utils/utils";
import FloatingBar from "../shared/FloatingBar";
import Tag from "../Tag";
import TopBar from "../shared/TopBar";
import TrendingCarousel from "../shared/TrendingCarousel";

const colors = [
  "#c17a3a",
  "#8b6a3a",
  "#7a5c3a",
  "#5a6a7a",
  "#6a5a4a",
  "#5a6a5a",
];

export default function CuisineScreen({
  reviews,
  menu,
  cart,
  onSelectCuisine,
  onCartClick,
  onOrdersClick,
  orderCount,
}) {
  const { totalItems, totalPrice } = getCartTotals(cart);
  const ranked = getRanked(menu, reviews, null);
  const cuisines = Object.values(
    menu.reduce((result, dish, index) => {
      const name = dish.category?.name || "Other";

      if (!result[name]) {
        result[name] = {
          id: dish.category?._id || name.toLowerCase().replace(/\s+/g, "-"),
          name,
          image: dish.category?.image || "",
          description: dish.category?.description || "",
          count: 0,
          tags: [],
          color: colors[index % colors.length],
        };
      }
      result[name].count += 1;
      result[name].tags = [
        ...new Set([...result[name].tags, ...(dish.tags || [])]),
      ];

      return result;
    }, {}),
  ).filter((cuisine) => cuisine.name !== "Other");
  return (
    <div style={{ background: C.black, minHeight: "100vh" }}>
      <TopBar
        goldPart="Mesa"
        title="AI"
        orderCount={orderCount}
        onOrdersClick={onOrdersClick}
      />
      <div style={{ padding: "24px 20px 8px" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 6,
          }}
        >
          Step 1 of 2
        </p>
        <h2
          className="serif"
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: C.cream,
            lineHeight: 1.15,
          }}
        >
          What are you
          <br />
          craving tonight?
        </h2>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 5 }}>
          Based on {reviews.length} guest reviews tonight
        </p>
      </div>

      <div
        style={{
          margin: "14px 20px",
          background:
            "linear-gradient(135deg,rgba(212,170,90,.08),rgba(193,122,58,.06))",
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${C.gold},${C.accent})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          🤖
        </div>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: C.muted }}>
          <strong style={{ color: C.gold, fontWeight: 500 }}>
            AI Suggestion:
          </strong>{" "}
          Indian & Persian trending right now. Butter Chicken rated{" "}
          <strong style={{ color: C.gold }}>5★</strong> by{" "}
          {reviews.filter((review) => review.dishId === 2).length} guests
          tonight!
        </p>
      </div>

      <div style={{ margin: "18px 0 4px" }}>
        <TrendingCarousel dishes={ranked} title="Trending Tonight" />
      </div>

      <div style={{ padding: "8px 20px 8px" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          Browse by Cuisine
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          padding: "12px 20px 120px",
        }}
      >
        {cuisines.map((cuisine, index) => (
          <div
            key={cuisine.id}
            className="anim-fadeUp"
            onClick={() => onSelectCuisine(cuisine)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              overflow: "hidden",
              cursor: "pointer",
              transition: ".3s",
              animationDelay: `${index * 0.07}s`,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = C.gold;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = C.border;
            }}
          >
            <div
              style={{
                height: 108,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 46,
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg,${cuisine.color}22,${cuisine.color}11)`,
              }}
            >
              {cuisine.image ? (
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
                    fontSize: 46,
                  }}
                >
                  🍽️
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.6))",
                }}
              />
            </div>
            <div style={{ padding: 11 }}>
              <div
                className="serif"
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: C.cream,
                  marginBottom: 3,
                }}
              >
                {cuisine.name}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                {cuisine.count} dishes
              </div>
            </div>
          </div>
        ))}
      </div>

      <FloatingBar
        count={totalItems}
        price={totalPrice}
        onClick={onCartClick}
      />
    </div>
  );
}
