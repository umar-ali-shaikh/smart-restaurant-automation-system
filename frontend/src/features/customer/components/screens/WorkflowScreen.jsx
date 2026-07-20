import { C } from "../../../../styles/theme";
import Tag from "../Tag";

const WORKFLOW_TAGS = ["Webhook", "AI Agent", "HTTP Request", "Supabase", "WebSocket", "Google Business API", "Twilio", "Sheets"];

const N8N_NODES = [];

export default function WorkflowScreen({ onBack }) {
  return (
    <div style={{ background: C.black, minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,9,6,.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.gold, fontSize: 22, cursor: "pointer" }}>←</button>
        <div className="serif" style={{ fontSize: 22, color: C.cream }}>n8n <span style={{ color: C.gold }}>Workflow</span></div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ paddingBottom: 80 }}>
        <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: C.gold }}>Architecture Guide</p>
          <h2 className="serif" style={{ fontSize: 30, fontWeight: 400, color: C.cream, marginTop: 6 }}>Build This on n8n</h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>7 nodes · AI + Counter Dashboard + Google Reviews</p>
        </div>

        <div style={{ height: 18 }} />

        {N8N_NODES.map((node, index) => (
          <div key={node.num}>
            <div
              className="anim-fadeUp"
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px", margin: "0 20px 10px", display: "flex", alignItems: "center", gap: 12, transition: ".2s", animationDelay: `${index * 0.08}s` }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = "rgba(212,170,90,.35)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = C.border;
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, background: node.bg, border: `1px solid ${node.col}33` }}>{node.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.cream, marginBottom: 2 }}>{node.num}. {node.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{node.desc}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: `${node.col}22`, color: node.col }}>{node.num}</div>
            </div>
            {index < N8N_NODES.length - 1 && <div style={{ width: 2, height: 14, background: C.border, margin: "0 auto 0 39px" }} />}
          </div>
        ))}

        <div style={{ margin: "22px 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 15 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 9 }}>Key Integrations</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {WORKFLOW_TAGS.map((tag) => <Tag key={tag} type="default" label={tag} />)}
          </div>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 13, lineHeight: 1.6 }}>Counter Dashboard uses <strong style={{ color: C.cream }}>localStorage events</strong> (demo) - replace with <strong style={{ color: C.cream }}>WebSocket / n8n Webhook</strong> in production.</p>
        </div>

        <button onClick={onBack} style={{ margin: "0 20px", width: "calc(100% - 40px)", padding: 17, background: `linear-gradient(135deg,${C.gold},${C.accent})`, border: "none", borderRadius: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: C.black, cursor: "pointer" }}>Back to App Demo</button>
      </div>
    </div>
  );
}
