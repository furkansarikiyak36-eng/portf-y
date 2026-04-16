import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilesModule from "./src/pages/FilesModule.jsx";
import MapModule from "./src/components/MapModule.jsx";

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ScatterChart, Scatter, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell, Legend } from "recharts";
import { BRANDS, SEGMENTS, BCG_COLORS } from "./src/data/brands.js";
import { FINANCIALS, COMPETITOR_RADAR, AI_ALERTS } from "./src/data/financials.js";
import { COUNTRIES, ESG_DATA } from "./src/data/countries.js";
import { StatCard, Badge, SectionTitle, SearchIcon } from "./src/components/ui.jsx";

// Data and UI components are now imported from src/ modules
import { generateQueries, generateRecommendations, generateBrainInsights, QA_QUESTIONS } from "./src/analytics/engine.js";

// ─── PAGES ───────────────────────────────────────────────────────────────────const OverviewPage = ({ effectiveBrands = BRANDS, simEnabled = false, uploads = [], onUpload, onDeleteUpload }) => {
  const avgUSG = (effectiveBrands.reduce((s, b) => s + b.usg, 0) / effectiveBrands.length).toFixed(1);
  const stars = effectiveBrands.filter(b => b.bcg === "Star").length;
  const strong = effectiveBrands.filter(b => b.status === "Strong").length;
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const FILE_TYPES = {
    report: { exts: ["pdf","doc","docx","ppt","pptx","xlsx","csv","txt"], icon: "📄", color: "#3B82F6", label: "Report" },
    video:  { exts: ["mp4","mov","avi","webm","mkv"],                    icon: "🎬", color: "#F472B6", label: "Video"  },
    image:  { exts: ["png","jpg","jpeg","gif","webp","svg"],             icon: "🖼", color: "#34D399", label: "Image"  },
  };

  const detectType = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    for (const [type, cfg] of Object.entries(FILE_TYPES)) {
      if (cfg.exts.includes(ext)) return type;
    }
    return "report";
  };

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const type = detectType(file.name);
      const url = URL.createObjectURL(file);
      onUpload && onUpload({ id: Date.now() + Math.random(), name: file.name, type, url, size: file.size, date: new Date().toLocaleDateString("tr-TR") });
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const fmtSize = (bytes) => bytes > 1048576 ? (bytes/1048576).toFixed(1)+"MB" : (bytes/1024).toFixed(0)+"KB";

  const TIMELINE = [
    { year: "2019", event: "Unilever Future Fit Strategy", note: "12 Power Brands divested, focus on 30 high-growth platforms" },
    { year: "2021", event: "Compass Strategy Launch", note: "Portfolio reshaping: beauty & wellbeing becomes largest division" },
    { year: "2022", event: "€670M Efficiency Programme", note: "400 fewer brands, 6-category simplification" },
    { year: "2023", event: "Hein Schumacher CEO", note: "Performance culture shift, results-first mandate" },
    { year: "2024", event: "Power Brands Acceleration", note: "30 Power Brands delivering 75%+ of revenue" },
    { year: "2025", event: "Growth Action Plan", note: "Volume-led USG, D2C and digital commerce scaling" },
  ];

  return (
    <div>
      <SectionTitle sub="Executive snapshot — 30 Power Brands performance at a glance">Overview</SectionTitle>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="FY2024 Revenue" value="€60.8B" sub="+2.0% vs FY2023" color="#34D399" />
        <StatCard label="Avg. Organic Growth" value={`${avgUSG}%`} sub="Underlying Sales Growth" color="#FBBF24" />
        <StatCard label="BCG Stars" value={`${stars}/30`} sub="High-growth, high-share" color="#818CF8" />
        <StatCard label="Portfolio Health" value={`${strong}/30`} sub="Brands rated Strong" color="#3B82F6" />
        <StatCard label="EBIT Margin" value="16.8%" sub="FY2024 reported" color="#F472B6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>REVENUE TREND BY SEGMENT (€B)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FINANCIALS.revenue.slice(-4)}>
              <XAxis dataKey="year" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
              <Bar dataKey="beauty" stackId="a" fill="#3B82F6" name="Beauty" />
              <Bar dataKey="personal" stackId="a" fill="#06B6D4" name="Personal Care" />
              <Bar dataKey="home" stackId="a" fill="#10B981" name="Home Care" />
              <Bar dataKey="foods" stackId="a" fill="#F59E0B" name="Foods" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>PORTFOLIO BCG DISTRIBUTION {simEnabled && <span style={{ fontSize: 10, color: "#A78BFA", fontWeight: 400 }}>⚡ Simulated</span>}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(BCG_COLORS).map(([label, color]) => {
              const count = effectiveBrands.filter(b => b.bcg === label).length;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "#D1D5DB", width: 120 }}>{label}</div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 8 }}>
                    <div style={{ width: `${(count / effectiveBrands.length) * 100}%`, background: color, height: "100%", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 13, color, fontWeight: 700, minWidth: 24 }}>{count}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FBBF24", marginBottom: 6 }}>⚡ KEY STRATEGIC INSIGHT</div>
            <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.6 }}>Power Brands deliver 75%+ of revenue. Nutrafol, Liquid I.V. and Pukka are high-velocity emerging platforms. Lipton and Lux require Q3 intervention plans.</div>
          </div>
        </div>
      </div>

      {/* SOLUTION ARCHITECTURE + UPLOAD PORTAL */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>PLATFORM SOLUTION ARCHITECTURE</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {uploads.length > 0 && (
              <div style={{ fontSize: 10, color: "#34D399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
                {uploads.length} file{uploads.length > 1 ? "s" : ""} attached
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: 11, color: "#60A5FA", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 7, padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}>
              + Upload
            </button>
            <input ref={fileInputRef} type="file" multiple accept="*/*" style={{ display: "none" }} onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
          </div>
        </div>

        {/* Architecture flow */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
          {[["Brand Data Layer", "30 brands × 40+ fields", "#3B82F6"], ["→", "", ""], ["Analytics Engine", "BCG · Funnel · Radar · Simulation", "#06B6D4"], ["→", "", ""], ["AI Intelligence", "Rule-based alerts + AI Analyst", "#8B5CF6"], ["→", "", ""], ["Decision Layer", "Exec dashboard · Country analytics", "#34D399"]].map(([t, d, c], i) => (
            t === "→" ? <div key={i} style={{ color: "#374151", fontSize: 18 }}>→</div> :
            <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}33`, borderRadius: 10, padding: "10px 16px", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c }}>{t}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7, marginBottom: uploads.length > 0 ? 16 : 0 }}>
          Built on React + Recharts. Stateless data layer designed for drop-in Supabase or REST API replacement. 12 analytical modules powered by a single 30-brand data model — extending to real-time requires no architectural changes.
        </div>

        {/* Drop zone — shown when no uploads yet */}
        {uploads.length === 0 && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              marginTop: 14,
              border: `1.5px dashed ${dragOver ? "#60A5FA" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 10,
              padding: "18px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.01)",
              transition: "all 0.15s",
            }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>📎</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Drop reports, videos or images here — they'll appear as solution assets below</div>
            <div style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>PDF · DOCX · PPTX · MP4 · PNG · JPG · and more</div>
          </div>
        )}

        {/* Uploaded files grid */}
        {uploads.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Solution Assets
            </div>
            {/* Tabs by type */}
            {["report","video","image"].map(type => {
              const group = uploads.filter(u => u.type === type);
              if (group.length === 0) return null;
              const cfg = FILE_TYPES[type];
              return (
                <div key={type} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: cfg.color, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{cfg.icon}</span>
                    <span>{cfg.label.toUpperCase()}S</span>
                    <span style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`, borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{group.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {group.map(file => (
                      <div key={file.id} style={{
                        background: `${cfg.color}09`,
                        border: `1px solid ${cfg.color}2a`,
                        borderRadius: 9,
                        padding: "10px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        position: "relative",
                      }}>
                        {/* Preview for images */}
                        {file.type === "image" && (
                          <img src={file.url} alt={file.name}
                            style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginBottom: 4, border: "1px solid rgba(255,255,255,0.07)" }} />
                        )}
                        {/* Preview for video */}
                        {file.type === "video" && (
                          <video src={file.url} controls style={{ width: "100%", height: 80, borderRadius: 6, marginBottom: 4, background: "#000" }} />
                        )}
                        {/* Report icon */}
                        {file.type === "report" && (
                          <div style={{ fontSize: 24, marginBottom: 2 }}>{cfg.icon}</div>
                        )}
                        <div style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.3 }}>{file.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, color: "#6B7280" }}>{fmtSize(file.size)} · {file.date}</span>
                          <div style={{ display: "flex", gap: 4 }}>
                            {file.type === "report" && (
                              <a href={file.url} download={file.name}
                                style={{ fontSize: 10, color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}33`, borderRadius: 4, padding: "2px 6px", textDecoration: "none", cursor: "pointer" }}>
                                ↓
                              </a>
                            )}
                            <button onClick={() => onDeleteUpload && onDeleteUpload(file.id)}
                              style={{ fontSize: 10, color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add more drop zone at bottom */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `1px dashed ${dragOver ? "#60A5FA" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8,
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(59,130,246,0.05)" : "transparent",
                fontSize: 11,
                color: "#4B5563",
                transition: "all 0.15s",
                marginTop: 4,
              }}>
              + Drop more files
            </div>
          </div>
        )}
      </div>

      {/* KEY INSIGHTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>KEY INSIGHTS — FY2024</div>
          {[["🚀 Acceleration Plays", "Hellmann's (+8.4% USG), Nutrafol (+28%), Liquid I.V. (+23%), Pukka (+14%) are portfolio growth engines.", "#34D399"],
            ["⚠️ Intervention Required", "Lipton (-0.8% USG), Lux (funnel -14pts), TRESemmé (NPS 18pts below avg) need structural fixes.", "#F87171"],
            ["💡 Premium Opportunity", "Dermalogica, Maille and Nutrafol achieving 42–48% margins — premium-mix shift could add 200bps to group EBIT.", "#FBBF24"],
            ["🌍 Emerging Market Alpha", "India, Nigeria, Indonesia collectively represent 40%+ of growth potential. Surf Excel and Lifebuoy are key vectors.", "#818CF8"],
          ].map(([t, d, c]) => (
            <div key={t} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>

        {/* STRATEGIC TIMELINE */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 2 }}>STRATEGIC TIMELINE</div>
          <div style={{ fontSize: 10, color: "#4B5563", marginBottom: 12 }}>Revenue milestones & strategy events 2019–2025</div>
          {/* Revenue sparkline bars */}
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 36, marginBottom: 6, padding: "0 2px" }}>
            {FINANCIALS.revenue.map((r, i) => {
              const max = Math.max(...FINANCIALS.revenue.map(x => x.total));
              const h = Math.round((r.total / max) * 100);
              const isLast = i === FINANCIALS.revenue.length - 1;
              return (
                <div key={r.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                  <div style={{ width: "80%", background: isLast ? "#34D399" : "rgba(59,130,246,0.35)", borderRadius: "2px 2px 0 0", height: `${h}%`, minHeight: 4, transition: "height 0.4s" }} />
                </div>
              );
            })}
          </div>
          {/* Timeline connector + dots */}
          <div style={{ position: "relative", display: "flex", marginBottom: 4 }}>
            <div style={{ position: "absolute", top: 5, left: "4%", right: "4%", height: 2, background: "linear-gradient(90deg, #3B82F6, #34D399)", borderRadius: 2 }} />
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: i === TIMELINE.length - 1 ? 12 : 8, height: i === TIMELINE.length - 1 ? 12 : 8, borderRadius: "50%", background: i === TIMELINE.length - 1 ? "#34D399" : "#3B82F6", border: "2px solid #0D1117", boxShadow: i === TIMELINE.length - 1 ? "0 0 8px #34D39966" : "none" }} />
              </div>
            ))}
          </div>
          {/* Year labels */}
          <div style={{ display: "flex", marginBottom: 14 }}>
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ flex: 1, textAlign: "center", fontSize: 9, color: i === TIMELINE.length - 1 ? "#34D399" : "#3B82F6", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{t.year}</div>
            ))}
          </div>
          {/* Event list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {TIMELINE.map((t, i) => {
              const rev = FINANCIALS.revenue.find(r => r.year === t.year);
              return (
                <div key={t.year} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 8px", borderRadius: 7, background: i === TIMELINE.length - 1 ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", borderLeft: `2px solid ${i === TIMELINE.length - 1 ? "#34D399" : "rgba(59,130,246,0.3)"}` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: i === TIMELINE.length - 1 ? "#34D399" : "#3B82F6", fontFamily: "'IBM Plex Mono', monospace", minWidth: 28, flexShrink: 0 }}>{t.year}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#D1D5DB" }}>{t.event}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{t.note}</div>
                  </div>
                  {rev && <span style={{ fontSize: 9, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, alignSelf: "center" }}>€{rev.total}B</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {[
          { label: "Critical Alerts", count: AI_ALERTS.filter(a => a.level === "Critical").length, color: "#F87171", bg: "rgba(248,113,113,0.1)" },
          { label: "Watch Brands", count: effectiveBrands.filter(b => b.status === "Watch").length, color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
          { label: "Growth Opportunities", count: AI_ALERTS.filter(a => a.level === "Opportunity").length, color: "#34D399", bg: "rgba(52,211,153,0.1)" },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.color}22`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: item.color, fontFamily: "'IBM Plex Mono', monospace" }}>{item.count}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};const BrandPortfolioPage = ({ selectedBrand, setSelectedBrand, effectiveBrands = BRANDS, uploads, onDeleteUpload }) => {
  const brand = effectiveBrands.find(b => b.id === selectedBrand) || effectiveBrands[0];
  const radarAxes = ["Financial Momentum","Profitability","Market Leadership","Consumer Loyalty","Digital Engagement","Innovation","Sustainability","Premium Potential","Geo Diversity","Competitive Moat","Z-Gen Resonance","Strategic Weight"];

  return (
    <div>
      <SectionTitle sub="Select a brand to explore its full 40-field strategic profile">Brand Portfolio</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {BRANDS.map(b => (
          <button key={b.id} onClick={() => setSelectedBrand(b.id)}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: selectedBrand === b.id ? 700 : 400 }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F9FAFB" }}>{brand.name}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <Badge text={brand.category} color={SEGMENTS[brand.category]} />
                <Badge text={brand.status} color={brand.status === "Strong" ? "#34D399" : "#FBBF24"} />
                <Badge text={brand.bcg} color={BCG_COLORS[brand.bcg]} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>€{brand.revenue}B</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>FY Revenue</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["USG %", brand.usg + "%", "#FBBF24"], ["NPS", brand.nps, "#818CF8"], ["Margin", brand.margin + "%", "#34D399"], ["CLV", "€" + brand.clv, "#3B82F6"], ["Mkt Share", brand.marketShare + "%", "#06B6D4"], ["Elasticity", brand.elasticity, "#F472B6"]].map(([k, v, c]) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 12 }}>
            <span style={{ color: "#60A5FA", fontWeight: 600 }}>Insight: </span>{brand.insight}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 12 }}>
            <span style={{ color: "#F87171", fontWeight: 600 }}>Risk: </span>{brand.risk}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>
            <span style={{ color: "#34D399", fontWeight: 600 }}>Action: </span>{brand.action}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>12-AXIS BRAND HEALTH RADAR</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarAxes.map((a, i) => ({ subject: a.split(" ")[0], value: brand.radarScores[i] }))}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7280", fontSize: 9 }} />
              <Radar dataKey="value" stroke={SEGMENTS[brand.category]} fill={SEGMENTS[brand.category]} fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 14 }}>CONSUMER FUNNEL (AIDA)</div>
          {[["Awareness", brand.awareness, "#3B82F6"], ["Consideration", brand.consideration, "#06B6D4"], ["Preference", brand.preference, "#8B5CF6"], ["Purchase", brand.purchase, "#FBBF24"], ["Loyalty", brand.loyalty, "#34D399"]].map(([stage, val, color]) => (
            <div key={stage} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{stage}</span>
                <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{val}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${val}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>TOP 5 MARKETS</div>
          {brand.markets.map(([country, share, flag]) => (
            <div key={country} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{flag}</span>
              <span style={{ fontSize: 13, color: "#D1D5DB", width: 100 }}>{country}</span>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${share}%`, background: SEGMENTS[brand.category], height: "100%", borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, color: "#9CA3AF", minWidth: 30, textAlign: "right" }}>{share}%</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#6B7280" }}>5-YEAR VISION</div>
            <div style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4 }}>{brand.vision5y}</div>
          </div>
          {brand.strategicRec && (
            <div style={{ marginTop: 10, padding: "12px 14px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 700, marginBottom: 6 }}>🧠 STRATEGIC RECOMMENDATION</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.6 }}>{brand.strategicRec}</div>
            </div>
          )}
        </div>
      </div>

      {/* Brand-Specific Assets & Evidence Module */}
      <div style={{ marginTop: 32, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "24px 32px" }}>
         <FilesModule uploads={uploads} brandFilter={brand.name} onDeleteUpload={onDeleteUpload} />
      </div>

    </div>
  );
};const FinancialsPage = ({ effectiveBrands = BRANDS, simEnabled = false }) => {
  const totalRevSim = effectiveBrands.reduce((s, b) => s + b.revenue, 0);
  const avgMarginSim = (effectiveBrands.reduce((s, b) => s + b.margin, 0) / effectiveBrands.length).toFixed(1);
  const revDelta = ((totalRevSim - 60.76) / 60.76 * 100).toFixed(1);

  const incomeStatement = [
    { item: "Net Revenue", value: 60.76, pct: "100%", color: "#F9FAFB", bold: true },
    { item: "Cost of Goods Sold (COGS)", value: -35.00, pct: "57.6%", color: "#F87171", indent: true },
    { item: "Gross Profit", value: 25.76, pct: "42.4%", color: "#34D399", bold: true },
    { item: "Operating Expenses (Selling & Admin)", value: -14.33, pct: "23.6%", color: "#F87171", indent: true },
    { item: "Research & Development", value: -1.22, pct: "2.0%", color: "#F87171", indent: true },
    { item: "Operating Profit (EBIT)", value: 10.21, pct: "16.8%", color: "#60A5FA", bold: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle sub="Consolidated CFO dashboard: Income statement, margin analysis & category deep-dives">Financial Performance {simEnabled && <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 400 }}>⚡ Simulated</span>}</SectionTitle>
      
      {simEnabled && (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, padding: "12px 20px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#A78BFA", marginBottom: 4 }}>SIMULATED PORTFOLIO REVENUE</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", fontFamily: "'IBM Plex Mono', monospace" }}>€{totalRevSim.toFixed(2)}B</div>
            <div style={{ fontSize: 11, color: Number(revDelta) >= 0 ? "#34D399" : "#F87171", marginTop: 2 }}>{Number(revDelta) >= 0 ? "▲" : "▼"} {Math.abs(Number(revDelta))}% vs actual</div>
          </div>
          <div style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, padding: "12px 20px", flex: 1 }}>
            <div style={{ fontSize: 11, color: "#A78BFA", marginBottom: 4 }}>SIMULATED AVG MARGIN</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", fontFamily: "'IBM Plex Mono', monospace" }}>{avgMarginSim}%</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Portfolio weighted average</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        {FINANCIALS.margins.map((m, i) => (
          <motion.div key={m.metric} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ flex: 1 }}>
            <StatCard label={m.metric} value={`${m.value}%`} color={m.value > 30 ? "#34D399" : m.value > 15 ? "#60A5FA" : "#FBBF24"} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* P&L Statement Grid */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>FY2024 Income Statement (€B)</div>
          <div>
            {incomeStatement.map((item, i) => (
              <div key={item.item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i === incomeStatement.length -1 ? "none" : "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 13, color: item.bold ? "#F9FAFB" : "#D1D5DB", fontWeight: item.bold ? 700 : 400, marginLeft: item.indent ? 16 : 0 }}>{item.item}</span>
                <div style={{ display: "flex", gap: 16, alignItems: "center", width: 140, justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 14, color: item.color, fontWeight: item.bold ? 700 : 400, fontFamily: "'IBM Plex Mono', monospace" }}>{item.value > 0 ? "€" + item.value.toFixed(2) : "-€" + Math.abs(item.value).toFixed(2)}</span>
                  <span style={{ fontSize: 11, color: "#6B7280", minWidth: 40, textAlign: "right" }}>{item.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Bar Category Evolution */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category Revenue Mix YoY (€B)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={FINANCIALS.revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF", paddingTop: 10 }} />
              <Bar dataKey="beauty" stackId="a" fill={SEGMENTS["Beauty & Wellbeing"]} name="Beauty & Wellbeing" />
              <Bar dataKey="personal" stackId="a" fill={SEGMENTS["Personal Care"]} name="Personal Care" />
              <Bar dataKey="home" stackId="a" fill={SEGMENTS["Home Care"]} name="Home Care" />
              <Bar dataKey="foods" stackId="a" fill={SEGMENTS["Foods"]} name="Foods" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        {/* Segment Growth Matrix */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Segment Profitability & Margin Matrix</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "#6B7280", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Division</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#6B7280", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Revenue 2024</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#6B7280", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.05em" }}>YoY Growth</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#6B7280", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Op Margin</th>
                  <th style={{ textAlign: "right", padding: "10px 14px", color: "#6B7280", fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Personal Care", rev: 18.2, growth: 6.4, opMargin: 19.8, cont: 30.0 },
                  { name: "Beauty & Wellbeing", rev: 14.1, growth: 8.3, opMargin: 22.4, cont: 23.2 },
                  { name: "Home Care", rev: 14.9, growth: 0.6, opMargin: 14.2, cont: 24.5 },
                  { name: "Foods", rev: 13.56, growth: -6.5, opMargin: 17.5, cont: 22.3 }
                ].map((row, i) => (
                  <motion.tr initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }} key={row.name}>
                    <td style={{ padding: "16px 14px", borderBottom: i===3 ? "none" : "1px solid rgba(255,255,255,0.04)" }}><Badge text={row.name} color={SEGMENTS[row.name]} /></td>
                    <td style={{ padding: "16px 14px", textAlign: "right", color: "#D1D5DB", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600 }}>€{row.rev.toFixed(1)}B</td>
                    <td style={{ padding: "16px 14px", textAlign: "right", color: row.growth > 0 ? "#34D399" : "#F87171", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600 }}>{row.growth > 0 ? "+" : ""}{row.growth}%</td>
                    <td style={{ padding: "16px 14px", textAlign: "right", color: row.opMargin > 18 ? "#60A5FA" : "#FBBF24", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600 }}>{row.opMargin}%</td>
                    <td style={{ padding: "16px 14px", textAlign: "right", color: "#9CA3AF", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 }}>{row.cont}%</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};const BCGPage = ({ effectiveBrands = BRANDS, simEnabled = false }) => {
  const scatter = effectiveBrands.map(b => ({ 
    x: b.marketShare, 
    y: b.categoryGrowth, 
    z: b.revenue, 
    name: b.name, 
    bcg: b.bcg, 
  }));

  const grouped = {
    Star: effectiveBrands.filter(b => b.bcg === "Star"),
    "Cash Cow": effectiveBrands.filter(b => b.bcg === "Cash Cow"),
    "Question Mark": effectiveBrands.filter(b => b.bcg === "Question Mark"),
    Dog: effectiveBrands.filter(b => b.bcg === "Dog"),
  };

  const strats = {
    Star: { action: "Build & Invest", desc: "High growth, high share. Aggressive investment to maintain position." },
    "Cash Cow": { action: "Hold & Harvest", desc: "Low growth, high share. Generate cash to fund Stars and Question Marks." },
    "Question Mark": { action: "Build or Divest", desc: "High growth, low share. Requires heavy investment to gain share." },
    Dog: { action: "Harvest or Divest", desc: "Low growth, low share. Minimize investment, liquidate if necessary." }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle sub="Growth-Share Matrix: Capital allocation and portfolio balancing strategy">BCG Matrix {simEnabled && <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 400 }}>⚡ Simulated</span>}</SectionTitle>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        
        {/* SCATTER PLOT AREA */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)", display: "flex", flexDirection: "column" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Market Share vs Growth Map</div>
            <div style={{ display: "flex", gap: 12 }}>
              {Object.entries(BCG_COLORS).map(([label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", flex: 1, minHeight: 400 }}>
            {/* Background Quadrants */}
            <div style={{ position: "absolute", top:0, left:0, right:0, bottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", zIndex: 0, opacity: 0.4 }}>
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.1)", borderBottom: "1px dashed rgba(255,255,255,0.1)", background: "rgba(251,191,36,0.02)", position: "relative" }}>
                 <span style={{ position: "absolute", top: 10, right: 10, fontSize: 12, fontWeight: 700, color: "rgba(251,191,36,0.5)" }}>STARS</span>
              </div>
              <div style={{ borderBottom: "1px dashed rgba(255,255,255,0.1)", background: "rgba(129,140,248,0.02)", position: "relative" }}>
                 <span style={{ position: "absolute", top: 10, left: 10, fontSize: 12, fontWeight: 700, color: "rgba(129,140,248,0.5)" }}>QUESTION MARKS</span>
              </div>
              <div style={{ borderRight: "1px dashed rgba(255,255,255,0.1)", background: "rgba(52,211,153,0.02)", position: "relative" }}>
                 <span style={{ position: "absolute", bottom: 10, right: 10, fontSize: 12, fontWeight: 700, color: "rgba(52,211,153,0.5)" }}>CASH COWS</span>
              </div>
              <div style={{ background: "rgba(248,113,113,0.02)", position: "relative" }}>
                 <span style={{ position: "absolute", bottom: 10, left: 10, fontSize: 12, fontWeight: 700, color: "rgba(248,113,113,0.5)" }}>DOGS</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="x" name="Market Share %" type="number" reversed={true} domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 10 }} label={{ value: "Relative Market Share % (High ◀ ▶ Low)", position: "bottom", fill: "#6B7280", fontSize: 11 }} />
                <YAxis dataKey="y" name="Market Growth %" type="number" domain={[-5, 30]} tick={{ fill: "#6B7280", fontSize: 10 }} label={{ value: "Market Growth Rate % (Low ▼ ▲ High)", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} 
                  cursor={{ strokeDasharray: "3 3", stroke: "#374151" }} 
                />
                {Object.entries(BCG_COLORS).map(([label, color]) => (
                  <Scatter key={label} name={label} data={scatter.filter(d => d.bcg === label)} fill={color} fillOpacity={0.8} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 10, textAlign: "right" }}>* Note: Bubble sizing based on revenue axis omitted for precise coordinate mapping.</div>
        </div>

        {/* QUADRANT ANALYSIS SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["Star", "Cash Cow", "Question Mark"].map((quad, i) => {
            const brands = grouped[quad];
            const color = BCG_COLORS[quad];
            const revSum = brands.reduce((s,b)=>s+b.revenue, 0);
            return (
              <motion.div key={quad} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${color}33`, borderRadius: 14, padding: 16, backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color, textTransform: "uppercase" }}>{quad}S ({brands.length})</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB", fontFamily: "'IBM Plex Mono', monospace" }}>€{revSum.toFixed(1)}B</div>
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12, lineHeight: 1.4 }}>
                  <strong style={{ color: "#D1D5DB" }}>{strats[quad].action}:</strong> {strats[quad].desc}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxHeight: 110, overflowY: "auto", paddingRight: 4 }}>
                  {brands.map(b => (
                    <span key={b.name} style={{ fontSize: 11, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 6, padding: "3px 8px", color: "#F9FAFB" }}>{b.name}</span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
};const CompetitionPage = () => {
  const battleground = [
    { region: "North America", unilever: 18, pg: 34, nestle: 22, henkel: 8 },
    { region: "Western Europe", unilever: 24, pg: 22, nestle: 28, henkel: 14 },
    { region: "South Asia", unilever: 42, pg: 18, nestle: 12, henkel: 4 },
    { region: "Latin America", unilever: 32, pg: 24, nestle: 18, henkel: 6 },
  ];

  const moats = [
    { name: "Digital Commerce ROI", unilever: 68, pg: 82, henkel: 76, color: "#3B82F6" },
    { name: "ESG / Sustainability Index", unilever: 91, pg: 64, henkel: 72, color: "#34D399" },
    { name: "D2C Velocity", unilever: 44, pg: 58, henkel: 52, color: "#FBBF24" },
    { name: "Brand Purpose Equity", unilever: 88, pg: 62, henkel: 58, color: "#818CF8" }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle sub="Comprehensive competitive landscape vs. Tier-1 FMCG peers">Competitive Analysis</SectionTitle>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        
        {/* 6-AXIS RADAR */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Market Dimensions Radar</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={COMPETITOR_RADAR}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
              <Radar name="Unilever" dataKey="Unilever" stroke="#34D399" fill="#34D399" fillOpacity={0.18} strokeWidth={2} />
              <Radar name="P&G" dataKey="PG" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Nestlé" dataKey="Nestle" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Henkel" dataKey="Henkel" stroke="#818CF8" fill="#818CF8" fillOpacity={0.08} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* BATTLEGROUND MATRIX */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Regional Market Share Battlegrounds</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={battleground} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 10 }} />
              <YAxis dataKey="region" type="category" tick={{ fill: "#D1D5DB", fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
              <Bar dataKey="unilever" name="Unilever" stackId="a" fill="#34D399" />
              <Bar dataKey="pg" name="P&G" stackId="a" fill="#3B82F6" />
              <Bar dataKey="nestle" name="Nestlé" stackId="a" fill="#F59E0B" />
              <Bar dataKey="henkel" name="Henkel" stackId="a" fill="#818CF8" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginTop: 20 }}>
        {/* STRATEGIC MOAT ASSESSMENT */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Strategic Capability Moats</div>
          {moats.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 600 }}>{m.name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {/* Unilever */}
                <div>
                  <div style={{ fontSize: 10, color: "#34D399", marginBottom: 4 }}>Unilever ({m.unilever})</div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${m.unilever}%`, background: "#34D399", borderRadius: 3 }} />
                  </div>
                </div>
                {/* P&G */}
                <div>
                  <div style={{ fontSize: 10, color: "#3B82F6", marginBottom: 4 }}>P&G ({m.pg})</div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${m.pg}%`, background: "#3B82F6", borderRadius: 3 }} />
                  </div>
                </div>
                {/* Henkel */}
                <div>
                  <div style={{ fontSize: 10, color: "#818CF8", marginBottom: 4 }}>Henkel ({m.henkel})</div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${m.henkel}%`, background: "#818CF8", borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* COMPETITIVE INTELLIGENCE BULLETS */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Threat Intelligence</div>
          {[
            ["🌱 ESG Advantage", "Unilever holds a 27pt lead over P&G in sustainability metrics. Crucial for EU market defensibility.", "#34D399"],
            ["🌍 Emerging Markets", "Structural moat in South Asia & LatAm with unmatchable rural distribution. High growth exposure.", "#FBBF24"],
            ["⚔️ Food Squeeze", "Nestlé out-investing in premium coffee and culinary, threatening Knorr's shelf share.", "#F87171"],
            ["⚡ Digital Gap", "P&G's earlier pivot to D2C yields a 14pt advantage in digital commerce ROI.", "#F472B6"],
          ].map(([t, d, c]) => (
            <div key={t} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── DEEP FUNNEL PAGE ────────────────────────────────────────────────────────const FunnelPage = ({ selectedBrand, setSelectedBrand }) => {
  const [tab, setTab] = useState("classic");
  const brand = BRANDS.find(b => b.id === selectedBrand) || BRANDS[0];
  const fd = brand.funnelDeep;
  const stages = [
    { name: "Awareness", value: brand.awareness },
    { name: "Consideration", value: brand.consideration },
    { name: "Preference", value: brand.preference },
    { name: "Purchase", value: brand.purchase },
    { name: "Loyalty", value: brand.loyalty },
  ];
  const stageColors = ["#3B82F6","#06B6D4","#8B5CF6","#FBBF24","#34D399"];

  const getBiggestDrop = () => {
    let max = 0; let stage = "";
    for (let i = 1; i < stages.length; i++) {
      const d = stages[i-1].value - stages[i].value;
      if (d > max) { max = d; stage = stages[i].name; }
    }
    return { stage, drop: max };
  };

  const segmentData = fd ? [
    { seg: "Gen Z", ...fd.byAge.genZ },
    { seg: "Millennials", ...fd.byAge.millennial },
    { seg: "Gen X", ...fd.byAge.genX },
    { seg: "Boomers", ...fd.byAge.boomer },
  ] : [];

  return (
    <div>
      <SectionTitle sub="AIDA funnel — 3-layer analysis: classic, segment breakdown, root cause diagnosis">Brand Funnel</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {BRANDS.map(b => (
          <button key={b.id} onClick={() => setSelectedBrand(b.id)}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
            {b.name}
          </button>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[["classic","Classic AIDA"],["segments","Segment Breakdown"],["diagnosis","Root Cause"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: "7px 18px", borderRadius: 7, border: "none", background: tab === id ? "#1D4ED8" : "transparent", color: tab === id ? "#fff" : "#6B7280", fontSize: 12, fontWeight: tab === id ? 700 : 400, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: CLASSIC */}
      {tab === "classic" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 20 }}>{brand.name} — Consumer Journey</div>
            {stages.map((s, i) => {
              const drop = i > 0 ? stages[i-1].value - s.value : 0;
              return (
                <div key={s.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#D1D5DB", fontWeight: 600 }}>{s.name}</span>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {drop > 0 && <span style={{ fontSize: 11, color: "#F87171" }}>−{drop}pp</span>}
                      <span style={{ fontSize: 14, color: stageColors[i], fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{s.value}%</span>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 10 }}>
                    <div style={{ width: `${s.value}%`, background: stageColors[i], height: "100%", borderRadius: 6 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 16 }}>FUNNEL QUICK STATS</div>
            {[["End-to-End Conversion", `${((brand.purchase / brand.awareness) * 100).toFixed(1)}%`, "#FBBF24"],
              ["Consideration→Purchase", `${((brand.purchase / brand.consideration) * 100).toFixed(1)}%`, "#3B82F6"],
              ["Biggest Drop Stage", getBiggestDrop().stage + " (−" + getBiggestDrop().drop + "pp)", "#F87171"],
            ].map(([k, v, c]) => (
              <div key={k} style={{ marginBottom: 14, padding: "12px 16px", background: `${c}0d`, border: `1px solid ${c}22`, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{k}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: c, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>{v}</div>
              </div>
            ))}
            <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#34D399", fontWeight: 700 }}>RECOMMENDED ACTION</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>{brand.action}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEGMENT BREAKDOWN */}
      {tab === "segments" && (
        <div>
          {fd ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>PURCHASE RATE BY AGE GROUP</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={segmentData.map(d => ({ name: d.seg, purchase: d.purchase, awareness: d.awareness }))}>
                    <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
                    <Bar dataKey="awareness" fill="rgba(59,130,246,0.3)" name="Awareness" radius={[3,3,0,0]} />
                    <Bar dataKey="purchase" fill="#FBBF24" name="Purchase" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 14 }}>
                  {segmentData.map(d => (
                    <div key={d.seg} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{d.seg} full funnel</span>
                        <span style={{ fontSize: 12, color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{((d.purchase / d.awareness) * 100).toFixed(0)}% conv.</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 4 }}>
                        <div style={{ width: `${(d.purchase / d.awareness) * 100}%`, background: "#FBBF24", height: "100%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 12 }}>PURCHASE BY GENDER</div>
                  {[["Female", fd.byGender.female.purchase, "#F472B6"], ["Male", fd.byGender.male.purchase, "#3B82F6"]].map(([g, v, c]) => (
                    <div key={g} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{g}</span>
                        <span style={{ fontSize: 14, color: c, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{v}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 7 }}>
                        <div style={{ width: `${v}%`, background: c, height: "100%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 12 }}>PURCHASE BY INCOME TIER</div>
                  {[["High Income", fd.byIncome.high.purchase, "#34D399"], ["Mid Income", fd.byIncome.mid.purchase, "#FBBF24"], ["Low Income", fd.byIncome.low.purchase, "#F87171"]].map(([tier, v, c]) => (
                    <div key={tier} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{tier}</span>
                        <span style={{ fontSize: 14, color: c, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{v}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 7 }}>
                        <div style={{ width: `${v}%`, background: c, height: "100%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#FBBF24", marginBottom: 8 }}>Segment data available for: Dove, Omo/Persil, Lux, Sunsilk, Knorr</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>Select one of those brands to view demographic breakdown, or select another brand for Classic AIDA view.</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ROOT CAUSE DIAGNOSIS */}
      {tab === "diagnosis" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>BRAND vs CATEGORY BENCHMARK</div>
            {fd ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stages.map((s, i) => ({ stage: s.name.slice(0,4), brand: s.value, benchmark: fd.competitor[s.name.toLowerCase()] || s.value - 5 }))}>
                  <XAxis dataKey="stage" tick={{ fill: "#6B7280", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} domain={[0,100]} />
                  <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="brand" fill={SEGMENTS[brand.category]} name={brand.name} radius={[3,3,0,0]} />
                  <Bar dataKey="benchmark" fill="rgba(107,114,128,0.5)" name="Category Avg" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center", paddingTop: 60 }}>Select Dove, Omo, Lux, Sunsilk or Knorr for benchmark data</div>
            )}
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>DIAGNOSIS & RECOMMENDATIONS</div>
            <div style={{ marginBottom: 14, padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#F87171", marginBottom: 6 }}>🔴 PRIMARY BOTTLENECK</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.5 }}>
                {getBiggestDrop().stage} stage has the largest conversion gap at −{getBiggestDrop().drop}pp.
                {getBiggestDrop().stage === "Preference" ? " Likely cause: insufficient brand differentiation vs. alternatives at moment of decision." :
                 getBiggestDrop().stage === "Consideration" ? " Likely cause: low salience or SOV in the category — media investment review required." :
                 getBiggestDrop().stage === "Purchase" ? " Likely cause: distribution or availability gap, or price barrier at shelf." :
                 getBiggestDrop().stage === "Loyalty" ? " Likely cause: weak post-purchase experience or repeat incentive — CRM or loyalty mechanic needed." :
                 " Review brand awareness investment and reach strategy."}
              </div>
            </div>
            {fd && (() => {
              const gaps = stages.map((s, i) => ({
                stage: s.name,
                gap: s.value - (fd.competitor[s.name.toLowerCase()] || s.value)
              })).filter(g => g.gap < 0);
              return gaps.length > 0 ? (
                <div style={{ marginBottom: 14, padding: "12px 16px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24", marginBottom: 6 }}>⚠️ COMPETITIVE GAPS</div>
                  {gaps.map(g => (
                    <div key={g.stage} style={{ fontSize: 12, color: "#D1D5DB", marginBottom: 4 }}>{g.stage}: {Math.abs(g.gap)}pp below category average</div>
                  ))}
                </div>
              ) : null;
            })()}
            <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#34D399", marginBottom: 6 }}>✅ STRATEGIC RECOMMENDATION</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.5 }}>{brand.action}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── BRAND SIMULATION STUDIO ─────────────────────────────────────────────────
const SimulationStudio = ({ selectedBrand, setSelectedBrand, simState, setSimState, simEnabled, setSimEnabled }) => {
  const baseBrand = BRANDS.find(b => b.id === selectedBrand) || BRANDS[0];

  const [controls, setControls] = useState({ price: 0, marketing: 0, innovation: 5, distribution: 0, cogs: 0 });

  const compute = (b, c) => {
    const volumeMultiplier = 1 + (c.price * b.elasticity / 100);
    const newRevenue = b.revenue * (1 + c.price / 100) * volumeMultiplier;
    const newMargin = Math.max(0, b.margin - c.cogs * 0.6);
    const newAwareness = Math.min(100, Math.round(b.awareness * (1 + c.marketing * 0.12 / 100)));
    const newConsideration = Math.min(100, Math.round(b.consideration * (1 + c.marketing * 0.15 / 100)));
    const newPreference = Math.min(100, Math.round(b.preference + (c.innovation - 5) * 2));
    const newPurchase = Math.min(100, Math.round(b.purchase * (1 + c.distribution * 0.4 / 100)));
    const newLoyalty = Math.min(100, Math.round(b.loyalty + (c.innovation - 5) * 1.5));
    const newProfit = newRevenue * newMargin / 100;
    const baseProfit = b.revenue * b.margin / 100;
    return { newRevenue, newMargin, newAwareness, newConsideration, newPreference, newPurchase, newLoyalty, newProfit, baseProfit };
  };

  const result = compute(baseBrand, controls);

  const resetSim = () => {
    setControls({ price: 0, marketing: 0, innovation: 5, distribution: 0, cogs: 0 });
    setSimEnabled(false);
    setSimState(null);
  };

  const applyGlobally = () => {
    const updated = { ...baseBrand, revenue: Number(result.newRevenue.toFixed(2)), margin: Number(result.newMargin.toFixed(1)), awareness: result.newAwareness, consideration: result.newConsideration, preference: result.newPreference, purchase: result.newPurchase, loyalty: result.newLoyalty };
    setSimState({ brandId: baseBrand.id, data: updated });
    setSimEnabled(true);
  };

  const revDelta = ((result.newRevenue - baseBrand.revenue) / baseBrand.revenue * 100).toFixed(1);
  const profDelta = ((result.newProfit - result.baseProfit) / result.baseProfit * 100).toFixed(1);
  const mgnDelta = (result.newMargin - baseBrand.margin).toFixed(1);

  const sliders = [
    { key: "price", label: "Price Change", min: -20, max: 20, unit: "%", color: "#FBBF24", desc: "Affects volume via elasticity" },
    { key: "marketing", label: "Marketing Investment Δ", min: -30, max: 50, unit: "%", color: "#3B82F6", desc: "Drives Awareness & Consideration" },
    { key: "innovation", label: "Innovation Score", min: 1, max: 10, unit: "/10", color: "#8B5CF6", desc: "Lifts Preference & Loyalty" },
    { key: "distribution", label: "Distribution Width Δ", min: -10, max: 30, unit: "%", color: "#34D399", desc: "Boosts Purchase rate" },
    { key: "cogs", label: "COGS Change", min: -10, max: 30, unit: "%", color: "#F87171", desc: "Compresses gross margin" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <SectionTitle sub="Multi-lever P&L simulator — changes propagate globally to Overview, BCG, and Financials">Brand Simulation Studio</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {simEnabled && (
            <div style={{ padding: "6px 14px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 8, fontSize: 11, color: "#FBBF24", display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚡</span> Simulation active — other pages show simulated data
            </div>
          )}
          <button onClick={resetSim} style={{ padding: "6px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, fontSize: 11, color: "#F87171", cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {BRANDS.map(b => (
          <button key={b.id} onClick={() => { setSelectedBrand(b.id); setControls({ price: 0, marketing: 0, innovation: 5, distribution: 0, cogs: 0 }); setSimEnabled(false); setSimState(null); }}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* LEFT: CONTROL PANEL */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 4 }}>{baseBrand.name} — Control Panel</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 20 }}>Elasticity: <span style={{ color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{baseBrand.elasticity}</span> · Base Revenue: <span style={{ color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>€{baseBrand.revenue}B</span></div>
          {sliders.map(s => (
            <div key={s.key} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: "#4B5563", marginLeft: 8 }}>{s.desc}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {controls[s.key] > 0 && s.key !== "innovation" ? "+" : ""}{controls[s.key]}{s.unit}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} value={controls[s.key]}
                onChange={e => setControls(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                style={{ width: "100%", accentColor: s.color, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#374151", marginTop: 2 }}>
                <span>{s.min}{s.unit}</span><span>0</span><span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}
          <button onClick={applyGlobally}
            style={{ width: "100%", padding: "12px", background: "linear-gradient(90deg, #1D4ED8, #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
            ⚡ Apply Simulation Globally
          </button>
        </div>

        {/* RIGHT: IMPACT DASHBOARD */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>P&L IMPACT SUMMARY</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                ["Revenue Δ", (revDelta > 0 ? "+" : "") + revDelta + "%", Number(revDelta) >= 0 ? "#34D399" : "#F87171"],
                ["Profit Δ", (profDelta > 0 ? "+" : "") + profDelta + "%", Number(profDelta) >= 0 ? "#34D399" : "#F87171"],
                ["Margin Δ", (mgnDelta > 0 ? "+" : "") + mgnDelta + "pp", Number(mgnDelta) >= 0 ? "#34D399" : "#F87171"],
                ["New Revenue", `€${result.newRevenue.toFixed(2)}B`, "#FBBF24"],
                ["New Profit", `€${result.newProfit.toFixed(2)}B`, "#FBBF24"],
                ["New Margin", `${result.newMargin.toFixed(1)}%`, "#FBBF24"],
              ].map(([k, v, c]) => (
                <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>FUNNEL IMPACT</div>
            {[
              ["Awareness", baseBrand.awareness, result.newAwareness, "#3B82F6"],
              ["Consideration", baseBrand.consideration, result.newConsideration, "#06B6D4"],
              ["Preference", baseBrand.preference, result.newPreference, "#8B5CF6"],
              ["Purchase", baseBrand.purchase, result.newPurchase, "#FBBF24"],
              ["Loyalty", baseBrand.loyalty, result.newLoyalty, "#34D399"],
            ].map(([stage, base, sim, color]) => {
              const delta = sim - base;
              return (
                <div key={stage} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{stage}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#6B7280" }}>{base}%</span>
                      <span style={{ fontSize: 10, color: delta > 0 ? "#34D399" : delta < 0 ? "#F87171" : "#6B7280" }}>{delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{Math.abs(delta)}pp</span>
                      <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{sim}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    <div style={{ flex: base, background: color + "44", height: 5, borderRadius: 3 }} />
                    <div style={{ flex: Math.max(0, sim - base), background: color, height: 5, borderRadius: 3 }} />
                    <div style={{ flex: 100 - sim, background: "rgba(255,255,255,0.04)", height: 5, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 10 }}>REVENUE SENSITIVITY CURVE</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={[-20,-15,-10,-5,0,5,10,15,20].map(p => {
                const ve = p * baseBrand.elasticity;
                const nr = baseBrand.revenue * (1 + p/100) * (1 + ve/100);
                return { price: p + "%", revenue: Number(nr.toFixed(2)) };
              })}>
                <XAxis dataKey="price" tick={{ fill: "#6B7280", fontSize: 9 }} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 9 }} />
                <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 6, fontSize: 11, color: "#F9FAFB" }} formatter={v => ["€" + v + "B"]} />
                <Line type="monotone" dataKey="revenue" stroke={SEGMENTS[baseBrand.category]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};const PerceptionPage = () => {
  const positioning = [
    { name: "Dove", x: 42, y: 62, cat: "Personal Care" },
    { name: "Axe/Lynx", x: 72, y: 56, cat: "Personal Care" },
    { name: "Dermalogica", x: 80, y: 92, cat: "Beauty & Wellbeing" },
    { name: "Nutrafol", x: 88, y: 88, cat: "Beauty & Wellbeing" },
    { name: "Liquid I.V.", x: 86, y: 78, cat: "Beauty & Wellbeing" },
    { name: "Lux", x: 50, y: 48, cat: "Beauty & Wellbeing" },
    { name: "Vaseline", x: 44, y: 35, cat: "Beauty & Wellbeing" },
    { name: "Pond's", x: 56, y: 55, cat: "Beauty & Wellbeing" },
    { name: "Pukka", x: 74, y: 82, cat: "Foods" },
    { name: "Magnum", x: 66, y: 80, cat: "Foods" },
    { name: "Maille", x: 78, y: 82, cat: "Foods" },
    { name: "Hellmann's", x: 58, y: 62, cat: "Foods" },
    { name: "Knorr", x: 42, y: 52, cat: "Foods" },
    { name: "Lipton", x: 36, y: 48, cat: "Foods" },
    { name: "Omo/Persil", x: 44, y: 56, cat: "Home Care" },
    { name: "Cif", x: 60, y: 50, cat: "Home Care" },
    { name: "Surf Excel", x: 48, y: 40, cat: "Home Care" },
    { name: "Rexona", x: 62, y: 50, cat: "Personal Care" },
    { name: "Lifebuoy", x: 32, y: 42, cat: "Personal Care" },
    { name: "P&G", x: 72, y: 76, isCompetitor: true },
    { name: "L'Oréal", x: 84, y: 82, isCompetitor: true },
    { name: "Colgate", x: 54, y: 58, isCompetitor: true },
  ];

  const equityScores = [
    { brand: "Dove", trust: 92, value: 78, heritage: 88, innovation: 64 },
    { brand: "Knorr", trust: 88, value: 85, heritage: 96, innovation: 46 },
    { brand: "Magnum", trust: 84, value: 62, heritage: 70, innovation: 82 },
    { brand: "P&G (Benchmark)", trust: 90, value: 80, heritage: 92, innovation: 88 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle sub="Interactive psychological quadrant & brand equity diagnostics">Perception Map</SectionTitle>
      
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* INTERACTIVE POSITIONING SCATTER CHARTS */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Consumer Perception Coordinates</div>
          <div style={{ position: "relative", height: 440, background: "rgba(255,255,255,0.01)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="x" type="number" domain={[0, 100]} name="Brand Positioning" tick={{ fill: "#6B7280", fontSize: 10 }} label={{ value: "◀ Traditional  |  Modern & Innovative ▶", position: "bottom", fill: "#6B7280", fontSize: 11 }} />
                <YAxis dataKey="y" type="number" domain={[0, 100]} name="Perceived Quality" tick={{ fill: "#6B7280", fontSize: 10 }} label={{ value: "◀ Value & Mass  |  Premium & Prestige ▶", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 11 }} />
                <Tooltip 
                  cursor={{ strokeDasharray: "3 3", stroke: "#4B5563" }} 
                  contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} 
                />
                {Object.entries(SEGMENTS).map(([cat, color]) => (
                  <Scatter key={cat} name={cat} data={positioning.filter(d => d.cat === cat && !d.isCompetitor)} fill={color} shape="square" />
                ))}
                <Scatter name="Competitors" data={positioning.filter(d => d.isCompetitor)} fill="#9CA3AF" shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {Object.entries(SEGMENTS).map(([seg, color]) => (
              <div key={seg} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, background: color, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{seg}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#9CA3AF" }} />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Competitors</span>
            </div>
          </div>
        </div>

        {/* EQUITY SCORECARD */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>Equity Scorecard Detail</div>
          {equityScores.map((eq, i) => (
             <motion.div key={eq.brand} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: eq.brand.includes("P&G") ? "#9CA3AF" : "#F9FAFB", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 6, marginBottom: 12 }}>{eq.brand}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase" }}>Trust</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>{eq.trust}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase" }}>Heritage</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#818CF8", fontFamily: "'IBM Plex Mono', monospace" }}>{eq.heritage}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase" }}>Value</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{eq.value}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase" }}>Innovation</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#F472B6", fontFamily: "'IBM Plex Mono', monospace" }}>{eq.innovation}</div>
                  </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};const CountryPage = () => {
  const [selected, setSelected] = useState(0);
  const country = COUNTRIES[selected];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <SectionTitle sub="Deep-dive market intelligence for 10 priority geographies">Country Analytics</SectionTitle>
      
      {/* Premium Map Visualization */}
      <div style={{ marginBottom: 32 }}>
        <MapModule countries={COUNTRIES} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {COUNTRIES.map((c, i) => (
          <button key={c.name} onClick={() => setSelected(i)}
            style={{ background: selected === i ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${selected === i ? "#3B82F6" : "rgba(255,255,255,0.1)"}`, color: selected === i ? "#60A5FA" : "#9CA3AF", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: selected === i ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
            {c.flag} {c.name}
          </button>
        ))}
      </div>
      <motion.div 
        key={selected}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
      >
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{country.flag} <span style={{ fontWeight: 700, fontSize: 18, color: "#F9FAFB" }}>{country.name}</span></div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>GDP: ${country.gdp}T</div>
          {[["Market Penetration", country.penetration, "#3B82F6"], ["Premium Readiness", country.premium, "#8B5CF6"], ["Digital Commerce", country.digital, "#06B6D4"], ["Sustainability Index", country.sustainability, "#10B981"], ["Brand Loyalty", country.loyalty, "#FBBF24"], ["Growth Potential", country.growth, "#F472B6"]].map(([k, v, c]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{k}</span>
                <span style={{ fontSize: 12, color: c, fontWeight: 700 }}>{v}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ background: c, height: "100%", borderRadius: 4, boxShadow: `0 0 10px ${c}40` }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 24 }}>
          {[["🎯 Strategic Opportunity", country.opportunity, "#34D399"], ["⚠️ Key Threat", country.threat, "#F87171"], ["🏮 Cultural Code", country.culture, "#FBBF24"], ["🧠 Consumer Psychology", country.psychology, "#818CF8"]].map(([label, value, color]) => (
            <div key={label} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6 }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ESGPage = () => (
  <div>
    <SectionTitle sub="Progress against Unilever's 2030 Sustainability Commitments">ESG Dashboard</SectionTitle>
    <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
      {[["Net Zero Target", "2039", "#34D399"], ["Plastics Reduced", "32%", "#3B82F6"], ["Renewable Energy", "74%", "#FBBF24"], ["Sustainable Sourcing", "68%", "#8B5CF6"]].map(([k, v, c]) => (
        <StatCard key={k} label={k} value={v} color={c} />
      ))}
    </div>
    {Object.entries(ESG_DATA).map(([category, metrics]) => (
      <div key={category} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{category}</div>
        {metrics.map(m => {
          const pct = m.direction === "higher" ? Math.min((m.current / m.target) * 100, 100) : Math.max(100 - (m.current / m.base) * 100, 0);
          return (
            <div key={m.kpi} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#D1D5DB" }}>{m.kpi}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Target: {m.target}{m.unit}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>{m.current.toLocaleString()}{m.unit}</span>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 8 }}>
                <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #34D399, #3B82F6)", height: "100%", borderRadius: 6 }} />
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 3 }}>{pct.toFixed(0)}% toward target</div>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);const PersonaPage = () => {
  const personaData = [
    ["18-35","Self-expression","Authenticity","Ingredient skepticism"],
    ["28-50","Cleanliness","Family care","Private label"],
    ["22-38","Glamour","Aspiration","Aging perception"],
    ["20-40","Hair health","Confidence","Premium gap"],
    ["30-55","Cooking joy","Family bond","Clean label trend"],
    ["25-45","Taste pleasure","Nostalgia","Health shift"],
    ["35-60","Wellness ritual","Comfort","Energy drink shift"],
    ["18-40","Active performance","Confidence","Natural trend"],
    ["22-38","Style authority","Salon quality","Mid-tier squeeze"],
    ["16-30","Identity & cool","Belonging","Old perception"],
    ["25-55","Skin healing","Trust & care","Petroleum backlash"],
    ["20-45","Skin brightening","Beauty ideal","K-beauty disruption"],
    ["18-40","Sensitivity care","Gentleness","Indie clean brands"],
    ["30-55","Hair science","Evidence-based","Regulatory risk"],
    ["18-40","Family hygiene","Safety","Commoditization"],
    ["16-28","Fresh & confident","Romance","Whitening competition"],
    ["25-55","Family oral care","Dentist trust","Electric brushes"],
    ["28-50","Powerful clean","Home pride","Eco-format shift"],
    ["25-50","Germ-free home","Family protection","Green trend"],
    ["28-55","Softness & scent","Care & nurture","Format complexity"],
    ["22-50","Tough on stains","Family love","E-commerce private label"],
    ["18-45","Indulgence","Pleasure","Health trend"],
    ["22-45","Values & ethics","Activism","Corporate tension"],
    ["30-60","Gourmet taste","Heritage","Geographic limits"],
    ["28-55","Wellness ritual","Holistic health","Category crowding"],
    ["35-65","Traditional comfort","Heritage","Youth relevance"],
    ["25-45","Nutrition & energy","Health growth","Malt perception"],
    ["18-40","Performance sport","Active identity","Natural competition"],
    ["30-55","Clinical results","Expert trust","Exclusivity risk"],
    ["20-40","Hydration & energy","Active lifestyle","Startup competition"],
  ];

  return (
    <div>
      <SectionTitle sub="Buyer persona atlas — demographics, psychographics and emotional connection across 30 brands">Persona Atlas</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Brand", "Segment", "Age Range", "NPS", "Primary Driver", "Emotional Bond", "Key Risk", "CLV €"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#6B7280", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((b, i) => {
              const p = personaData[i] || ["25-45","Quality","Trust","Competition"];
              return (
                <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#F9FAFB" }}>{b.name}</td>
                  <td style={{ padding: "12px 14px" }}><Badge text={b.category} color={SEGMENTS[b.category]} /></td>
                  <td style={{ padding: "12px 14px", color: "#9CA3AF", fontFamily: "'IBM Plex Mono', monospace" }}>{p[0]}</td>
                  <td style={{ padding: "12px 14px", color: b.nps > 70 ? "#34D399" : b.nps > 55 ? "#FBBF24" : "#F87171", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{b.nps}</td>
                  <td style={{ padding: "12px 14px", color: "#D1D5DB" }}>{p[1]}</td>
                  <td style={{ padding: "12px 14px", color: "#9CA3AF" }}>{p[2]}</td>
                  <td style={{ padding: "12px 14px", color: "#F87171", fontSize: 11 }}>{p[3]}</td>
                  <td style={{ padding: "12px 14px", color: "#FBBF24", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{b.clv}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// ─── ANALYTICS ENGINE (Rule-based, data-driven) ───────────────────────────────

// ─── AI ANALYST PAGE (Rule-based, 4 Modules) ─────────────────────────────────const AIAnalystPage = () => {
  const [activeTab, setActiveTab] = useState("insights");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [selectedQA, setSelectedQA] = useState(null);
  const [filterTopic, setFilterTopic] = useState("all");

  const queries = generateQueries(BRANDS);
  const recommendations = generateRecommendations(BRANDS);
  const brainInsights = generateBrainInsights(BRANDS);

  const levelColors = { Critical: "#F87171", Warning: "#FBBF24", Opportunity: "#34D399" };
  const statusColors = { critical: "#F87171", opportunity: "#34D399", defense: "#FBBF24" };
  const statusLabels = { critical: "Emergency Action", opportunity: "Growth Opportunity", defense: "Defensive Play" };
  const signalColors = { positive: "#34D399", negative: "#F87171", warning: "#FBBF24", neutral: "#60A5FA" };
  const topicColors = { Growth: "#34D399", Funnel: "#FBBF24", Investment: "#F87171", Profitability: "#10B981", Loyalty: "#818CF8", Portfolio: "#3B82F6", Geography: "#06B6D4" };

  const filteredQueries = queries.filter(q =>
    (filterLevel === "all" || q.level === filterLevel) &&
    (filterCat === "all" || q.category === filterCat)
  );

  const uniqueCategories = [...new Set(queries.map(q => q.category))];
  const uniqueTopics = [...new Set(QA_QUESTIONS.map(q => q.topic))];
  const filteredQA = QA_QUESTIONS.filter(q => filterTopic === "all" || q.topic === filterTopic);

  return (
    <div>
      <SectionTitle sub="Rule-based query engine · Action plan system · Portfolio insight analysis">
        Analytics Engine
      </SectionTitle>

      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Critical Signals" value={queries.filter(q=>q.level==="Critical").length} sub="Immediate action" color="#F87171" />
        <StatCard label="Warnings" value={queries.filter(q=>q.level==="Warning").length} sub="Within 30 days" color="#FBBF24" />
        <StatCard label="Opportunities" value={queries.filter(q=>q.level==="Opportunity").length} sub="Growth signals" color="#34D399" />
        <StatCard label="Action Plans" value={recommendations.length} sub="Strategic playbooks" color="#818CF8" />
        <StatCard label="Portfolio Health" value={`${brainInsights.portfolio.avgUSG.toFixed(1)}%`} sub="Avg USG" color="#60A5FA" />
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 5, width: "fit-content" }}>
        {[["insights","📊 Portfolio Insights","#60A5FA"],["query","🔍 Smart Query","#FBBF24"],["recs","💡 Action Plans","#818CF8"],["qa","❓ Q&A","#34D399"]].map(([id, label, color]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: activeTab === id ? `${color}22` : "transparent", color: activeTab === id ? color : "#6B7280", fontSize: 13, fontWeight: activeTab === id ? 700 : 400, cursor: "pointer", borderBottom: activeTab === id ? `2px solid ${color}` : "2px solid transparent", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PORTFOLIO INSIGHTS MODULE ─────────────────────────────────────── */}
      {activeTab === "insights" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              ["Total Revenue", `€${brainInsights.portfolio.totalRev.toFixed(1)}B`, "#34D399"],
              ["Avg NPS", brainInsights.portfolio.avgNPS.toFixed(0), "#818CF8"],
              ["Avg Margin", `${brainInsights.portfolio.avgMargin.toFixed(1)}%`, "#FBBF24"],
              ["Star Brands", `${brainInsights.portfolio.starCount}/30`, "#60A5FA"],
            ].map(([l,v,c]) => (
              <div key={l} style={{ background: `${c}0f`, border: `1px solid ${c}30`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {brainInsights.keyFindings.map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${signalColors[f.signal]}25`, borderLeft: `4px solid ${signalColors[f.signal]}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>{f.title}</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: signalColors[f.signal], background: `${signalColors[f.signal]}18`, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{f.signal.toUpperCase()}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#C9D1D9", lineHeight: 1.7 }}>{f.finding}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.07em" }}>Category Performance Comparison</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Category", "Brands", "Total Revenue", "Avg USG", "Avg NPS", "Avg Margin", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 14px", color: "#6B7280", fontSize: 11, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(brainInsights.categoryPerf).map(([cat, data]) => {
                    const avgUSG = data.usg / data.count;
                    const avgNPS = data.nps / data.count;
                    const perf = avgUSG > 5 ? { label: "Strong", color: "#34D399" } : avgUSG > 2 ? { label: "Moderate", color: "#FBBF24" } : { label: "Weak", color: "#F87171" };
                    return (
                      <tr key={cat} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 14px" }}><Badge text={cat} color={SEGMENTS[cat]} /></td>
                        <td style={{ padding: "12px 14px", color: "#9CA3AF", fontFamily: "'IBM Plex Mono', monospace" }}>{data.count}</td>
                        <td style={{ padding: "12px 14px", color: "#34D399", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>€{data.rev.toFixed(1)}B</td>
                        <td style={{ padding: "12px 14px", color: avgUSG > 0 ? "#34D399" : "#F87171", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{avgUSG.toFixed(1)}%</td>
                        <td style={{ padding: "12px 14px", color: "#818CF8", fontFamily: "'IBM Plex Mono', monospace" }}>{avgNPS.toFixed(0)}</td>
                        <td style={{ padding: "12px 14px", color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{(BRANDS.filter(b=>b.category===cat).reduce((s,b)=>s+b.margin,0)/data.count).toFixed(1)}%</td>
                        <td style={{ padding: "12px 14px" }}><Badge text={perf.label} color={perf.color} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34D399", marginBottom: 14 }}>🏆 Top CLV Brands</div>
              {brainInsights.topCLV.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: i===0?"#FBBF24":i===1?"#9CA3AF":"#92400E", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 11, fontWeight: 800, color: "#0D1117", flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{b.category}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>€{b.clv}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F87171", marginBottom: 14 }}>⚡ Lowest USG Brands</div>
              {brainInsights.bottomUSG.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 11, fontWeight: 800, color: "#F87171", flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{b.category} · {b.bcg}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: b.usg < 0 ? "#F87171" : "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{b.usg > 0 ? "+" : ""}{b.usg}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SMART QUERY MODULE ─────────────────────────────────────────────── */}
      {activeTab === "query" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Level:</span>
            {["all", "Critical", "Warning", "Opportunity"].map(l => (
              <button key={l} onClick={() => setFilterLevel(l)}
                style={{ padding: "4px 14px", borderRadius: 6, border: `1px solid ${filterLevel===l ? (levelColors[l]||"#60A5FA") : "rgba(255,255,255,0.1)"}`, background: filterLevel===l ? `${(levelColors[l]||"#60A5FA")}18` : "transparent", color: filterLevel===l ? (levelColors[l]||"#60A5FA") : "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: filterLevel===l ? 700 : 400 }}>
                {l === "all" ? "All" : l}
              </button>
            ))}
            <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>Topic:</span>
            {["all", ...uniqueCategories].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: "4px 14px", borderRadius: 6, border: `1px solid ${filterCat===c ? "#60A5FA" : "rgba(255,255,255,0.1)"}`, background: filterCat===c ? "rgba(96,165,250,0.15)" : "transparent", color: filterCat===c ? "#60A5FA" : "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: filterCat===c ? 700 : 400 }}>
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: selectedQuery !== null ? "1fr 1fr" : "1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredQueries.map((q, i) => {
                const color = levelColors[q.level];
                const isSelected = selectedQuery === i;
                return (
                  <div key={q.id} onClick={() => setSelectedQuery(isSelected ? null : i)}
                    style={{ background: isSelected ? `${color}0f` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? color+"55" : "rgba(255,255,255,0.07)"}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <Badge text={q.level} color={color} />
                        <Badge text={q.category} color="#60A5FA" />
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>{q.brand}</span>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color, background: `${color}15`, padding: "2px 8px", borderRadius: 5, flexShrink: 0 }}>{q.metric}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#C9D1D9", lineHeight: 1.6 }}>{q.question}</p>
                    {isSelected && <div style={{ marginTop: 4, fontSize: 11, color: "#60A5FA" }}>← See details on the right</div>}
                  </div>
                );
              })}
              {filteredQueries.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#4B5563", fontSize: 13 }}>No queries match the selected filters.</div>
              )}
            </div>

            {selectedQuery !== null && filteredQueries[selectedQuery] && (() => {
              const q = filteredQueries[selectedQuery];
              const color = levelColors[q.level];
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: 14, padding: 24, position: "sticky", top: 0, alignSelf: "start" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <Badge text={q.level} color={color} />
                    <Badge text={q.category} color="#60A5FA" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", marginBottom: 6 }}>{q.brand}</div>
                  <div style={{ fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", color, marginBottom: 20 }}>{q.metric}</div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Diagnostic</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#C9D1D9", lineHeight: 1.7, background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: 8, borderLeft: `3px solid ${color}` }}>{q.diagnostic}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Investigation Questions</div>
                    {q.probe.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: "10px 14px", background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 8 }}>
                        <span style={{ fontSize: 14, color, flexShrink: 0 }}>?</span>
                        <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── ACTION PLANS MODULE ────────────────────────────────────────────── */}
      {activeTab === "recs" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: selectedRec !== null ? "1fr 1fr" : "1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["critical","opportunity","defense"].map(status => {
                const group = recommendations.filter(r => r.status === status);
                if (group.length === 0) return null;
                const color = statusColors[status];
                return (
                  <div key={status}>
                    <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 4 }}>
                      {status === "critical" ? "🔴" : status === "opportunity" ? "🟢" : "🟡"} {statusLabels[status]} ({group.length})
                    </div>
                    {group.map((rec, i) => {
                      const globalIdx = recommendations.indexOf(rec);
                      const isSelected = selectedRec === globalIdx;
                      return (
                        <div key={i} onClick={() => setSelectedRec(isSelected ? null : globalIdx)}
                          style={{ background: isSelected ? `${color}0f` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? color+"55" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "16px 20px", cursor: "pointer", marginBottom: 10, transition: "all 0.15s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB" }}>{rec.brand}</span>
                              <Badge text={rec.category} color={SEGMENTS[rec.category]} />
                              <Badge text={rec.bcg} color="#818CF8" />
                            </div>
                            <span style={{ fontSize: 11, color, background: `${color}15`, padding: "2px 8px", borderRadius: 5, fontWeight: 700 }}>{rec.horizon}</span>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {rec.actions.map((a, j) => (
                              <span key={j} style={{ fontSize: 10, color: "#60A5FA", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>{a.type}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {selectedRec !== null && recommendations[selectedRec] && (() => {
              const rec = recommendations[selectedRec];
              const color = statusColors[rec.status];
              const priorityColors = { P1: "#F87171", P2: "#FBBF24", P3: "#34D399" };
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: 14, padding: 24, alignSelf: "start", position: "sticky", top: 0 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <Badge text={statusLabels[rec.status]} color={color} />
                    <Badge text={rec.horizon} color="#60A5FA" />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginBottom: 4 }}>{rec.brand}</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                    <Badge text={rec.category} color={SEGMENTS[rec.category]} />
                    <Badge text={rec.bcg} color="#818CF8" />
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Action Plan</div>
                  {rec.actions.map((action, i) => (
                    <div key={i} style={{ marginBottom: 14, padding: "14px 16px", background: `${priorityColors[action.priority]}08`, border: `1px solid ${priorityColors[action.priority]}25`, borderRadius: 10 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: priorityColors[action.priority], background: `${priorityColors[action.priority]}20`, padding: "2px 8px", borderRadius: 4 }}>{action.priority}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA" }}>{action.type}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "#D1D5DB", lineHeight: 1.6 }}>{action.text}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
                    ⏱ Recommendation time horizon: <span style={{ color: "#60A5FA", fontWeight: 600 }}>{rec.horizon}</span> · Rule-based brand data analysis
                  </div>
                  <button 
                    onClick={() => {
                        if(window.__filesModuleUpload) {
                          window.__filesModuleUpload({
                             id: Date.now(),
                             name: `${rec.brand.replace(/\s+/g,'_')}_ActionPlan_${rec.horizon.replace(/\s+/g,'')}.json`,
                             type: "report",
                             source: "ai",
                             brand: rec.brand,
                             dept: "Insights",
                             title: `${rec.brand} AI Action Plan`,
                             ext: "json",
                             status: "Draft",
                             date: new Date().toLocaleDateString("tr-TR"),
                             desc: `AI-generated diagnostic plan (Status: ${rec.status}, Horizon: ${rec.horizon}).`,
                             tags: ["#ai-generated", `#${rec.status}`],
                             content: { brand: rec.brand, status: rec.status, horizon: rec.horizon, actions: rec.actions },
                             url: "" 
                          });
                          alert(`AI Plan saved to ${rec.brand} Portfolio as Evidence! Check the bottom of the Brand Portfolio page.`);
                        }
                    }}
                    style={{ marginTop: 16, width: "100%", padding: "12px", background: "rgba(129, 140, 248, 0.1)", border: "1px solid rgba(129, 140, 248, 0.3)", borderRadius: 10, color: "#818CF8", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(129, 140, 248, 0.2)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(129, 140, 248, 0.1)"}
                  >
                    💾 Save as Portfolio Evidence Document
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Q&A MODULE ─────────────────────────────────────────────────────── */}
      {activeTab === "qa" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Topic:</span>
            {["all", ...uniqueTopics].map(t => {
              const tc = topicColors[t] || "#60A5FA";
              return (
                <button key={t} onClick={() => setFilterTopic(t)}
                  style={{ padding: "4px 14px", borderRadius: 6, border: `1px solid ${filterTopic===t ? tc : "rgba(255,255,255,0.1)"}`, background: filterTopic===t ? `${tc}18` : "transparent", color: filterTopic===t ? tc : "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: filterTopic===t ? 700 : 400 }}>
                  {t === "all" ? "All Topics" : t}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: selectedQA !== null ? "5fr 6fr" : "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{filteredQA.length} Questions Available</div>
              {filteredQA.map((q) => {
                const isSelected = selectedQA === q.id;
                const topicColor = topicColors[q.topic] || "#60A5FA";
                return (
                  <div key={q.id} onClick={() => setSelectedQA(isSelected ? null : q.id)}
                    style={{ background: isSelected ? `${topicColor}0f` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? topicColor+"44" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <Badge text={q.topic} color={topicColor} />
                      {isSelected && <span style={{ fontSize: 10, color: topicColor, marginLeft: "auto" }}>▶ Active</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 600, lineHeight: 1.5 }}>{q.question}</div>
                    <div style={{ fontSize: 10, color: "#4B5563", marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{q.rule}</div>
                  </div>
                );
              })}
            </div>

            {selectedQA ? (() => {
              const qDef = QA_QUESTIONS.find(q => q.id === selectedQA);
              if (!qDef) return null;
              const answer = qDef.answer(BRANDS);
              const topicColor = topicColors[qDef.topic] || "#60A5FA";
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${topicColor}33`, borderRadius: 14, padding: 24, alignSelf: "start", position: "sticky", top: 0 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <Badge text={qDef.topic} color={topicColor} />
                    <span style={{ fontSize: 10, color: "#4B5563", alignSelf: "center", fontFamily: "'IBM Plex Mono', monospace" }}>Rule-based analysis</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#F9FAFB", fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{qDef.question}</div>
                  <div style={{ fontSize: 10, color: "#4B5563", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 20, padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>{qDef.rule}</div>

                  <div style={{ padding: "12px 16px", background: `${topicColor}0d`, border: `1px solid ${topicColor}30`, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: topicColor, fontWeight: 700, marginBottom: 4 }}>ANALYSIS RESULT</div>
                    <div style={{ fontSize: 14, color: "#F9FAFB", fontWeight: 600 }}>{answer.headline}</div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Data Breakdown</div>
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "14px 16px" }}>
                      {answer.body.split("\n").map((line, i) => (
                        <div key={i} style={{ fontSize: 12, color: line.startsWith("•") || /^\d+\./.test(line) ? "#D1D5DB" : "#9CA3AF", lineHeight: 1.7 }}>{line || "\u00a0"}</div>
                      ))}
                    </div>
                  </div>

                  {answer.dataPoints && answer.dataPoints.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Quick Metrics</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {answer.dataPoints.slice(0,5).map((dp, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 100 }}>{dp.label}</span>
                            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 3, height: 5 }}>
                              <div style={{ width: `${Math.min(Math.abs(dp.value) * 1.2, 100)}%`, background: dp.color, height: "100%", borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 11, color: dp.color, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, minWidth: 36, textAlign: "right" }}>{dp.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Follow-up Questions</div>
                    {answer.followUp.map((fq, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, padding: "8px 12px", background: `${topicColor}08`, border: `1px solid ${topicColor}20`, borderRadius: 8 }}>
                        <span style={{ fontSize: 12, color: topicColor, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 12, color: "#C9D1D9" }}>{fq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })() : (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 14, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12 }}>
                <div style={{ fontSize: 36 }}>❓</div>
                <div style={{ fontSize: 14, color: "#4B5563", fontWeight: 600 }}>Select a question</div>
                <div style={{ fontSize: 12, color: "#374151" }}>Click any question card on the left to get a rule-based answer derived from the 30-brand portfolio dataset</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("overview");
  const [selectedBrand, setSelectedBrand] = useState(1);
  const [simEnabled, setSimEnabled] = useState(false);
  const [simState, setSimState] = useState(null); // { brandId, data }
  const [userRole, setUserRole] = useState("brandManager");
  const [uploads, setUploads] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSegment, setGlobalSegment] = useState("All");

  const handleUpload = (file) => setUploads(prev => [...prev, file]);
  const handleDeleteUpload = (id) => setUploads(prev => prev.filter(f => f.id !== id));

  const ROLES = {
    cfo:          { label: "CFO / C-Level",       icon: "👔", color: "#FBBF24", defaultPage: "financials" },
    brandManager: { label: "Brand Manager",        icon: "📈", color: "#3B82F6", defaultPage: "portfolio" },
    strategist:   { label: "Strategy Director",   icon: "🌍", color: "#34D399", defaultPage: "overview" },
    esg:          { label: "ESG Officer",          icon: "🌱", color: "#10B981", defaultPage: "esg" },
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
    setPage(ROLES[role].defaultPage);
  };

  // ── FILTERING LOGIC ──
  const effectiveBrands = useMemo(() => {
    let bs = simEnabled && simState
      ? BRANDS.map(b => b.id === simState.brandId ? simState.data : b)
      : BRANDS;
      
    if (globalSegment !== "All") {
       bs = bs.filter(b => b.category === globalSegment || b.segment === globalSegment);
    }
    
    if (globalSearch) {
       const term = globalSearch.toLowerCase();
       bs = bs.filter(b => b.name.toLowerCase().includes(term) || b.category.toLowerCase().includes(term));
    }
    return bs;
  }, [simEnabled, simState, globalSegment, globalSearch]);

  const navItems = [
    { id: "overview",    label: "Overview",           icon: "◈", roles: ["cfo","brandManager","strategist","esg"] },
    { id: "portfolio",   label: "Brand Portfolio",    icon: "◉", roles: ["brandManager","strategist"] },
    { id: "financials",  label: "Financials",         icon: "◆", roles: ["cfo","strategist"] },
    { id: "bcg",         label: "BCG Matrix",         icon: "◎", roles: ["cfo","strategist"] },
    { id: "competition", label: "Competition",        icon: "◇", roles: ["strategist","cfo"] },
    { id: "funnel",      label: "Brand Funnel",       icon: "▽", roles: ["brandManager","strategist"] },
    { id: "simulation",  label: "Simulation Studio",  icon: "⚡", roles: ["brandManager","cfo","strategist"] },
    { id: "perception",  label: "Perception Map",     icon: "⊙", roles: ["brandManager","strategist"] },
    { id: "country",     label: "Country Analytics",  icon: "⊞", roles: ["strategist","esg"] },
    { id: "esg",         label: "ESG",                icon: "◈", roles: ["esg","cfo","strategist"] },
    { id: "persona",     label: "Persona Atlas",      icon: "◉", roles: ["brandManager","strategist"] },
    { id: "ai",          label: "AI Analyst",         icon: "⊛", roles: ["cfo","brandManager","strategist","esg"] },
    { id: "files",       label: "Files",              icon: "◧", roles: ["cfo","brandManager","strategist","esg"] },
  ];
  const visibleNav = navItems.filter(item => item.roles.includes(userRole));

  // Bridge: expose handleUpload globally so FilesModule can trigger it
  useEffect(() => { window.__filesModuleUpload = handleUpload; return () => { delete window.__filesModuleUpload; }; }, []);

  const renderPage = () => {
    switch(page) {
      case "overview": return <OverviewPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} uploads={uploads} onUpload={handleUpload} onDeleteUpload={handleDeleteUpload} />;
      case "portfolio": return <BrandPortfolioPage selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} effectiveBrands={effectiveBrands} uploads={uploads} onDeleteUpload={handleDeleteUpload} />;
      case "financials": return <FinancialsPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} />;
      case "bcg": return <BCGPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} />;
      case "competition": return <CompetitionPage />;
      case "funnel": return <FunnelPage selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />;
      case "simulation": return <SimulationStudio selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} simState={simState} setSimState={setSimState} simEnabled={simEnabled} setSimEnabled={setSimEnabled} />;
      case "perception": return <PerceptionPage />;
      case "country": return <CountryPage />;
      case "esg": return <ESGPage />;
      case "persona": return <PersonaPage />;
      case "ai": return <AIAnalystPage />;
      case "files": return <FilesModule uploads={uploads} onDeleteUpload={handleDeleteUpload} />;
      default: return <OverviewPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D1117", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: "#F9FAFB" }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#13161C", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Unilever</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.3 }}>30 Power Brands</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Strategy Platform v9.0</div>
          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(SEGMENTS).map(([, c]) => <div key={c} style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />)}
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {visibleNav.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 20px", background: page === item.id ? (item.id === "simulation" ? "rgba(124,58,237,0.2)" : "rgba(59,130,246,0.15)") : "transparent", border: "none", borderLeft: page === item.id ? `3px solid ${item.id === "simulation" ? "#7C3AED" : "#3B82F6"}` : "3px solid transparent", color: page === item.id ? (item.id === "simulation" ? "#A78BFA" : "#60A5FA") : "#6B7280", fontSize: 12, fontWeight: page === item.id ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{item.icon}</span>
              {item.label}
              {item.id === "simulation" && simEnabled && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#FBBF24", flexShrink: 0 }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* ROLE SELECTOR */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Active Role</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.entries(ROLES).map(([key, r]) => (
                <button key={key} onClick={() => handleRoleChange(key)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, border: `1px solid ${userRole === key ? r.color + "55" : "rgba(255,255,255,0.06)"}`, background: userRole === key ? r.color + "18" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 12 }}>{r.icon}</span>
                  <span style={{ fontSize: 11, color: userRole === key ? r.color : "#6B7280", fontWeight: userRole === key ? 700 : 400 }}>{r.label}</span>
                  {userRole === key && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: r.color, flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>BUILT BY</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#60A5FA" }}>Furkan</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>Brand & AI Strategy</div>
          </div>
          <div style={{ fontSize: 10, color: "#374151" }}>React · Recharts · IBM Plex</div>
          <div style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>Apr 2026 · v9.0</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* SIMULATION BANNER */}
        {simEnabled && simState && (
          <div style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(29,78,216,0.2))", borderBottom: "1px solid rgba(124,58,237,0.3)", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 700 }}>⚡ SIMULATION ACTIVE</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                {BRANDS.find(b => b.id === simState.brandId)?.name} data is simulated — all pages reflect your scenario
              </span>
            </div>
            <button onClick={() => { setSimEnabled(false); setSimState(null); }}
              style={{ fontSize: 11, color: "#F87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
              × Reset to Actuals
            </button>
          </div>
        )}
        {/* GLOBAL HEADER & FILTER BAR */}
        <div style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
             <div style={{ position: "relative" }}>
               <SearchIcon size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
               <input 
                 type="text" 
                 placeholder="Search brands, tags..." 
                 value={globalSearch}
                 onChange={(e) => setGlobalSearch(e.target.value)}
                 style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px 8px 30px", fontSize: 12, color: "#F9FAFB", width: 220, outline: "none", transition: "all 0.2s" }}
                 onFocus={(e) => e.target.style.border = "1px solid #3B82F6"}
                 onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
               />
             </div>
             <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 4 }}>
                {["All", "Personal Care", "Beauty & Wellbeing", "Home Care", "Foods"].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setGlobalSegment(cat)}
                    style={{ background: globalSegment === cat ? "rgba(255,255,255,0.1)" : "transparent", color: globalSegment === cat ? "#F9FAFB" : "#6B7280", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: globalSegment === cat ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.entries(ROLES).map(([key, r]) => (
                <button key={key} onClick={() => handleRoleChange(key)}
                  style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${userRole === key ? r.color + "55" : "rgba(255,255,255,0.08)"}`, background: userRole === key ? r.color + "18" : "transparent", color: userRole === key ? r.color : "#4B5563", fontSize: 11, fontWeight: userRole === key ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
                  {r.icon} {r.label.split(" ")[0]}
                </button>
              ))}
            </div>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
               <img src={`https://ui-avatars.com/api/?name=${ROLES[userRole].label.replace(" / ","+")}&background=0D8ABC&color=fff`} alt="user" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 32px", width: "100%" }}>
          <AnimatePresence mode="popLayout">
            <motion.div 
               key={page}
               initial={{ opacity: 0, scale: 0.98, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.98, y: -10 }}
               transition={{ duration: 0.2 }}
            >
               {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* FOOTER */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0D1117", padding: "16px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#374151" }}>© 2026 Unilever 30 Power Brands Strategy Platform</span>
              <span style={{ fontSize: 11, color: "#374151" }}>Data: Unilever FY2024 Annual Report &amp; Public Market Data</span>
              <span style={{ fontSize: 11, color: "#374151" }}>Last Updated: April 2026</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#" style={{ fontSize: 11, color: "#3B82F6", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6 }}>GitHub</a>
              <a href="#" style={{ fontSize: 11, color: "#3B82F6", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6 }}>LinkedIn</a>
              <a href="#" style={{ fontSize: 11, color: "#fff", textDecoration: "none", padding: "4px 12px", background: "#3B82F6", borderRadius: 6, fontWeight: 600 }}>Let's Work Together →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
