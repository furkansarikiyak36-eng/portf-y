// ─── FILES MODULE — Integrated Dark Theme Edition ─────────────────────────────
// Drop-in replacement for FilesModule.jsx. Matches App.jsx dark palette exactly.
// Props:
//   uploads       – array of upload objects from App state (shared with OverviewPage)
//   onDeleteUpload – (id) => void
//   brandFilter   - optional string to lock the module to a specific brand
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";

// ── STATIC DATA ───────────────────────────────────────────────────────────────

const BRAND_LIST = [
  "All Brands",
  "Global",
  "Dove",
  "Omo/Persil",
  "Lux",
  "Sunsilk",
  "Knorr",
  "Hellmann's",
  "Lipton",
  "Rexona/Sure",
  "TRESemmé",
  "Axe/Lynx",
  "Vaseline",
  "Pond's",
  "Simple",
  "Nutrafol",
  "Lifebuoy",
  "Closeup",
  "Signal/Pepsodent",
  "Cif",
  "Domestos",
  "Comfort",
  "Surf Excel",
  "Magnum",
  "Ben & Jerry's",
  "Maille",
  "Pukka",
  "Brooke Bond",
  "Horlicks",
  "Degree/Sure",
  "Dermalogica",
  "Liquid I.V.",
];

const DEPARTMENTS = ["All", "Creative", "Reports", "UI/UX", "Insights", "Diagrams"];

const DEPT_COLORS = {
  Creative:  { accent: "#818CF8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.25)" },
  Reports:   { accent: "#34D399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)"  },
  "UI/UX":   { accent: "#F472B6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.25)" },
  Insights:  { accent: "#FBBF24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)"  },
  Diagrams:  { accent: "#06B6D4", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.25)"   },
};

const STATUS_CFG = {
  Final:       { color: "#34D399", bg: "rgba(52,211,153,0.12)",  label: "Final"     },
  Draft:       { color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  label: "Draft"     },
  "In Review": { color: "#60A5FA", bg: "rgba(96,165,250,0.12)",  label: "In Review" },
  Archived:    { color: "#6B7280", bg: "rgba(107,114,128,0.12)", label: "Archived"  },
};

const FILE_ICONS = {
  pdf: "📄", fig: "🎨", pptx: "📊", xlsx: "📈",
  docx: "📝", png: "🖼", mp4: "🎬", svg: "✏️", json: "💾", csv: "📋"
};

const STATIC_FILES = [
  // ── GLOBAL ──────────────────────────────────────────────────────────────────
  { id: 1,  brand: "Global",       dept: "Reports",  title: "FY2024 Unilever Annual Report",         ext: "pdf",  status: "Final",     date: "2024-02-14", desc: "Official FY2024 filing. Source for underlying operating margin 16.1%, turnover €60.1B.", tags: ["#financials","#source-of-truth"] },
  { id: 2,  brand: "Global",       dept: "Reports",  title: "Competitive Benchmark Matrix Q4 2024",  ext: "xlsx", status: "Final",     date: "2024-12-10", desc: "P&G, Nestlé, Henkel cross-category share and margin comparison.", tags: ["#benchmark","#competitive"] },
  { id: 3,  brand: "Global",       dept: "Diagrams", title: "Gap Analysis → Solution Journey",       ext: "svg",  status: "Final",     date: "2025-01-08", desc: "End-to-end methodology: data collection → anomaly detection → severity scoring → corrective brief.", tags: ["#methodology","#gap-analysis"] },
  { id: 4,  brand: "Global",       dept: "Diagrams", title: "Error Taxonomy & Severity Framework",   ext: "svg",  status: "Final",     date: "2025-01-05", desc: "Classifies dashboard errors into P0/P1/P2 tiers with decision rules for correction vs. removal.", tags: ["#framework","#methodology"] },
  { id: 5,  brand: "Global",       dept: "Insights", title: "Portfolio ESG Scorecard 2024",          ext: "pdf",  status: "Final",     date: "2024-11-20", desc: "Compass KPI progress: plastic reduction, deforestation, living wages across 400 brands.", tags: ["#ESG","#compass"] },
  { id: 6,  brand: "Global",       dept: "UI/UX",    title: "Dashboard Design System v2",            ext: "fig",  status: "Final",     date: "2025-01-15", desc: "Figma component library: color tokens, severity badges, chart patterns, brand card specs.", tags: ["#design-system","#figma"] },
  { id: 7,  brand: "Global",       dept: "Creative", title: "Brand Portfolio Map Visual",            ext: "svg",  status: "Draft",     date: "2025-02-01", desc: "2×2 matrix plotting all 30 Power Brands by growth rate vs. margin contribution.", tags: ["#portfolio","#visualization"] },
  { id: 8,  brand: "Global",       dept: "Reports",  title: "Divested & Discontinued Brands Register",ext: "xlsx", status: "Final",     date: "2024-10-05", desc: "Lipton (→CVC 2022), Dollar Shave Club, Elida Beauty. Reference for portfolio cleanup.", tags: ["#divestitures","#source-of-truth"] },
  // ── DOVE ────────────────────────────────────────────────────────────────────
  { id: 9,  brand: "Dove",         dept: "Creative", title: "Real Beauty Campaign Brief 2025",       ext: "pdf",  status: "Final",     date: "2025-01-20", desc: "Campaign strategy, tone of voice, asset specs for Q1–Q2 global rollout.", tags: ["#campaign","#creative-brief"] },
  { id: 10, brand: "Dove",         dept: "Insights", title: "Consumer Sentiment Deep Dive",          ext: "pptx", status: "Final",     date: "2024-11-12", desc: "NPS trends, social listening 700K+ mentions, Şikayetvar/Ekşi aggregation TR market.", tags: ["#consumer","#NLP"] },
  { id: 11, brand: "Dove",         dept: "UI/UX",    title: "Dove.com Redesign Prototype",           ext: "fig",  status: "In Review", date: "2025-02-10", desc: "Mobile-first redesign. Accessibility audit AA passed. Handoff ready pending stakeholder sign-off.", tags: ["#redesign","#mobile"] },
  { id: 12, brand: "Dove",         dept: "Diagrams", title: "Dove Revenue Attribution Flow",         ext: "svg",  status: "Final",     date: "2024-12-20", desc: "Segment-level revenue rollup to Beauty & Wellbeing. Corrects 16.8% → 16.1% margin.", tags: ["#financials","#correction"] },
  // ── BEN & JERRY'S ──────────────────────────────────────────────────────────
  { id: 13, brand: "Ben & Jerry's", dept: "Insights", title: "Activism Risk & Brand Trust Study",    ext: "pdf",  status: "Final",     date: "2024-09-15", desc: "Quantifies impact of political activism on purchase intent across 6 markets.", tags: ["#risk","#brand-trust"] },
  { id: 14, brand: "Ben & Jerry's", dept: "Creative", title: "Limited Edition Flavor Roadmap 2025",  ext: "pptx", status: "Draft",     date: "2025-01-30", desc: "Pipeline of 8 flavors tied to social campaigns. Links to influencer brief.", tags: ["#NPD","#campaign"] },
  { id: 15, brand: "Ben & Jerry's", dept: "Diagrams", title: "Governance Tension Decision Tree",     ext: "svg",  status: "Final",     date: "2024-10-10", desc: "Maps Unilever/Vermont-board conflicts to resolution pathways and brand risk scenarios.", tags: ["#governance","#risk"] },
  // ── KNORR ───────────────────────────────────────────────────────────────────
  { id: 16, brand: "Knorr",         dept: "Reports",  title: "Future Foods Market Analysis",         ext: "pdf",  status: "Final",     date: "2024-08-20", desc: "Plant-based & functional food segment sizing. USG driver decomposition.", tags: ["#market-analysis","#NPD"] },
  { id: 17, brand: "Knorr",         dept: "Creative", title: "Knorr Rebrand Visual Identity",        ext: "fig",  status: "In Review", date: "2025-02-05", desc: "Logo evolution, packaging system, typography. Pending global market approval.", tags: ["#rebrand","#identity"] },
  // ── LIFEBUOY ────────────────────────────────────────────────────────────────
  { id: 18, brand: "Lifebuoy",      dept: "Reports",  title: "Lifebuoy Stagnation Diagnostic",      ext: "pdf",  status: "Final",     date: "2024-12-01", desc: "Explains USG data anomaly. Root causes: commodity inflation, distribution gaps in SEA.", tags: ["#correction","#diagnostic"] },
  { id: 19, brand: "Lifebuoy",      dept: "Diagrams", title: "Watch-List Entry Rationale",          ext: "svg",  status: "Final",     date: "2024-12-05", desc: "Decision diagram: why Lifebuoy risk status was escalated. Evidence chain from quarterly data.", tags: ["#correction","#evidence"] },
  // ── NUTRAFOL ─────────────────────────────────────────────────────────────────
  { id: 20, brand: "Nutrafol",      dept: "Insights", title: "Prestige Hair Wellness Category Map",  ext: "pptx", status: "Final",     date: "2024-10-18", desc: "Category sizing, target consumer, claim substantiation. Double-digit growth confirmed.", tags: ["#category","#disclaimer"] },
  // ── LIQUID I.V. ──────────────────────────────────────────────────────────────
  { id: 21, brand: "Liquid I.V.",   dept: "Reports",  title: "Hydration Segment Competitive Scan",  ext: "pdf",  status: "Final",     date: "2024-09-28", desc: "LMNT, Nuun, DripDrop comparison. Growth narrative verified from Unilever investor day.", tags: ["#competitive","#disclaimer"] },
  // ── HELLMANN'S ───────────────────────────────────────────────────────────────
  { id: 22, brand: "Hellmann's",    dept: "Creative", title: "Plant-Based Mayo Launch Brief",        ext: "pdf",  status: "Draft",     date: "2025-02-15", desc: "Creative brief for Hellmann's Vegan range expansion into 15 new markets Q2 2025.", tags: ["#NPD","#campaign"] },
  // ── MAGNUM ────────────────────────────────────────────────────────────────────
  { id: 23, brand: "Magnum",        dept: "Creative", title: "Magnum X Luxury Collab Brief",         ext: "pptx", status: "Draft",     date: "2025-01-25", desc: "Limited edition fashion collaboration. Targets premium indulgence segment and Gen Z.", tags: ["#campaign","#premium"] },
  // ── PUKKA ─────────────────────────────────────────────────────────────────────
  { id: 24, brand: "Pukka",         dept: "Reports",  title: "US Market Entry Assessment",           ext: "pdf",  status: "In Review", date: "2025-02-08", desc: "Whole Foods, Target channel analysis. DTC subscription model feasibility for US launch.", tags: ["#market-entry","#DTC"] },
  // ── DERMALOGICA ───────────────────────────────────────────────────────────────
  { id: 25, brand: "Dermalogica",   dept: "Diagrams", title: "Clinical Channel Expansion Map",       ext: "svg",  status: "Final",     date: "2024-11-30", desc: "ME and Asia clinic footprint plan. AI skin diagnostic integration pathway.", tags: ["#expansion","#clinical"] },
];

const JOURNEY_STEPS = [
  { id: "J1", phase: "Discovery",  color: "#818CF8", title: "Data Collection",    actions: ["FY2024 Annual Report ingested", "Competitor filings pulled", "30-brand dataset compiled"] },
  { id: "J2", phase: "Analysis",   color: "#34D399", title: "Anomaly Detection",  actions: ["Revenue figure cross-check", "Portfolio status verification", "USG outlier flagging"] },
  { id: "J3", phase: "Validation", color: "#FBBF24", title: "Severity Scoring",   actions: ["P0: factual financial errors", "P1: misleading status data", "P2: undisclosed assumptions"] },
  { id: "J4", phase: "Resolution", color: "#F87171", title: "Corrective Briefs",  actions: ["5 critical fixes documented", "EBIT 16.8% → 16.1% corrected", "Evidence chain built"] },
  { id: "J5", phase: "Delivery",   color: "#06B6D4", title: "Platform Update",    actions: ["Files module integrated", "Analytics Engine wired", "Upload system linked"] },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

const fmtSize = (bytes) =>
  bytes > 1048576 ? (bytes / 1048576).toFixed(1) + " MB" : (bytes / 1024).toFixed(0) + " KB";

const detectFileType = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  const MAP = {
    pdf: "pdf", doc: "docx", docx: "docx", ppt: "pptx", pptx: "pptx",
    xlsx: "xlsx", xls: "xlsx", csv: "csv", fig: "fig", svg: "svg",
    png: "png", jpg: "png", jpeg: "png", gif: "png", webp: "png",
    mp4: "mp4", mov: "mp4", webm: "mp4", json: "json"
  };
  return MAP[ext] || "pdf";
};

const UPLOAD_DEPT_MAP = { pdf: "Reports", docx: "Reports", xlsx: "Reports", pptx: "Insights", fig: "UI/UX", png: "Creative", mp4: "Creative", svg: "Diagrams", json: "Insights" };

// ── BADGE ─────────────────────────────────────────────────────────────────────

const DarkBadge = ({ text, color, bg }) => (
  <span style={{
    background: bg || `${color}18`,
    color,
    border: `1px solid ${color}33`,
    borderRadius: 5,
    padding: "2px 7px",
    fontSize: 10,
    fontWeight: 600,
    whiteSpace: "nowrap",
  }}>{text}</span>
);

// ── FILE CARD ─────────────────────────────────────────────────────────────────

function FileCard({ file, dc, isSelected, onSelect }) {
  const sc = STATUS_CFG[file.status] || STATUS_CFG["Draft"];
  const isUpload = !!file._upload;

  return (
    <div
      onClick={() => onSelect(isSelected ? null : file)}
      style={{
        background: isSelected ? dc.bg : "rgba(255,255,255,0.03)",
        border: `1px solid ${isSelected ? dc.accent : "rgba(255,255,255,0.07)"}`,
        borderLeft: `3px solid ${isSelected ? dc.accent : "transparent"}`,
        borderRadius: 12,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{FILE_ICONS[file.ext] || "📎"}</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {isUpload && (
            <span style={{ fontSize: 9, color: "#34D399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>UPLOADED</span>
          )}
          {file.source === "ai" && (
            <span style={{ fontSize: 9, color: "#818CF8", background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>AI GEN</span>
          )}
          <DarkBadge text={sc.label} color={sc.color} />
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#F9FAFB", margin: "0 0 4px", lineHeight: 1.4 }}>{file.title}</p>
      <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 8px", lineHeight: 1.5 }}>
        {file.desc ? (file.desc.substring(0, 80) + (file.desc.length > 80 ? "…" : "")) : ""}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
        {file.tags && file.tags.map(t => (
          <span key={t} style={{ fontSize: 10, padding: "1px 6px", background: dc.bg, color: dc.accent, border: `1px solid ${dc.border}`, borderRadius: 4 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4B5563", fontFamily: "'IBM Plex Mono', monospace" }}>.{file.ext}{file.size ? ` · ${fmtSize(file.size)}` : ""}</span>
        <span style={{ fontSize: 10, color: "#4B5563" }}>{file.date}</span>
      </div>
    </div>
  );
}

// ── DEPT SECTION ──────────────────────────────────────────────────────────────

function DeptSection({ dept, items, selectedFile, onSelect }) {
  const dc = DEPT_COLORS[dept] || DEPT_COLORS["Reports"];
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dc.accent }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{dept}</span>
        <span style={{ fontSize: 11, color: "#4B5563" }}>{items.length} file{items.length !== 1 ? "s" : ""}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {items.map(f => (
          <FileCard key={f.id} file={f} dc={dc} isSelected={selectedFile?.id === f.id} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ── FILE DETAIL PANEL ─────────────────────────────────────────────────────────

function FileDetail({ file, onClose, onDeleteUpload }) {
  const dc = DEPT_COLORS[file.dept] || DEPT_COLORS["Reports"];
  const sc = STATUS_CFG[file.status] || STATUS_CFG["Draft"];
  const isUpload = !!file._upload;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1.5px solid ${dc.accent}55`,
      borderRadius: 14,
      padding: 24,
      marginTop: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 32 }}>{FILE_ICONS[file.ext] || "📎"}</span>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", margin: "0 0 4px" }}>{file.title}</p>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{file.brand} · {file.dept} · {file.date}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {isUpload && onDeleteUpload && (
            <button
              onClick={() => { onDeleteUpload(file._upload.id); onClose(); }}
              style={{ fontSize: 11, color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}
            >× Remove</button>
          )}
          {file.source === "ai" && onDeleteUpload && (
            <button
              onClick={() => { onDeleteUpload(file.id); onClose(); }}
              style={{ fontSize: 11, color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}
            >× Remove AI Gen</button>
          )}
          <button
            onClick={onClose}
            style={{ fontSize: 11, color: "#9CA3AF", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}
          >Close</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Description</p>
          <p style={{ fontSize: 13, color: "#D1D5DB", margin: 0, lineHeight: 1.7 }}>{file.desc}</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Metadata</p>
          {[
            ["Department", <DarkBadge key="dept" text={file.dept} color={dc.accent} />],
            ["Status",     <DarkBadge key="status" text={sc.label} color={sc.color} />],
            ["Brand",      <span key="brand" style={{ fontSize: 12, color: "#D1D5DB" }}>{file.brand}</span>],
            ["Format",     <span key="fmt" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#9CA3AF" }}>.{file.ext}</span>],
            ...(file.size ? [["Size", <span key="size" style={{ fontSize: 12, color: "#9CA3AF" }}>{fmtSize(file.size)}</span>]] : []),
          ].map(([label, val], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: "#6B7280" }}>{label}</span>
              <span>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Tags</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {file.tags && file.tags.map(t => (
            <DarkBadge key={t} text={t} color={dc.accent} />
          ))}
        </div>
      </div>

      {/* Preview for uploaded images */}
      {isUpload && file._upload.type === "image" && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Preview</p>
          <img src={file._upload.url} alt={file.title} style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", objectFit: "cover" }} />
        </div>
      )}
      {isUpload && file._upload.type === "video" && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Preview</p>
          <video src={file._upload.url} controls style={{ width: "100%", maxHeight: 200, borderRadius: 8, background: "#000" }} />
        </div>
      )}
      
      {/* AI Generated Content Preview */}
      {file.source === "ai" && file.content && (
        <div style={{ marginBottom: 14, background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Generated Content Preview</p>
          <pre style={{ margin: 0, fontSize: 12, color: "#9CA3AF", whiteSpace: "pre-wrap", fontFamily: "'IBM Plex Mono', monospace" }}>
            {typeof file.content === "string" ? file.content : JSON.stringify(file.content, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {isUpload ? (
          <a href={file._upload.url} download={file.title} style={{ fontSize: 11, color: dc.accent, background: dc.bg, border: `1px solid ${dc.border}`, borderRadius: 7, padding: "5px 12px", textDecoration: "none", cursor: "pointer" }}>
            ↓ Download
          </a>
        ) : (
          <button style={{ fontSize: 11, color: dc.accent, background: dc.bg, border: `1px solid ${dc.border}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
            ↓ Download .{file.ext}
          </button>
        )}
        <button style={{ fontSize: 11, color: "#9CA3AF", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
          Share link
        </button>
        <button style={{ fontSize: 11, color: "#9CA3AF", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
          Open in viewer
        </button>
      </div>
    </div>
  );
}

// ── STATS BAR ─────────────────────────────────────────────────────────────────

function StatsBar({ allFiles }) {
  const statuses = allFiles.reduce((acc, f) => { acc[f.status] = (acc[f.status] || 0) + 1; return acc; }, {});
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 150, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Total Files</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#F9FAFB" }}>{allFiles.length}</div>
      </div>
      <div style={{ flex: 1, minWidth: 150, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Final Status</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#34D399" }}>{statuses["Final"] || 0}</div>
      </div>
      <div style={{ flex: 1, minWidth: 150, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>AI Generated</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#818CF8" }}>{allFiles.filter(f => f.source === "ai").length}</div>
      </div>
    </div>
  );
}

// ── JOURNEY PANEL ─────────────────────────────────────────────────────────────

function JourneyPanel() {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB", marginBottom: 16 }}>Migration &amp; Correction Journey</div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {JOURNEY_STEPS.map((step, i) => (
          <div key={step.id} style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 14, borderLeft: `3px solid ${step.color}` }}>
            <div style={{ fontSize: 10, color: step.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{step.phase}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB", marginBottom: 8 }}>{step.title}</div>
            {step.actions.map((act, j) => (
               <div key={j} style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4, display: "flex", gap: 6, alignItems: "flex-start" }}>
                 <span style={{ color: step.color, marginTop: -1 }}>▹</span> <span>{act}</span>
               </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function FilesModule({ uploads = [], onDeleteUpload, brandFilter = null }) {
  const [activeBrand, setActiveBrand] = useState(brandFilter || "All Brands");
  const [activeDept,  setActiveDept]  = useState("All");
  const [search,      setSearch]      = useState("");
  const [showJourney, setShowJourney] = useState(false);
  const [selectedFile,setSelectedFile]= useState(null);
  const fileInputRef = useRef(null);
  const [dragOver,    setDragOver]    = useState(false);

  useEffect(() => {
    if (brandFilter) {
      setActiveBrand(brandFilter);
    }
  }, [brandFilter]);

  // Convert App-level uploads to file objects for this module
  const uploadFiles = uploads.map((u, idx) => {
    // If upload already looks like a complete file object from AI Engine
    if (u.source === "ai" || u.ext) {
      return u;
    }
    
    // Otherwise it's a raw browser file upload
    const ext = detectFileType(u.name);
    return {
      id: `upload-${u.id}`,
      brand: u.brand || "Global", // if brand wasn't specified during drop
      dept: UPLOAD_DEPT_MAP[ext] || "Reports",
      title: u.name.replace(/\.[^/.]+$/, ""),
      ext,
      status: "Draft",
      date: u.date || new Date().toLocaleDateString("tr-TR"),
      desc: `Uploaded file. Size: ${u.size ? fmtSize(u.size) : "Unknown"}.`,
      tags: ["#uploaded", ...(u.tags || [])],
      size: u.size,
      _upload: u,
    };
  });

  const allFiles = [...STATIC_FILES, ...uploadFiles];

  // Filtering
  const filtered = allFiles.filter(f => {
    const matchBrand = activeBrand === "All Brands" || f.brand === activeBrand || (activeBrand !== "Global" && f.brand === "Global");
    const matchDept  = activeDept === "All" || f.dept === activeDept;
    const matchSearch = search === "" ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (f.tags && f.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) ||
      (f.desc && f.desc.toLowerCase().includes(search.toLowerCase()));
    return matchBrand && matchDept && matchSearch;
  });

  const grouped = DEPARTMENTS.slice(1).reduce((acc, d) => {
    acc[d] = filtered.filter(f => f.dept === d);
    return acc;
  }, {});

  // Upload handler
  const handleFiles = (files) => {
    if (window.__filesModuleUpload) {
      Array.from(files).forEach(file => {
        const type = ["png","jpg","jpeg","gif","webp","svg"].includes(file.name.split(".").pop().toLowerCase()) ? "image"
          : ["mp4","mov","webm"].includes(file.name.split(".").pop().toLowerCase()) ? "video" : "report";
        const url = URL.createObjectURL(file);
        window.__filesModuleUpload({ 
          id: Date.now() + Math.random(), 
          name: file.name, 
          type, 
          url, 
          size: file.size, 
          date: new Date().toLocaleDateString("tr-TR"),
          brand: brandFilter || "Global" // automatically tag upload with current brand if embedded
        });
      });
    }
  };

  const totalUploads = uploadFiles.length;

  return (
    <div>
      {/* Header */}
      {!brandFilter && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F9FAFB", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Files Repository</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              {allFiles.length} documents across {BRAND_LIST.length - 1} brands
              {totalUploads > 0 && <span style={{ color: "#34D399", marginLeft: 8 }}>· {totalUploads} uploaded</span>}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search files or tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: 200, fontSize: 12, padding: "7px 12px 7px 32px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#F9FAFB", outline: "none",
                }}
              />
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#4B5563" }}>🔍</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: 11, color: "#60A5FA", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}
            >+ Upload</button>
            <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
            <button
              onClick={() => setShowJourney(!showJourney)}
              style={{ fontSize: 11, color: showJourney ? "#818CF8" : "#6B7280", background: showJourney ? "rgba(129,140,248,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${showJourney ? "rgba(129,140,248,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontWeight: showJourney ? 600 : 400 }}
            >{showJourney ? "Hide" : "Show"} journey ↗</button>
          </div>
        </div>
      )}

      {brandFilter && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
           <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Brand Assets & Evidence</h3>
           <div style={{ display: "flex", gap: 8 }}>
             <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: 11, color: "#60A5FA", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>+ Upload Evidence</button>
             <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
           </div>
        </div>
      )}

      {/* Stats - hide in embedded mode */}
      {!brandFilter && <StatsBar allFiles={allFiles} />}

      {/* Journey */}
      {showJourney && !brandFilter && <JourneyPanel />}

      {/* Two-panel layout */}
      <div style={{ display: "grid", gridTemplateColumns: brandFilter ? "1fr" : "180px 1fr", gap: 16, alignItems: "start" }}>

        {/* Sidebar - Hide if embedded via brandFilter */}
        {!brandFilter && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 12, position: "sticky", top: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Brand</p>
            {BRAND_LIST.map(b => {
              const count = b === "All Brands"
                ? allFiles.length
                : allFiles.filter(f => f.brand === b || (b !== "Global" && f.brand === "Global")).length;
              const isActive = activeBrand === b;
              return (
                <button key={b} onClick={() => setActiveBrand(b)} style={{
                  display: "flex", justifyContent: "space-between", width: "100%", textAlign: "left",
                  fontSize: 11, padding: "5px 8px", marginBottom: 2,
                  background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                  borderRadius: 7, color: isActive ? "#60A5FA" : "#6B7280",
                  fontWeight: isActive ? 700 : 400, cursor: "pointer",
                }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b}</span>
                  <span style={{ fontSize: 10, color: isActive ? "#60A5FA" : "#374151", flexShrink: 0, marginLeft: 4 }}>{count}</span>
                </button>
              );
            })}

            <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", margin: "16px 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Department</p>
            {DEPARTMENTS.map(d => {
              const isActive = activeDept === d;
              const dc = DEPT_COLORS[d];
              return (
                <button key={d} onClick={() => setActiveDept(d)} style={{
                  display: "flex", alignItems: "center", gap: 6, width: "100%", textAlign: "left",
                  fontSize: 11, padding: "5px 8px", marginBottom: 2,
                  background: isActive && d !== "All" ? dc.bg : isActive ? "rgba(255,255,255,0.05)" : "transparent",
                  border: isActive ? `1px solid ${d !== "All" ? dc.border : "rgba(255,255,255,0.15)"}` : "1px solid transparent",
                  borderRadius: 7, color: isActive && d !== "All" ? dc.accent : isActive ? "#D1D5DB" : "#6B7280",
                  fontWeight: isActive ? 700 : 400, cursor: "pointer",
                }}>
                  {d === "All"
                    ? <span style={{ fontSize: 8 }}>◼</span>
                    : <div style={{ width: 6, height: 6, borderRadius: "50%", background: dc.accent, flexShrink: 0 }} />}
                  {d}
                </button>
              );
            })}
          </div>
        )}

        {/* File grid */}
        <div>
          {/* Internal filters for embedded mode */}
          {brandFilter && (
             <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
                 {DEPARTMENTS.map(d => {
                     const dc = DEPT_COLORS[d];
                     const isActive = activeDept === d;
                     return (
                      <button key={d} onClick={() => setActiveDept(d)} style={{
                        display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                        fontSize: 11, padding: "5px 10px", 
                        background: isActive && d !== "All" ? dc.bg : isActive ? "rgba(255,255,255,0.05)" : "transparent",
                        border: isActive ? `1px solid ${d !== "All" ? dc.border : "rgba(255,255,255,0.15)"}` : "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 20, color: isActive && d !== "All" ? dc.accent : isActive ? "#D1D5DB" : "#6B7280",
                        fontWeight: isActive ? 700 : 400, cursor: "pointer",
                      }}>
                        {d !== "All" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: dc.accent }} />}
                        {d}
                      </button>
                     );
                 })}
             </div>
          )}

          {filtered.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#4B5563", fontSize: 13 }}>
              No files match this filter.
              {search && <span style={{ display: "block", marginTop: 6, fontSize: 11 }}>Try clearing the search or selecting "All" in the sidebar.</span>}
            </div>
          )}

          {activeDept === "All"
            ? DEPARTMENTS.slice(1).map(dept => (
                <DeptSection key={dept} dept={dept} items={grouped[dept]} selectedFile={selectedFile} onSelect={setSelectedFile} />
              ))
            : <DeptSection dept={activeDept} items={filtered} selectedFile={selectedFile} onSelect={setSelectedFile} />
          }

          {/* Detail panel */}
          {selectedFile && (
            <FileDetail
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onDeleteUpload={onDeleteUpload}
            />
          )}

          {/* Embedded Dropzone */}
          {brandFilter && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `1.5px dashed ${dragOver ? "#60A5FA" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "16px 20px", textAlign: "center",
                cursor: "pointer", marginTop: 20,
                background: dragOver ? "rgba(59,130,246,0.05)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>📎</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Drop evidence, briefs, UI mocks here for {brandFilter}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
