export const FINANCIALS = {
  revenue: [
    { year: "2019", total: 51.98, beauty: 10.2, personal: 13.4, home: 11.8, foods: 16.58 },
    { year: "2020", total: 50.71, beauty: 9.8, personal: 13.2, home: 12.4, foods: 15.31 },
    { year: "2021", total: 52.44, beauty: 10.6, personal: 14.1, home: 12.8, foods: 14.94 },
    { year: "2022", total: 60.07, beauty: 12.4, personal: 16.2, home: 15.1, foods: 16.37 },
    { year: "2023", total: 59.60, beauty: 13.2, personal: 17.1, home: 14.8, foods: 14.50 },
    { year: "2024", total: 60.76, beauty: 14.1, personal: 18.2, home: 14.9, foods: 13.56 },
  ],
  margins: [
    { metric: "Gross Margin", value: 42.4 }, { metric: "EBIT Margin", value: 16.8 },
    { metric: "Net Margin", value: 11.2 }, { metric: "ROIC", value: 19.4 }, { metric: "ROE", value: 38.6 },
  ],
  competitors: [
    { name: "Unilever", revenue: 60.8, ebitMargin: 16.8, rndPct: 2.1 },
    { name: "P&G", revenue: 82.0, ebitMargin: 21.4, rndPct: 2.8 },
    { name: "Nestlé", revenue: 94.4, ebitMargin: 17.2, rndPct: 1.9 },
    { name: "L'Oréal", revenue: 41.2, ebitMargin: 19.8, rndPct: 3.4 },
  ]
};

export const COMPETITOR_RADAR = [
  { axis: "Market Share", Unilever: 72, PG: 88, Nestle: 71, Henkel: 52 },
  { axis: "Brand Power", Unilever: 85, PG: 82, Nestle: 76, Henkel: 62 },
  { axis: "Innovation", Unilever: 74, PG: 86, Nestle: 78, Henkel: 68 },
  { axis: "Sustainability", Unilever: 91, PG: 74, Nestle: 68, Henkel: 72 },
  { axis: "Digital Maturity", Unilever: 78, PG: 85, Nestle: 72, Henkel: 64 },
  { axis: "Profitability", Unilever: 68, PG: 85, Nestle: 76, Henkel: 71 },
];

export const AI_ALERTS = [
  { level: "Critical", brand: "Lipton", metric: "USG %", value: -0.8, message: "Organic growth turned negative. Cold brew and functional drinks are cannibalizing core tea occasions. Immediate portfolio response needed.", action: "Launch Lipton Iced Tea Sport + Wellness sub-range within 90 days." },
  { level: "Warning", brand: "Lux", metric: "Funnel Conversion", value: "39%", message: "Consideration-to-preference conversion dropped 14 pts vs prior year. Brand aging signal among 18-34 segment detected.", action: "Accelerate Lux Modern Glamour repositioning campaign Q3." },
  { level: "Warning", brand: "TRESemmé", metric: "NPS Score", value: 44, message: "NPS 18 pts below category average. Competitive products from Pantene and Garnier outperforming on perceived innovation.", action: "Launch TRESemmé Studio Exclusives + salon partnership activations." },
  { level: "Opportunity", brand: "Hellmann's", metric: "USG %", value: 8.4, message: "Fastest organic growth in Foods segment. Plant-based mayo trial rates 3× category average. Momentum window open for 12 months.", action: "Accelerate Hellmann's Vegan range into 15 new markets." },
  { level: "Opportunity", brand: "Dove", metric: "Z-Gen Resonance", value: 68, message: "Authentic beauty index highest in category. TikTok engagement rate 2.4× vs benchmark. Viral potential untapped.", action: "Commission 200 micro-creators for Dove Real Beauty Challenge." },
  { level: "Critical", brand: "Omo/Persil", metric: "Private Label Delta", value: "-4.2%", message: "Share gap to private label narrowed by 4.2pts in 6 months across DE, FR, UK. Efficacy differentiation under pressure.", action: "Relaunch Concentrated Omo with carbon-neutral certification as premium anchor." },
];
