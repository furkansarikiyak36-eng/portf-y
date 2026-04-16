import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";

// World map TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Shared metric scales mapping to our dark theme
const SCALES = {
  growth: {
    domain: [0, 100], // Growth index
    range: ["#0f172a", "#34d399"], // Dark to Emerald
    label: "Growth Index"
  },
  digital: {
    domain: [0, 100], // Digital Index
    range: ["#0f172a", "#818cf8"], // Dark to Indigo
    label: "Digital Readiness"
  }
};

export default function MapModule({ countries, brands, activeSegment }) {
  const [metric, setMetric] = useState("growth");
  const [tooltip, setTooltip] = useState(null);
  
  // Calculate country scores specifically based on filtered brands if needed,
  // For now, using the embedded countries data which includes generic metrics.
  
  const colorScale = useMemo(() => {
    return scaleLinear()
      .domain(SCALES[metric].domain)
      .range(SCALES[metric].range);
  }, [metric]);

  // Merge the TopoJSON data with our custom `countries` dataset
  const getCountryStats = (geoName) => {
    // Basic fuzzy match for common names
    const nameMap = { "United States of America": "USA", "United Kingdom": "UK" };
    const mappedName = nameMap[geoName] || geoName;
    return countries.find(c => c.name === mappedName);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ position: "relative", width: "100%", height: "600px", background: "rgba(255,255,255,0.02)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px 0", color: "#F9FAFB" }}>Global Intelligence Map</h3>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px 0" }}>Hover to inspect country-specific opportunities and metrics.</p>
        
        <div style={{ display: "flex", gap: 8 }}>
          {["growth", "digital"].map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: metric === m ? 700 : 500,
                background: metric === m ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.05)",
                border: metric === m ? "1px solid #60A5FA" : "1px solid rgba(255,255,255,0.1)",
                color: metric === m ? "#60A5FA" : "#9CA3AF", cursor: "pointer", textTransform: "capitalize"
              }}
            >
              {m} Index
            </button>
          ))}
        </div>
      </div>

      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup center={[0, 20]} minZoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stats = getCountryStats(geo.properties.name);
                const score = stats ? stats[metric] : null;
                const fill = score ? colorScale(score) : "#1E293B"; // Default dark slate for countries with no data
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => {
                      if (stats) {
                        setTooltip({ x: e.clientX, y: e.clientY, data: stats, geoName: geo.properties.name });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (stats) {
                         setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { fill, outline: "none", stroke: "rgba(255,255,255,0.1)" },
                      hover:   { fill: stats ? "#60A5FA" : "#1E293B", outline: "none", stroke: "#FFFFFF", cursor: stats ? "pointer" : "default" },
                      pressed: { fill: stats ? "#3B82F6" : "#1E293B", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Floating Tooltip via Framer Motion */}
      <AnimatePresence>
        {tooltip && tooltip.data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: tooltip.y + 20,
              left: tooltip.x + 20,
              pointerEvents: "none",
              zIndex: 100,
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "16px",
              minWidth: "220px",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
              color: "#F9FAFB"
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{tooltip.data.flag}</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{tooltip.geoName}</span>
            </div>
            
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Growth</div>
                 <div style={{ fontSize: 14, fontWeight: 800, color: "#34D399" }}>{tooltip.data.growth}/100</div>
               </div>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Digital</div>
                 <div style={{ fontSize: 14, fontWeight: 800, color: "#818CF8" }}>{tooltip.data.digital}/100</div>
               </div>
            </div>

            <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Key Opportunity</div>
            <p style={{ margin: 0, fontSize: 12, color: "#D1D5DB", lineHeight: 1.5, background: "rgba(255,255,255,0.05)", padding: "8px 10px", borderRadius: 6 }}>
              {tooltip.data.opportunity}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
