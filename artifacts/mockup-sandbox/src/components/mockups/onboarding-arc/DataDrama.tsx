export function DataDrama() {
  const problems = [
    { label: "Steuerfallen ubersehen",   pct: "67%" },
    { label: "Fristen nicht eingehalten", pct: "54%" },
    { label: "Pauschalen vergessen",      pct: "48%" },
  ];
  return (
    <div
      className="relative overflow-hidden flex flex-col min-h-screen"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(160deg, #1A0510 0%, #2D0A1A 40%, #120616 100%)",
      }}
    >
      {/* Red ambient glow top */}
      <div style={{
        position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
        width: 340, height: 340, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(220,38,38,0.22) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Status bar */}
      <div className="flex justify-between px-6 pt-4 pb-2 relative z-10">
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600 }}>9:41</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>● ● ●</span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-3 relative z-10 flex flex-col">
        {/* Overline */}
        <div style={{ color: "rgba(239,68,68,0.75)", fontSize: 9, letterSpacing: "0.22em", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
          PROBLEM ANSPRECHEN
        </div>

        {/* DRAMATIC STAT — the axis */}
        <div style={{ marginBottom: 2 }}>
          <span
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: "#EF4444",
              lineHeight: 0.88,
              letterSpacing: "-3px",
              display: "block",
            }}
          >
            €3.200
          </span>
        </div>

        {/* Stat label */}
        <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1.35, marginBottom: 6, marginTop: 8 }}>
          zahlen Freelancer im Schnitt{" "}
          <span style={{ color: "#EF4444" }}>zu viel</span>{" "}
          — jedes Jahr.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 20 }}>
          Weil Steuerfallen, Fristen und Pauschalen ubersehen werden.
        </p>

        {/* Problem bars */}
        <div className="flex flex-col gap-3" style={{ marginBottom: 24 }}>
          {problems.map((p) => (
            <div key={p.label}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", fontWeight: 600 }}>{p.label}</span>
                <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 700 }}>{p.pct}</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: p.pct, height: "100%", borderRadius: 3, backgroundColor: "#EF4444", opacity: 0.75 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Solution teaser — green contrast */}
        <div
          style={{
            backgroundColor: "rgba(61,181,74,0.10)",
            border: "1px solid rgba(61,181,74,0.30)",
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            <span style={{ color: "#3DB54A" }}>TAXbuddy warnt dich</span>{" "}
            bevor es teuer wird — automatisch.
          </p>
        </div>

        {/* Raccoon — small, reactive in corner */}
        <div style={{ position: "absolute", bottom: 90, right: 8, width: 110, height: 130, opacity: 0.80 }}>
          <img
            src="/raccoon.png"
            alt="TAXbuddy raccoon"
            style={{ width: "100%", height: "100%", objectFit: "contain", filter: "saturate(0.7) brightness(0.85)" }}
          />
        </div>
      </div>

      {/* Dots + buttons */}
      <div className="flex flex-col gap-3 px-6 relative z-10" style={{ paddingBottom: 32 }}>
        <div className="flex justify-center gap-1.5 items-center">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: 8, borderRadius: 4,
                width: i === 2 ? 22 : 8,
                backgroundColor: i === 2 ? "#EF4444" : "rgba(255,255,255,0.20)",
              }}
            />
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <button style={{ paddingInline: 18, paddingBlock: 14, color: "rgba(255,255,255,0.38)", fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            Zuruck
          </button>
          <button
            style={{
              flex: 1, height: 52, borderRadius: 16, border: "none", cursor: "pointer",
              backgroundColor: "#0066B3", color: "#fff", fontSize: 16, fontWeight: 700,
            }}
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
