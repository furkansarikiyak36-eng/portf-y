import { COUNTRIES } from "../data/countries.js";

export const generateQueries = (brands) => {
  const queries = [];

  // 1. Negative USG
  const negUSG = brands.filter(b => b.usg < 0);
  negUSG.forEach(b => queries.push({
    id: `usg-neg-${b.id}`, level: "Critical", category: "Growth",
    brand: b.name, metric: `USG: ${b.usg}%`,
    question: `${b.name} organic growth turned negative (${b.usg}%). Category average is ${(brands.filter(x=>x.category===b.category).reduce((s,x)=>s+x.usg,0)/brands.filter(x=>x.category===b.category).length).toFixed(1)}%. Is this structural or temporary?`,
    diagnostic: `While other brands in ${b.category} show positive USG trends, ${b.name} is the sole negative performer. This signals in-category share loss, competitor gains, or a fundamental shift in consumer behavior.`,
    probe: ["Is there evidence of category-level share loss vs. competitor gains?", "Has price-pack architecture been reviewed recently?", "Are there distribution gaps in key markets?"]
  }));

  // 2. Low NPS brands (>15pts below category average)
  const categoryNPS = {};
  brands.forEach(b => {
    if (!categoryNPS[b.category]) categoryNPS[b.category] = [];
    categoryNPS[b.category].push(b.nps);
  });
  brands.forEach(b => {
    const catAvg = categoryNPS[b.category].reduce((s,v)=>s+v,0) / categoryNPS[b.category].length;
    if (b.nps < catAvg - 15) queries.push({
      id: `nps-low-${b.id}`, level: "Warning", category: "Consumer Experience",
      brand: b.name, metric: `NPS: ${b.nps} (avg: ${catAvg.toFixed(0)})`,
      question: `${b.name} NPS is ${(catAvg - b.nps).toFixed(0)} points below category average. Is the root cause product quality, brand perception, or pricing?`,
      diagnostic: `Category average NPS is ${catAvg.toFixed(0)} while ${b.name} sits at only ${b.nps}. This gap will accelerate customer attrition if not addressed within the next planning cycle.`,
      probe: ["Has post-purchase NPS surveying been conducted?", "Have top negative review themes been analyzed?", "Has a competitor NPS benchmark been completed?"]
    });
  });

  // 3. High awareness, low conversion (awareness-purchase gap > 50pts)
  brands.forEach(b => {
    const gap = b.awareness - b.purchase;
    if (gap > 50) queries.push({
      id: `funnel-gap-${b.id}`, level: "Warning", category: "Funnel Efficiency",
      brand: b.name, metric: `Gap: ${gap}pp (A:${b.awareness}% → P:${b.purchase}%)`,
      question: `${b.name} has a ${gap}pp awareness-to-purchase gap. Where is conversion breaking down — consideration, preference, or shelf access?`,
      diagnostic: `A large awareness pool (${b.awareness}%) isn't converting to revenue. The key breakpoint is the consideration→preference transition (${b.consideration - b.preference}pp drop), indicating brand loss at the moment of choice.`,
      probe: ["How does consideration→preference conversion compare to category average?", "Has a price-value perception study been conducted?", "Are shelf visibility and pack appeal metrics being tracked?"]
    });
  });

  // 4. High growth but low awareness (unscaled opportunity)
  brands.forEach(b => {
    if (b.usg > 10 && b.awareness < 50) queries.push({
      id: `scale-opp-${b.id}`, level: "Opportunity", category: "Scale Potential",
      brand: b.name, metric: `USG: +${b.usg}% | Awareness: ${b.awareness}%`,
      question: `${b.name} has strong growth momentum (+${b.usg}% USG) but awareness is only ${b.awareness}%. Is this a scaling opportunity or a natural niche ceiling?`,
      diagnostic: `Current growth comes from a constrained consumer base. If awareness scales from ${b.awareness}% to 70% while maintaining conversion rates, revenue could grow by approximately ${((70/b.awareness-1)*100).toFixed(0)}%.`,
      probe: ["Is the core buyer profile fully defined?", "Is there a channel model ready for awareness investment?", "Can the premium price point hold at broader audience scale?"]
    });
  });

  // 5. Margin erosion risk (low margin + high elasticity)
  brands.forEach(b => {
    if (b.margin < 25 && Math.abs(b.elasticity) > 1.3) queries.push({
      id: `margin-risk-${b.id}`, level: "Critical", category: "Profitability",
      brand: b.name, metric: `Margin: ${b.margin}% | Elast: ${b.elasticity}`,
      question: `${b.name} has a dangerous combination of low margin (${b.margin}%) and high price elasticity (${b.elasticity}). How can price defense be sustained?`,
      diagnostic: `High price elasticity means any price increase will cause significant volume loss. The ${b.margin}% margin leaves limited operational leverage for investment or defense.`,
      probe: ["Is there a COGS reduction roadmap in place?", "Can a premium sub-segment be created?", "Is innovation velocity sufficient to counter private label pressure?"]
    });
  });

  // 6. BCG mismatch (Star brand with low NPS)
  brands.forEach(b => {
    if (b.bcg === "Star" && b.nps < 55) queries.push({
      id: `bcg-nps-${b.id}`, level: "Warning", category: "Portfolio Strategy",
      brand: b.name, metric: `BCG: Star | NPS: ${b.nps}`,
      question: `${b.name} is classified as a BCG Star but has below-average NPS (${b.nps}). Is growth driven by volume or pricing power?`,
      diagnostic: `A Star brand with low NPS represents fragile growth — scaling without customer satisfaction risks loyalty erosion and long-term churn acceleration.`,
      probe: ["Has volume vs. price contribution been disaggregated?", "Is repeat purchase rate being monitored?", "Is there a loyalty mechanic in place?"]
    });
  });

  return queries.slice(0, 12); // Max 12 queries
};

export const generateRecommendations = (brands) => {
  const recs = [];

  // Critical intervention brands
  const criticalBrands = brands.filter(b => b.usg < 1 || b.nps < 50);
  criticalBrands.forEach(b => {
    const actions = [];
    if (b.usg < 0) actions.push({ type: "Pricing", text: `Rebalance price-volume equation: test ${b.elasticity > -1.2 ? "cautious" : "aggressive"} promotional mechanics across key markets`, priority: "P1" });
    if (b.nps < 50) actions.push({ type: "CX", text: `NPS rescue plan: identify top 3 complaint themes within 30 days and determine whether product fix or comms fix is needed`, priority: "P1" });
    if (b.awareness - b.purchase > 45) actions.push({ type: "Funnel", text: `Conversion audit: take awareness→purchase breakpoint into field research; launch shopper study within 60 days`, priority: "P1" });
    if (actions.length > 0) recs.push({ brand: b.name, category: b.category, bcg: b.bcg, status: "critical", horizon: "0–90 Days", actions });
  });

  // Growth opportunities
  const growthBrands = brands.filter(b => b.usg > 8 && b.margin > 35);
  growthBrands.forEach(b => {
    recs.push({
      brand: b.name, category: b.category, bcg: b.bcg, status: "opportunity", horizon: "3–12 Months",
      actions: [
        { type: "Scale", text: `Support ${b.name}'s growth momentum with geographic expansion: ${b.markets.filter(m=>m[2]==="🟢").length} green markets confirmed, increase media in ${b.markets.filter(m=>m[2]==="🟡").length} amber markets`, priority: "P2" },
        { type: "Portfolio", text: `Evaluate premium sub-segment or adjacent category launch: use CLV €${b.clv} as base to build LTV expansion model`, priority: "P2" },
        { type: "D2C", text: `High margin structure (${b.margin}%) makes this brand suitable for D2C — pilot a subscription model to increase CLV`, priority: "P3" }
      ]
    });
  });

  // Defensive Cash Cows
  const cashCows = brands.filter(b => b.bcg === "Cash Cow" && b.usg < 3);
  cashCows.forEach(b => {
    recs.push({
      brand: b.name, category: b.category, bcg: b.bcg, status: "defense", horizon: "6–18 Months",
      actions: [
        { type: "Defend", text: `Accelerate innovation roadmap to counter private label and competitor pressure: current ${b.usg}% growth is not sustainable for a Cash Cow`, priority: "P2" },
        { type: "Efficiency", text: `COGS optimization to redirect freed-up margin toward brand reinvestment (current margin: ${b.margin}%)`, priority: "P2" }
      ]
    });
  });

  return recs;
};

export const generateBrainInsights = (brands) => {
  const totalRev = brands.reduce((s,b)=>s+b.revenue,0);
  const avgUSG = brands.reduce((s,b)=>s+b.usg,0)/brands.length;
  const avgNPS = brands.reduce((s,b)=>s+b.nps,0)/brands.length;
  const avgMargin = brands.reduce((s,b)=>s+b.margin,0)/brands.length;

  const stars = brands.filter(b=>b.bcg==="Star");
  const cashCows = brands.filter(b=>b.bcg==="Cash Cow");
  const qMarks = brands.filter(b=>b.bcg==="Question Mark");

  const topUSG = [...brands].sort((a,b)=>b.usg-a.usg).slice(0,3);
  const bottomUSG = [...brands].sort((a,b)=>a.usg-b.usg).slice(0,3);
  const topCLV = [...brands].sort((a,b)=>b.clv-a.clv).slice(0,3);
  const topMargin = [...brands].sort((a,b)=>b.margin-a.margin).slice(0,3);

  const categoryPerf = {};
  brands.forEach(b=>{
    if(!categoryPerf[b.category]) categoryPerf[b.category]={rev:0,usg:0,count:0,nps:0};
    categoryPerf[b.category].rev+=b.revenue;
    categoryPerf[b.category].usg+=b.usg;
    categoryPerf[b.category].nps+=b.nps;
    categoryPerf[b.category].count++;
  });

  return {
    portfolio: { totalRev, avgUSG, avgNPS, avgMargin, starCount: stars.length, cashCowCount: cashCows.length, qMarkCount: qMarks.length },
    topUSG, bottomUSG, topCLV, topMargin,
    categoryPerf,
    keyFindings: [
      {
        icon: "🚀", title: "Growth Engines",
        finding: `Portfolio growth leaders: ${topUSG.map(b=>`${b.name} (+${b.usg}%)`).join(", ")}. These 3 brands represent ${((topUSG.reduce((s,b)=>s+b.revenue,0)/totalRev)*100).toFixed(0)}% of total portfolio revenue.`,
        signal: "positive"
      },
      {
        icon: "⚠️", title: "Growth Drags",
        finding: `${bottomUSG.map(b=>`${b.name} (${b.usg}%)`).join(", ")} are pulling down portfolio-wide growth. Immediate intervention plans required.`,
        signal: "negative"
      },
      {
        icon: "💎", title: "CLV Champions",
        finding: `Highest Customer Lifetime Value: ${topCLV.map(b=>`${b.name} (€${b.clv})`).join(", ")}. These brands should receive priority investment in premium CRM and subscription model pilots.`,
        signal: "positive"
      },
      {
        icon: "📊", title: "Margin Leaders",
        finding: `Highest margin brands: ${topMargin.map(b=>`${b.name} (${b.margin}%)`).join(", ")}. Portfolio average margin is ${avgMargin.toFixed(1)}% — these brands are driving premium mix expansion.`,
        signal: "positive"
      },
      {
        icon: "🔄", title: "Portfolio Balance",
        finding: `${stars.length} Stars, ${cashCows.length} Cash Cows, ${qMarks.length} Question Marks. ${cashCows.length > stars.length ? "Cash Cow dominance may threaten future growth investment capacity." : "Star-heavy portfolio maintains strong growth dynamics."}`,
        signal: cashCows.length > stars.length ? "warning" : "positive"
      },
      {
        icon: "🌍", title: "Category Dynamics",
        finding: (() => {
          const sorted = Object.entries(categoryPerf).sort((a,b)=>(b[1].usg/b[1].count)-(a[1].usg/a[1].count));
          return `Fastest growing category: ${sorted[0][0]} (avg ${(sorted[0][1].usg/sorted[0][1].count).toFixed(1)}% USG). Slowest: ${sorted[sorted.length-1][0]} (avg ${(sorted[sorted.length-1][1].usg/sorted[sorted.length-1][1].count).toFixed(1)}% USG).`;
        })(),
        signal: "neutral"
      }
    ]
  };
};

// ─── Q&A QUESTION BANK ────────────────────────────────────────────────────────

export const QA_QUESTIONS = [
  {
    id: "q1", topic: "Growth",
    question: "Which brands are at highest risk of market share loss?",
    rule: "Rule: USG < 2% AND NPS < 55 → High Risk",
    answer: (brands) => {
      const risk = brands.filter(b => b.usg < 2 && b.nps < 55).sort((a,b) => a.usg - b.usg);
      return {
        headline: `${risk.length} brands identified at high market share risk`,
        body: risk.length > 0
          ? risk.map(b => `• ${b.name} (USG: ${b.usg}%, NPS: ${b.nps}) — ${b.risk}`).join("\n")
          : "No brands currently at high risk based on available data.",
        dataPoints: risk.map(b => ({ label: b.name, value: b.usg < 0 ? 0 : b.usg, color: "#F87171" })),
        followUp: ["What actions are required for the top risk brand?", "Which category has the most at-risk brands?"]
      };
    }
  },
  {
    id: "q2", topic: "Funnel",
    question: "Where is the biggest funnel efficiency gap across the portfolio?",
    rule: "Rule: Max(Awareness − Purchase) across all brands",
    answer: (brands) => {
      const sorted = [...brands].sort((a,b) => (b.awareness - b.purchase) - (a.awareness - a.purchase));
      const top3 = sorted.slice(0, 3);
      return {
        headline: `${top3[0].name} has the largest awareness-to-purchase gap at ${top3[0].awareness - top3[0].purchase}pp`,
        body: top3.map(b => `• ${b.name}: ${b.awareness}% awareness → ${b.purchase}% purchase (${b.awareness - b.purchase}pp loss)\n  Action: ${b.action}`).join("\n\n"),
        dataPoints: top3.map(b => ({ label: b.name, value: b.awareness - b.purchase, color: "#FBBF24" })),
        followUp: ["What is the consideration→preference drop for the top gap brand?", "Which funnel stage shows the most consistent drop across all brands?"]
      };
    }
  },
  {
    id: "q3", topic: "Investment",
    question: "Which brands need emergency investment in the next 90 days?",
    rule: "Rule: USG < 0 OR NPS < 48 → P1 Emergency",
    answer: (brands) => {
      const emergency = brands.filter(b => b.usg < 0 || b.nps < 48);
      return {
        headline: `${emergency.length} brand${emergency.length !== 1 ? "s" : ""} require P1 emergency investment`,
        body: emergency.map(b => `• ${b.name} — ${b.usg < 0 ? `Negative growth (${b.usg}%)` : ""}${b.nps < 48 ? ` Critical NPS (${b.nps})` : ""}\n  Action: ${b.action}`).join("\n\n"),
        dataPoints: emergency.map(b => ({ label: b.name, value: b.nps, color: "#F87171" })),
        followUp: ["What is the recommended spend allocation for emergency brands?", "Which competitive moves triggered these declines?"]
      };
    }
  },
  {
    id: "q4", topic: "Profitability",
    question: "Which category has the best revenue-to-margin ratio?",
    rule: "Rule: Category with highest (Total Revenue × Avg Margin) score",
    answer: (brands) => {
      const cats = {};
      brands.forEach(b => {
        if (!cats[b.category]) cats[b.category] = { rev: 0, margin: 0, count: 0 };
        cats[b.category].rev += b.revenue;
        cats[b.category].margin += b.margin;
        cats[b.category].count++;
      });
      const scored = Object.entries(cats).map(([cat, d]) => ({
        cat, score: d.rev * (d.margin / d.count), rev: d.rev, margin: d.margin / d.count
      })).sort((a,b) => b.score - a.score);
      return {
        headline: `${scored[0].cat} leads with €${scored[0].rev.toFixed(1)}B revenue at ${scored[0].margin.toFixed(1)}% avg margin`,
        body: scored.map(s => `• ${s.cat}: €${s.rev.toFixed(1)}B revenue × ${s.margin.toFixed(1)}% margin = score ${s.score.toFixed(1)}`).join("\n"),
        dataPoints: scored.map(s => ({ label: s.cat, value: Math.round(s.margin), color: "#34D399" })),
        followUp: ["Which brands in this category are dragging down the average margin?", "How does this compare to P&G category margin structure?"]
      };
    }
  },
  {
    id: "q5", topic: "Loyalty",
    question: "Where does consumer loyalty break down the most?",
    rule: "Rule: Brands with Purchase > Loyalty + 5pp (post-purchase churn signal)",
    answer: (brands) => {
      const loyaltyGap = brands.filter(b => b.purchase > b.loyalty + 5).sort((a,b) => (b.purchase - b.loyalty) - (a.purchase - a.loyalty));
      return {
        headline: `${loyaltyGap.length} brands show post-purchase loyalty deficits`,
        body: loyaltyGap.length > 0
          ? loyaltyGap.map(b => `• ${b.name}: Purchase ${b.purchase}% → Loyalty ${b.loyalty}% (−${b.purchase - b.loyalty}pp churn signal)`).join("\n")
          : "All brands maintain healthy loyalty relative to purchase rates.",
        dataPoints: loyaltyGap.slice(0,5).map(b => ({ label: b.name, value: b.loyalty, color: "#818CF8" })),
        followUp: ["What loyalty mechanics are currently in place?", "Is there a CLV difference between loyal vs. occasional buyers?"]
      };
    }
  },
  {
    id: "q6", topic: "Growth",
    question: "Which emerging brands have the highest untapped growth potential?",
    rule: "Rule: USG > 10% AND CLV > 300 AND Awareness < 55% → High Potential",
    answer: (brands) => {
      const potential = brands.filter(b => b.usg > 10 && b.clv > 300 && b.awareness < 55).sort((a,b) => b.usg - a.usg);
      return {
        headline: `${potential.length} brands identified as high-potential scale plays`,
        body: potential.length > 0
          ? potential.map(b => `• ${b.name}: USG +${b.usg}% | CLV €${b.clv} | Awareness ${b.awareness}%\n  Scale action: ${b.action}`).join("\n\n")
          : "No brands meet all three high-potential criteria simultaneously.",
        dataPoints: potential.map(b => ({ label: b.name, value: b.usg, color: "#34D399" })),
        followUp: ["What is the cost of awareness investment for the top brand?", "Which geographic markets offer the fastest awareness scaling?"]
      };
    }
  },
  {
    id: "q7", topic: "Portfolio",
    question: "What is the overall portfolio health assessment?",
    rule: "Rule: Composite score of USG, NPS, Margin and BCG distribution",
    answer: (brands) => {
      const avgUSG = (brands.reduce((s,b) => s+b.usg,0)/brands.length).toFixed(1);
      const avgNPS = (brands.reduce((s,b) => s+b.nps,0)/brands.length).toFixed(0);
      const avgMargin = (brands.reduce((s,b) => s+b.margin,0)/brands.length).toFixed(1);
      const stars = brands.filter(b=>b.bcg==="Star").length;
      const watch = brands.filter(b=>b.status==="Watch").length;
      const health = Number(avgUSG) > 4 && Number(avgNPS) > 60 ? "Strong" : Number(avgUSG) > 2 ? "Moderate" : "At Risk";
      return {
        headline: `Portfolio health: ${health} — Avg USG ${avgUSG}%, Avg NPS ${avgNPS}`,
        body: `• Avg Organic Growth: ${avgUSG}% (target: >5%)\n• Avg NPS: ${avgNPS} (benchmark: 60+)\n• Avg Gross Margin: ${avgMargin}%\n• BCG Stars: ${stars}/30 brands\n• Watch-status brands: ${watch} requiring active monitoring`,
        dataPoints: [
          { label: "Avg USG %", value: Number(avgUSG), color: "#34D399" },
          { label: "Avg NPS", value: Number(avgNPS) / 10, color: "#818CF8" },
          { label: "Avg Margin", value: Number(avgMargin), color: "#FBBF24" }
        ],
        followUp: ["Which portfolio segment is underperforming the most?", "How does this compare to prior year portfolio health?"]
      };
    }
  },
  {
    id: "q8", topic: "Geography",
    question: "Which markets offer the highest revenue opportunity for expansion?",
    rule: "Rule: COUNTRIES sorted by Growth Potential × Digital Commerce readiness",
    answer: () => {
      const ranked = [...COUNTRIES].sort((a,b) => (b.growth * b.digital) - (a.growth * a.digital)).slice(0,5);
      return {
        headline: `${ranked[0].name} ${ranked[0].flag} leads with growth score ${ranked[0].growth} × digital index ${ranked[0].digital}`,
        body: ranked.map((c,i) => `${i+1}. ${c.flag} ${c.name}: Growth ${c.growth} | Digital ${c.digital}\n   Opportunity: ${c.opportunity}`).join("\n\n"),
        dataPoints: ranked.map(c => ({ label: c.name, value: c.growth, color: "#3B82F6" })),
        followUp: ["Which Unilever brands are currently underweight in the #1 market?", "What are the top barriers to entry in this market?"]
      };
    }
  },
];
