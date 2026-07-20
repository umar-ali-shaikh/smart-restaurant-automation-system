import { useState, useMemo } from "react";
import { C } from "../../../styles/theme";
import { getCartTotals, getDishRating, getRanked } from "../../../utils/utils";
import FloatingBar from "../components/shared/FloatingBar";
import Tag from "../components/Tag";
import TopBar from "../components/shared/TopBar";
import TrendingCarousel from "../components/shared/TrendingCarousel";
// import { useNavigate } from "react-router-dom";

const FILTERS = ["All", "Veg", "Non-Veg", "Chef's Pick"];

export default function MenuScreen({
  cuisine,
  menu = [],
  reviews = [],
  cart = {},
  onBack,
  onAddItem,
  onRemoveItem,
  onCartClick,
  onOrdersClick,
  orderCount,
}) {
  // const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const { totalItems, totalPrice } = getCartTotals(cart);

  // 1. Safe Arrays check logic structure
  const safeMenu = useMemo(() => (Array.isArray(menu) ? menu : []), [menu]);
  const safeReviews = useMemo(
    () => (Array.isArray(reviews) ? reviews : []),
    [reviews],
  );

  const allDishesForCuisine = useMemo(() => {
    return safeMenu.filter((dish) => dish.cuisine === cuisine?.name);
  }, [safeMenu, cuisine?.name]);

  // 2. Filter logic templates cached
  const filteredDishes = useMemo(() => {
    return allDishesForCuisine.filter((dish) => {
      if (activeFilter === "Veg") {
        return dish.tags?.includes("veg") && !dish.tags?.includes("nonveg");
      }
      if (activeFilter === "Non-Veg") return dish.tags?.includes("nonveg");
      if (activeFilter === "Chef's Pick") return !!dish.chef;
      return true;
    });
  }, [allDishesForCuisine, activeFilter]);

  // 3. Ranked dishes structure loading optimization
  const rankedDishes = useMemo(() => {
    const results = getRanked(safeMenu, safeReviews, cuisine?.name);
    return results.length ? results : getRanked(safeMenu, safeReviews, null);
  }, [safeMenu, safeReviews, cuisine?.name]);

  const chefDish = useMemo(() => {
    return (
      allDishesForCuisine.find((dish) => dish.chef) || allDishesForCuisine[0]
    );
  }, [allDishesForCuisine]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.black }}>
      <TopBar
        goldPart="Mesa"
        title="AI"
        onBack={onBack}
        orderCount={orderCount}
        onOrdersClick={onOrdersClick}
      />

      {/* HERO HEADER */}
      <div className="h-[190px] flex items-end p-5 relative overflow-hidden">
        <div className="absolute inset-0">
          {cuisine?.image ? (
            <img
              src={cuisine.image}
              alt={cuisine.name}
              className="w-full h-full object-cover opacity-35"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-[96px] opacity-14">
              🍽️
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,9,6,.2)] to-[rgba(10,9,6,.9)]" />

        <div className="relative z-[2]">
          <div
            className="text-[9px] tracking-[4px] uppercase mb-1"
            style={{ color: C.gold }}
          >
            Now Exploring
          </div>
          <div
            className="serif text-[34px] font-light leading-[1.1]"
            style={{ color: C.cream }}
          >
            {cuisine?.name} Cuisine
          </div>
          <div className="text-[12px] mt-[3px]" style={{ color: C.muted }}>
            {allDishesForCuisine.length} curated dishes · Chef's specials marked
          </div>
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="mt-3.5">
        <TrendingCarousel dishes={rankedDishes} title="Top Rated Here" />
      </div>

      {/* AI PICK */}
      <div className="mx-5 mt-3.5 bg-gradient-to-r from-[rgba(212,170,90,.1)] to-[rgba(193,122,58,.05)] border border-[rgba(212,170,90,.25)] rounded-xl py-[11px] px-3.5 flex items-center gap-2.5">
        <span
          className="text-[9px] tracking-[2px] uppercase font-bold py-1 px-2 rounded-[20px] shrink-0"
          style={{ background: C.gold, color: C.black }}
        >
          AI Pick
        </span>
        <p className="text-[12px]" style={{ color: C.muted }}>
          Try the{" "}
          <strong style={{ color: C.cream }}>
            {chefDish?.name || "Special Item"}
          </strong>{" "}
          - most loved by guests this season
        </p>
      </div>

      {/* HORIZONTAL FILTERS */}
      <div className="no-scrollbar flex gap-2 px-5 mt-3.5 overflow-x-auto">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="whitespace-nowrap py-2 px-4 rounded-[20px] text-[12px] cursor-pointer transition-all duration-200 shrink-0"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              border: `1px solid ${activeFilter === filter ? C.gold : C.border}`,
              background: activeFilter === filter ? C.gold : "transparent",
              color: activeFilter === filter ? C.black : C.muted,
              fontWeight: activeFilter === filter ? 500 : 400,
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* DISHES LIST */}
      <div className="pt-3 px-5 pb-[140px] flex flex-col gap-[13px]">
        {filteredDishes.map((dish, index) => {
          const dishId = dish._id || dish.id;

          // FIX: explicitly string parameters check inside utilities execution
          const ratingData = getDishRating(dishId, safeReviews);
          const avg = ratingData?.avg ?? "0.0";
          const count = ratingData?.count ?? 0;

          // Target exact string value match to pull reviews correctly
          const topComment = safeReviews.find(
            (rev) => String(rev.dishId || rev.dish) === String(dishId),
          );

          const inCart = cart[dishId];

          return (
            <div
              key={dishId}
              className="anim-fadeUp rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: C.card,
                border: `1px solid ${dish.chef ? "rgba(212,170,90,.45)" : C.border}`,
                animationDelay: `${index * 0.07}s`,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = "rgba(212,170,90,.35)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = dish.chef
                  ? "rgba(212,170,90,.45)"
                  : C.border;
              }}
            >
              <div className="flex gap-4 p-4 items-stretch">
                {/* IMAGE CONTAINER */}
                <div className="w-[110px] h-[110px] rounded-2xl overflow-hidden shrink-0 bg-[#18130d]">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[42px]">
                      🍽️
                    </div>
                  )}
                </div>

                {/* RIGHT CONTENT COLUMN */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2.5">
                      <h3
                        className="serif m-0 text-[22px]"
                        style={{ color: C.cream }}
                      >
                        {dish.name}
                      </h3>
                      <span
                        className="serif text-[22px]"
                        style={{ color: C.gold }}
                      >
                        ₹{dish.price}
                      </span>
                    </div>

                    <p
                      className="mt-1.5 mb-2.5 text-[13px] leading-[1.5]"
                      style={{ color: C.muted }}
                    >
                      {dish.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Left Side (Ratings Area) */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#d4aa5a]">
                          ⭐ {avg}
                        </span>

                        <span className="text-xs text-[#8f8a82]">
                          ({count} Reviews)
                        </span>

                        {dish.chef && (
                          <span className="rounded-full bg-[#d4aa5a20] px-2 py-1 text-[10px] font-medium text-[#d4aa5a]">
                            👨‍🍳 Chef's Pick
                          </span>
                        )}
                      </div>

                      {/* Right Side (Actions) */}
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRemoveItem(dishId)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3a3126] bg-[#2b2218] text-lg font-semibold text-[#d4aa5a] transition hover:bg-[#3a2f20]"
                          >
                            −
                          </button>

                          <span className="min-w-[20px] text-center text-sm font-semibold text-[#f5ead7]">
                            {inCart.qty}
                          </span>

                          <button
                            onClick={() => onAddItem(dish)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4aa5a] text-lg font-bold text-black transition hover:scale-105"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddItem(dish)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4aa5a] to-[#c17a3a] text-2xl font-bold text-black shadow-lg transition hover:scale-105"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FOOTER COMMENT AREA */}
                  <div className="flex justify-between items-center mt-3">
                    {topComment?.text ? (
                      <div
                        className="text-[11px] overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px] italic"
                        style={{ color: C.muted }}
                      >
                        "{topComment.text}"
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FloatingBar
        count={totalItems}
        price={totalPrice}
        onClick={onCartClick}
      />
    </div>
  );
}
