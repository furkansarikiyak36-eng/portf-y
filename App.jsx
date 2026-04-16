import re

def main():
    path = "d:/Download/sdsds-main(4)/sdsds-main/App.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update Tooltips for legibility
    content = content.replace('contentStyle={{', 'itemStyle={{ color: "#F9FAFB", fontWeight: 700 }} contentStyle={{')

    # 2. Rewrite PersonaPage
    new_persona = """const PersonaPage = ({ effectiveBrands = BRANDS }) => {
  const [selectedBrand, setSelectedBrand] = useState(effectiveBrands[0].id);
  const brand = effectiveBrands.find(b => b.id === selectedBrand) || effectiveBrands[0];
  
  const personaDataMap = {
    "Dove": { age: "18-35", driver: "Authenticity", bond: "Deep", risk: "Ingredient skepticism", 
             radar: [{subject: 'Trust', v: 95}, {subject: 'Innovation', v: 70}, {subject: 'Price', v: 60}, {subject: 'Efficacy', v: 85}, {subject: 'Purpose', v: 90}],
             history: [{y: 2020, event: 'Real Beauty Push'}, {y: 2022, event: 'No Digital Distortion'}, {y: 2024, event: 'AI Ethics Pledge'}] },
    "Axe/Lynx": { age: "16-30", driver: "Confidence", bond: "Aspirational", risk: "Old perception", 
             radar: [{subject: 'Trust', v: 65}, {subject: 'Innovation', v: 80}, {subject: 'Price', v: 75}, {subject: 'Efficacy', v: 70}, {subject: 'Purpose', v: 55}],
             history: [{y: 2020, event: 'Rebrand away from toxicity'}, {y: 2022, event: 'Fine fragrance launch'}, {y: 2024, event: 'Gaming collabs'}] }
  };
  
  // Generic fallback if not defined
  const defData = { 
    age: "25-45", driver: "Quality", bond: "Habitual", risk: "Commoditization",
    radar: [{subject: 'Trust', v: 80}, {subject: 'Innovation', v: 60}, {subject: 'Price', v: 65}, {subject: 'Efficacy', v: 80}, {subject: 'Purpose', v: 70}],
    history: [{y: 2021, event: 'Core strength'}, {y: 2023, event: 'Digital expansion'}, {y: 2024, event: 'Premium shift'}]
  };
  
  const pData = personaDataMap[brand.name] || defData;

  // Mock Line data for Loyalty evolution
  const loyaltyEvo = [
    { year: '2020', score: brand.nps - 15 },
    { year: '2021', score: brand.nps - 10 },
    { year: '2022', score: brand.nps - 8 },
    { year: '2023', score: brand.nps - 2 },
    { year: '2024', score: brand.nps }
  ];
  
  // Scatter positioning for personas
  const positioning = BRANDS.map((b, i) => ({
    name: b.name,
    modernity: (i * 7) % 100,
    pricePerception: (i * 13) % 100,
    cat: b.category
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <SectionTitle sub="Deep-dive demographic, psychographic and historical tracking">Persona Atlas</SectionTitle>
      
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {effectiveBrands.map(b => (
          <button key={b.id} onClick={() => setSelectedBrand(b.id)}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: selectedBrand === b.id ? 700 : 400 }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* RADAR CHART */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16 }}>UNIQUE PSYCHOGRAPHICS RADAR</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={pData.radar}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <Radar name={brand.name} dataKey="v" stroke={SEGMENTS[brand.category]} fill={SEGMENTS[brand.category]} fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* LOYALTY LINE CHART */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16 }}>NPS & LOYALTY EVOLUTION</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={loyaltyEvo}>
              <XAxis dataKey="year" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip itemStyle={{ color: "#F9FAFB", fontWeight: 700 }} contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
              <Line type="monotone" dataKey="score" stroke="#34D399" strokeWidth={3} dot={{ fill: "#34D399", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* POSITIONING SCATTER */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16 }}>DETAILED POSITIONING (MODERNITY VS PRICE)</div>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <XAxis dataKey="modernity" name="Modernity" tick={{ fill: "#6B7280", fontSize: 10 }} />
              <YAxis dataKey="pricePerception" name="Price Perception" tick={{ fill: "#6B7280", fontSize: 10 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} itemStyle={{ color: "#F9FAFB", fontWeight: 700 }} contentStyle={{ background: "#1F2937", border: "none" }} />
              <Scatter data={positioning} fill="#60A5FA" shape="circle" />
              <Scatter data={[positioning.find(p=>p.name===brand.name)]} fill={SEGMENTS[brand.category]} shape="star" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* TIMELINE HISTORY */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16 }}>BRAND PERSONA TIMELINE HISTORY</div>
          <div style={{ position: "relative", borderLeft: "2px solid rgba(59,130,246,0.3)", paddingLeft: 20, marginLeft: 10 }}>
            {pData.history.map((h, i) => (
              <div key={i} style={{ marginBottom: 20, position: "relative" }}>
                <div style={{ position: "absolute", left: -26, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#3B82F6" }} />
                <div style={{ fontSize: 12, fontWeight: 800, color: "#60A5FA", fontFamily: "'IBM Plex Mono', monospace" }}>{h.y}</div>
                <div style={{ fontSize: 14, color: "#F9FAFB", marginTop: 4 }}>{h.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
"""

    # 3. Rewrite AIAnalystPage -> GeneralAnalysisPage
    new_general_analysis = """const GeneralAnalysisPage = ({ effectiveBrands = BRANDS }) => {
  const [selectedBrand, setSelectedBrand] = useState(effectiveBrands[0].id);
  const brand = effectiveBrands.find(b => b.id === selectedBrand) || effectiveBrands[0];

  const good = [
    `Strong NPS of ${brand.nps}, establishing robust category equity and consumer trust.`,
    `Delivering ${brand.margin}% operating margin, significantly padding baseline stability.`,
    `Secured high-priority share (${brand.marketShare}%), maintaining dominance in core sub-markets.`
  ];
  
  const stagnant = [
    `Digital conversion funnels showing limited YoY elasticity despite performance marketing.`,
    `Emerging market penetration remains flat; failing to recruit Gen-Z at scale.`,
    `Price elasticity of ${brand.elasticity} reflects rigid pricing power, limiting margin expansion.`
  ];
  
  const badPast = [
    `Delayed historic entry into key D2C channels allowed disruptors to gain early ground.`,
    `Mixed messaging across the prior decade diluted the core value proposition.`,
    `Supply chain complexities heavily constrained volume growth through the 2022 headwinds.`
  ];
  
  const future = [
    `Accelerate premiumization portfolio to capture multi-tier pricing opportunities.`,
    `Execute deep cultural relevance campaigns focused firmly on elevating long-term CLV (€${brand.clv}).`,
    `Deploy targeted growth interventions to drive +20% momentum in the coming fiscal horizon.`
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <SectionTitle sub="12-Point Comprehensive Evolution & Strategic Timeline">Genel Analiz</SectionTitle>
      
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {effectiveBrands.map(b => (
          <button key={b.id} onClick={() => setSelectedBrand(b.id)}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: selectedBrand === b.id ? 700 : 400 }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#F9FAFB", marginBottom: 20 }}>Nereden Nereye: Zaman Çizelgesi (Timeline)</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { year: "2018", text: "Volatilite & Rekabet: Pazar payı dalgalanmaları" },
            { year: "2021", text: "Yeniden Yapılanma: Portföy optimizasyonu başladı" },
            { year: "2023", text: "Toparlanma: Kar marjında ilk stabilizasyon sinyalleri" },
            { year: "2024", text: `Güncel Durum: €${brand.revenue}B gelir ve %${brand.usg} USG büyümesi.` }
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 10, borderTop: `3px solid ${SEGMENTS[brand.category]}` }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: SEGMENTS[brand.category], fontFamily: "'IBM Plex Mono', monospace" }}>{item.year}</div>
              <div style={{ fontSize: 13, color: "#D1D5DB", marginTop: 8, lineHeight: 1.5 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#34D399", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>✅ İyi Yaptıkları</div>
          {good.map((txt, i) => (
            <div key={i} style={{ fontSize: 13, color: "#D1D5DB", marginBottom: 12, paddingLeft: 12, borderLeft: "2px solid #34D399", lineHeight: 1.6 }}>{txt}</div>
          ))}
        </div>

        <div style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#FBBF24", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>⏸️ Gelişim Olmayan Noktalar</div>
          {stagnant.map((txt, i) => (
            <div key={i} style={{ fontSize: 13, color: "#D1D5DB", marginBottom: 12, paddingLeft: 12, borderLeft: "2px solid #FBBF24", lineHeight: 1.6 }}>{txt}</div>
          ))}
        </div>

        <div style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#F87171", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>❌ Geçmişte Yapılan Kötü Şeyler</div>
          {badPast.map((txt, i) => (
            <div key={i} style={{ fontSize: 13, color: "#D1D5DB", marginBottom: 12, paddingLeft: 12, borderLeft: "2px solid #F87171", lineHeight: 1.6 }}>{txt}</div>
          ))}
        </div>

        <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#60A5FA", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>🎯 Planlama ve Gelecek Stratejisi</div>
          {future.map((txt, i) => (
            <div key={i} style={{ fontSize: 13, color: "#D1D5DB", marginBottom: 12, paddingLeft: 12, borderLeft: "2px solid #60A5FA", lineHeight: 1.6 }}>{txt}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
"""

    persona_pattern = re.compile(r"const PersonaPage = \(\) => \{.+?(?=(?:// ─── ANALYTICS ENGINE|const GeneralAnalysisPage =|const AIAnalystPage =))", re.DOTALL)
    content = persona_pattern.sub(new_persona, content)

    ai_pattern = re.compile(r"const AIAnalystPage = \(\) => \{.+?(?=(?:// ─── MAIN APP))", re.DOTALL)
    content = ai_pattern.sub(new_general_analysis, content)

    # 4. Rename sidebar elements
    content = content.replace('{ id: "ai",          label: "AI Analyst"', '{ id: "ai",          label: "Genel Analiz"')
    content = content.replace('case "ai": return <AIAnalystPage />;', 'case "ai": return <GeneralAnalysisPage effectiveBrands={effectiveBrands} />;')
    content = content.replace('case "persona": return <PersonaPage />;', 'case "persona": return <PersonaPage effectiveBrands={effectiveBrands} />;')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    main()


