export const COUNTRIES = [
  { name: "USA", flag: "🇺🇸", gdp: 27.4, penetration: 68, premium: 72, digital: 88, sustainability: 79, loyalty: 74, growth: 82, opportunity: "Health & wellness premiumization", threat: "Private label expansion in grocery", culture: "Convenience-first + health-premium split", psychology: "Status signaling through brand heritage" },
  { name: "India", flag: "🇮🇳", gdp: 3.9, penetration: 54, premium: 42, digital: 74, sustainability: 48, loyalty: 78, growth: 91, opportunity: "800M+ aspirational middle class", threat: "Ultra-local competition (Patanjali)", culture: "Family approval and trust are paramount", psychology: "Value-conscious with aspirational brand ladder" },
  { name: "Brazil", flag: "🇧🇷", gdp: 2.1, penetration: 72, premium: 58, digital: 79, sustainability: 56, loyalty: 71, growth: 68, opportunity: "Beauty passion + social media virality", threat: "FX volatility compressing margins", culture: "Beauty rituals are cultural identity", psychology: "Social proof and sensory experience drivers" },
  { name: "Germany", flag: "🇩🇪", gdp: 4.1, penetration: 61, premium: 68, digital: 72, sustainability: 91, loyalty: 82, growth: 45, opportunity: "Sustainability leadership premium", threat: "Regulatory tightening on ingredients", culture: "Sustainability certificates are mandatory", psychology: "Quality trust > brand glamour" },
  { name: "China", flag: "🇨🇳", gdp: 18.6, penetration: 58, premium: 78, digital: 94, sustainability: 62, loyalty: 58, growth: 74, opportunity: "Super-app commerce integration", threat: "Local C-beauty brands at rapid scale", culture: "Social commerce and KOL-driven discovery", psychology: "Luxury aspiration meets digital-native skepticism" },
  { name: "Turkey", flag: "🇹🇷", gdp: 1.1, penetration: 74, premium: 48, digital: 82, sustainability: 44, loyalty: 74, growth: 58, opportunity: "Young demographic + social commerce surge", threat: "Hyperinflation compressing disposable income", culture: "Family and community brand endorsement", psychology: "Heritage trust mixed with novelty seeking" },
  { name: "UK", flag: "🇬🇧", gdp: 3.1, penetration: 82, premium: 74, digital: 88, sustainability: 86, loyalty: 68, growth: 48, opportunity: "Premium sustainability tier in household & personal care", threat: "Cost-of-living crisis driving down-trading to private label", culture: "Dry wit and pragmatism — claims must be proven not asserted", psychology: "Eco-guilt is a genuine purchase driver in ABC1 demographic" },
  { name: "Nigeria", flag: "🇳🇬", gdp: 0.5, penetration: 44, premium: 28, digital: 62, sustainability: 32, loyalty: 66, growth: 94, opportunity: "Africa's largest consumer market entering middle-class growth phase", threat: "FX devaluation and import cost inflation on branded goods", culture: "Community validation and aspirational branding are purchase triggers", psychology: "Brand as social currency — visible consumption signals status" },
  { name: "Indonesia", flag: "🇮🇩", gdp: 1.4, penetration: 66, premium: 44, digital: 78, sustainability: 48, loyalty: 72, growth: 82, opportunity: "270M consumers + halal certification as premium differentiator", threat: "Local Indonesian FMCG brands rising on nationalist sentiment", culture: "Halal trust and family-first values dominate category decisions", psychology: "Community-endorsed brands outperform in trust metrics 3× global avg" },
  { name: "Mexico", flag: "🇲🇽", gdp: 1.3, penetration: 70, premium: 52, digital: 72, sustainability: 46, loyalty: 74, growth: 64, opportunity: "Near-shoring boom driving income growth in northern urban centres", threat: "Regulatory sugar/salt labelling reforms impacting food brands", culture: "Family size packs and ritual occasions anchor brand loyalty", psychology: "Brand nostalgia and family heritage are the strongest loyalty drivers" },
];

export const ESG_DATA = {
  climate: [
    { kpi: "Scope 1+2 Emissions (Mt CO₂)", target: 0, current: 1.2, base: 6.4, unit: "Mt", direction: "lower" },
    { kpi: "Renewable Energy Usage", target: 100, current: 74, base: 38, unit: "%", direction: "higher" },
  ],
  plastic: [
    { kpi: "Virgin Plastic Reduction", target: 50, current: 32, base: 0, unit: "%", direction: "higher" },
    { kpi: "Recycled Content in Packaging", target: 50, current: 28, base: 9, unit: "%", direction: "higher" },
  ],
  social: [
    { kpi: "Gender Pay Equity", target: 100, current: 98.4, base: 94, unit: "%", direction: "higher" },
    { kpi: "Smallholder Farmers Supported", target: 5000000, current: 3800000, base: 1200000, unit: "", direction: "higher" },
  ]
};
