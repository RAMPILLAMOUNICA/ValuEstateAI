import { useState } from "react"
import InputForm from "./InputForm"
import ResultsDashboard from "./ResultsDashboard"

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", position: "relative", overflowX: "hidden" }}>

      {/* Animated background orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          top: -200, left: -200, borderRadius: "50%",
          animation: "orb-move 12s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          bottom: -150, right: -100, borderRadius: "50%",
          animation: "orb-move 16s ease-in-out infinite reverse"
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300,
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          top: "40%", left: "55%", borderRadius: "50%",
          animation: "orb-move 10s ease-in-out infinite 2s"
        }} />
      </div>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,26,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff",
            fontWeight: 800, fontSize: 16, boxShadow: "0 0 20px rgba(99,102,241,0.4)"
          }}>V</div>
          <span style={{ fontWeight: 800, fontSize: 48, color: "#fff", letterSpacing: -0.3 }}>
            ValuEstate<span style={{ color: "#818cf8" }}>AI</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            fontSize: 12, background: "rgba(99,102,241,0.2)",
            color: "#a5b4fc", padding: "5px 14px",
            borderRadius: 20, fontWeight: 600,
            border: "1px solid rgba(99,102,241,0.35)"
          }}>AI Powered</div>
          {result && (
            <button className="btn-secondary" style={{ width: "auto", padding: "6px 16px", fontSize: 13 }}
              onClick={() => { setResult(null); setSubmittedData(null) }}>
              New Report
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Hero — only show when no result */}
        {!result && (
          <div style={{
            textAlign: "center", padding: "72px 20px 48px",
            animation: "fadeUp 0.7s ease forwards"
          }}>
            

            <h1 style={{
              fontSize: 52, fontWeight: 900, lineHeight: 1.1,
              letterSpacing: -2, marginBottom: 20,
              background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #818cf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Know the Worth.<br />
              <span style={{
                background: "linear-gradient(135deg, #a5b4fc, #c4b5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Predict the Risk.</span>
            </h1>

            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)",
              maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7
            }}>
              AI-powered collateral valuation engine for India's lending ecosystem.
              Get market value, distress price, and resale risk in under 2 seconds.
            </p>

            {/* Stat pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
              {[
                { label: "6 Output Metrics" },
                { label: "Risk Flag Detection" },
                { label: "Instant Analysis" },
                { label: "No Manual Inspection" }
              ].map(p => (
                <div key={p.label} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20, padding: "7px 16px",
                  fontSize: 13, color: "rgba(255,255,255,0.6)"
                }}>{p.label}</div>
              ))}
            </div>
          </div>
        )}

        {/* Form or Results */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 60px" }}>
          {!result
            ? <InputForm loading={loading} setLoading={setLoading} setResult={setResult} setSubmittedData={setSubmittedData} />
            : <ResultsDashboard result={result} submittedData={submittedData} onReset={() => { setResult(null); setSubmittedData(null) }} />
          }
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: 24,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontSize: 12, color: "rgba(255,255,255,0.2)"
      }}>
        ValuEstateAI · Built by Team Sprint · TenzorX 2026
      </div>
    </div>
  )
}