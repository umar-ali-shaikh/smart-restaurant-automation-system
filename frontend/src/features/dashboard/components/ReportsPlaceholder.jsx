import { rupee } from "../../../utils/format";

export default function ReportsPlaceholder({
  orders = [],
}) {
  const daily = orders.reduce(
    (sum, order) =>
      sum +
      Number(order.total || 0),
    0
  );

  const weekly =
    daily +
    Math.round(
      daily * 4.2 + 48000
    );

  const monthly =
    daily +
    Math.round(
      daily * 18 + 210000
    );

  const cards = [
    {
      title: "Daily Revenue",
      value: rupee(daily),
      sub: `${orders.length} orders today`,
      icon: "📅",
      color:
        "from-[#d4aa5a]/20 to-[#d4aa5a]/5",
      border:
        "border-[#d4aa5a]/20",
    },

    {
      title: "Weekly Revenue",
      value: rupee(weekly),
      sub: "Last 7 days",
      icon: "📊",
      color:
        "from-[#5a84e8]/20 to-[#5a84e8]/5",
      border:
        "border-[#5a84e8]/20",
    },

    {
      title: "Monthly Revenue",
      value: rupee(monthly),
      sub: "Last 30 days",
      icon: "💰",
      color:
        "from-[#4a9a6f]/20 to-[#4a9a6f]/5",
      border:
        "border-[#4a9a6f]/20",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className={`
            relative
            overflow-hidden
            rounded-[32px]
            border
            ${card.border}
            bg-[var(--card)]
            p-6
          `}
        >
          {/* GLOW */}
          <div
            className={`
              absolute
              right-0
              top-0
              h-40
              w-40
              rounded-full
              bg-gradient-to-br
              ${card.color}
              blur-3xl
            `}
          />

          {/* CONTENT */}
          <div className="relative z-10">

            {/* TOP */}
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  text-sm
                  font-medium
                  text-[var(--muted)]
                "
              >
                {card.title}
              </div>

              <div className="text-3xl">
                {card.icon}
              </div>
            </div>

            {/* VALUE */}
            <div
              className="
                mt-6
                text-5xl
                font-bold
                leading-none
                text-[var(--cream)]
              "
            >
              {card.value}
            </div>

            {/* SUB */}
            <div
              className="
                mt-3
                text-sm
                text-[var(--muted)]
              "
            >
              {card.sub}
            </div>

            {/* BAR */}
            <div
              className="
                mt-6
                h-2
                overflow-hidden
                rounded-full
                bg-white/[.06]
              "
            >
              <div
                className="
                  h-full
                  w-[75%]
                  rounded-full
                  bg-[linear-gradient(90deg,var(--accent),var(--gold))]
                "
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}