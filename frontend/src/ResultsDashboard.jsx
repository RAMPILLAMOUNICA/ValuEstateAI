import { useEffect, useState } from "react"

function AnimatedNumber({ target, prefix = "", suffix = "", duration = 1200 }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCurrent(target); clearInterval(timer) }
      else setCurrent(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{prefix}{current.toLocaleString("en-IN")}{suffix}</>
}

export default function ResultsDashboard({ result, submittedData, onReset }) {
  const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN")
  const r = result
  const [visible, setVisible] = useState(false)
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    setTimeout(() => setBarWidth(r.resale_potential_index), 400)
  }, [])

  const resaleColor = r.resale_potential_index >= 80 ? "#34d399"
    : r.resale_potential_index >= 50 ? "#fbbf24" : "#f87171"
  const resaleLabel = r.resale_potential_index >= 80 ? "Highly Liquid"
    : r.resale_potential_index >= 50 ? "Moderate Liquidity" : "Low Liquidity"

  const cardStyle = (delay) => ({
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: "20px 22px",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.5s ease ${delay}ms`
  })

  return (
    <div>

      {/* Property summary bar */}
      {submittedData && (
        <div style={{
          ...cardStyle(0),
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 14, padding: "14px 20px"
        }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {submittedData.area}, {submittedData.city}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 10 }}>
              {submittedData.property_type} · {submittedData.size_sqft} sq ft · {submittedData.age_years} yrs
            </span>
          </div>
          <div style={{
            fontSize: 11, background: "rgba(99,102,241,0.2)",
            color: "#a5b4fc", padding: "4px 12px",
            borderRadius: 20, fontWeight: 600,
            border: "1px solid rgba(99,102,241,0.3)"
          }}>Report Generated</div>
        </div>
      )}

      {/* Photo */}
      {submittedData?.photoPreview && (
        <div style={{
          ...cardStyle(50),
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 14, padding: "14px 20px"
        }}>
          <img src={submittedData.photoPreview} alt="Property"
            style={{ width: 100, height: 72, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Property Photo</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
              {submittedData.area}, {submittedData.city} · {submittedData.property_type}
            </div>
          </div>
        </div>
      )}

      {/* 4 metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {[
          { label: "Market Value", value: `${fmt(r.market_value.min)} – ${fmt(r.market_value.max)}`, color: "#a5b4fc", accent: "rgba(99,102,241,0.3)", delay: 100 },
          { label: "Distress Sale Value", value: `${fmt(r.distress_value.min)} – ${fmt(r.distress_value.max)}`, color: "#fbbf24", accent: "rgba(251,191,36,0.3)", delay: 150 },
          { label: "Time to Liquidate", value: `${r.time_to_liquidate.min_days} – ${r.time_to_liquidate.max_days} days`, color: "#34d399", accent: "rgba(52,211,153,0.3)", delay: 200 },
          { label: "Confidence Score", value: null, color: "#c4b5fd", accent: "rgba(196,181,253,0.3)", delay: 250 },
        ].map(card => (
          <div key={card.label} style={{
            ...cardStyle(card.delay),
            borderLeft: `3px solid ${card.color}`
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: card.color, textTransform: "uppercase",
              letterSpacing: 0.8, marginBottom: 10,
              background: card.accent,
              display: "inline-block", padding: "2px 8px", borderRadius: 6
            }}>{card.label}</div>
            <div style={{ fontSize: card.label === "Confidence Score" ? 28 : 16, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
              {card.label === "Confidence Score"
                ? <><AnimatedNumber target={Math.round(r.confidence_score * 100)} />%</>
                : card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Resale Index */}
      <div style={{ ...cardStyle(300), marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.8 }}>
              Resale Potential Index
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: resaleColor, marginTop: 4 }}>
              <AnimatedNumber target={r.resale_potential_index} />
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}> / 100</span>
            </div>
          </div>
          <div style={{
            background: `${resaleColor}22`,
            color: resaleColor,
            padding: "8px 18px", borderRadius: 20,
            fontSize: 13, fontWeight: 700,
            border: `1px solid ${resaleColor}44`
          }}>{resaleLabel}</div>
        </div>

        {/* Bar */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 10, overflow: "hidden" }}>
          <div style={{
            width: `${barWidth}%`,
            height: 10, borderRadius: 999,
            background: `linear-gradient(90deg, #6366f1, ${resaleColor})`,
            transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#f87171" }}>0 — Illiquid</span>
          <span style={{ fontSize: 11, color: "#fbbf24" }}>50 — Moderate</span>
          <span style={{ fontSize: 11, color: "#34d399" }}>100 — Highly Liquid</span>
        </div>
      </div>

      {/* Key Drivers */}
      <div style={{ ...cardStyle(350), marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
          Key Value Drivers
        </div>
        {Object.entries(r.key_drivers).map(([k, v]) => (
          <div key={k} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 13, color: "rgba(255,255,255,0.6)"
          }}>
            <span style={{ textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
            <span style={{
              fontWeight: 700, color: "#a5b4fc",
              background: "rgba(99,102,241,0.15)",
              padding: "2px 10px", borderRadius: 6
            }}>{String(v)}</span>
          </div>
        ))}
      </div>

      {/* Risk Flags */}
      {r.risk_flags.length > 0 ? (
        <div style={{
          ...cardStyle(400),
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.2)",
          marginBottom: 12
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
            Risk Flags Detected
          </div>
          {r.risk_flags.map((flag, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              fontSize: 13, color: "#fca5a5", marginBottom: 8
            }}>
              <span>⚠</span> {flag}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          ...cardStyle(400),
          background: "rgba(52,211,153,0.08)",
          border: "1px solid rgba(52,211,153,0.2)",
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 12, padding: "16px 20px"
        }}>
          <span style={{ fontSize: 20 }}>✓</span>
          <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>
            No risk flags detected — this property looks clean
          </span>
        </div>
      )}

      {/* Reset */}
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 500ms" }}>
        <button className="btn-secondary" onClick={onReset}>
          Valuate Another Property
        </button>
      </div>

    </div>
  )
}