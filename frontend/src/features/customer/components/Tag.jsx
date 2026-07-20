import { C } from "../../../styles/theme";
const TAG_STYLES = {
  veg: { border: "1px solid rgba(74,154,111,.4)", color: C.green },
  nv: { border: "1px solid rgba(201,64,64,.4)", color: C.red },
  hot: { border: "1px solid rgba(212,170,90,.3)", color: C.gold },
  default: { border: `1px solid ${C.border}`, color: C.muted },
};

export default function Tag({ type, label }) {
  const style = TAG_STYLES[type] || TAG_STYLES.default;

  return (
    <span
      style={{
        ...style,
        fontSize: 9,
        letterSpacing: 1,
        textTransform: "uppercase",
        padding: "3px 7px",
        borderRadius: 20,
        background: "transparent",
      }}
    >
      {label}
    </span>
  );
}
