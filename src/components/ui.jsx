// ─── SHARED UI COMPONENTS ────────────────────────────────────────────────────

export const StatCard = ({ label, value, sub, color = "#3B82F6" }) => (
  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "18px 22px", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{sub}</div>}
  </div>
);

export const Badge = ({ text, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{text}</span>
);

export const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F9FAFB", letterSpacing: "-0.02em" }}>{children}</h2>
    {sub && <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 13 }}>{sub}</p>}
  </div>
);

// Simple search icon SVG to replace lucide-react dependency
export const SearchIcon = ({ size = 14, color = "#9CA3AF", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
