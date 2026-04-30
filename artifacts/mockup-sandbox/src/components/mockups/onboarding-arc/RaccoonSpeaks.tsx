export function RaccoonSpeaks() {
  return (
    <div
      className="relative overflow-hidden flex flex-col min-h-screen"
      style={{ backgroundColor: "#0C1A2E", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Status bar */}
      <div className="flex justify-between px-6 pt-4 pb-1">
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}>9:41</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>● ● ●</span>
      </div>

      {/* Small wordmark top-right */}
      <div className="px-6 pt-1 pb-0 flex justify-between items-center">
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, letterSpacing: "0.18em", fontWeight: 700, textTransform: "uppercase" }}>
          1 von 6
        </span>
        <div className="flex items-baseline gap-1">
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 900, letterSpacing: -0.5 }}>TAX</span>
          <span style={{ color: "#3DB54A", fontSize: 13, fontWeight: 400, letterSpacing: -0.5 }}>buddy</span>
        </div>
      </div>

      {/* --- Center stage: raccoon + speech bubble --- */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Raccoon image — center, large */}
        <div style={{ width: 220, height: 260, position: "relative", zIndex: 2 }}>
          <img
            src="/raccoon.png"
            alt="TAXbuddy raccoon"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Speech bubble from raccoon */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "4%",
            width: 154,
            backgroundColor: "#ffffff",
            borderRadius: 16,
            borderBottomRightRadius: 4,
            padding: "12px 14px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            zIndex: 3,
          }}
        >
          {/* Tail */}
          <div style={{
            position: "absolute", bottom: -10, right: 12,
            width: 0, height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "10px solid #ffffff",
          }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0F2B4C", lineHeight: 1.4, margin: 0 }}>
            "Lass mich dir zeigen, wie du weniger Steuern zahlst."
          </p>
        </div>

        {/* Second speech bubble — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: "3%",
            width: 140,
            backgroundColor: "#0066B3",
            borderRadius: 16,
            borderBottomLeftRadius: 4,
            padding: "10px 12px",
            zIndex: 3,
          }}
        >
          <div style={{
            position: "absolute", bottom: -10, left: 12,
            width: 0, height: 0,
            borderLeft: "0px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid #0066B3",
          }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: "#ffffff", lineHeight: 1.4, margin: 0 }}>
            Kostenlos starten. In 60 Sekunden.
          </p>
        </div>

        {/* Tag badges */}
        <div style={{ position: "absolute", bottom: "6%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
          {["Smart", "Einfach", "Personlich"].map((tag) => (
            <div
              key={tag}
              style={{
                paddingInline: 10, paddingBlock: 5, borderRadius: 999,
                border: "1px solid rgba(61,181,74,0.5)",
                backgroundColor: "rgba(61,181,74,0.1)",
              }}
            >
              <span style={{ color: "#3DB54A", fontSize: 11, fontWeight: 700 }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 55%, rgba(0,102,179,0.18) 0%, transparent 65%)",
      }} />

      {/* Bottom nav */}
      <div className="flex flex-col gap-3 px-6" style={{ paddingBottom: 32 }}>
        <div className="flex justify-center gap-1.5 items-center">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: 8, borderRadius: 4,
                width: i === 0 ? 22 : 8,
                backgroundColor: i === 0 ? "#3DB54A" : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <button style={{ paddingInline: 18, paddingBlock: 14, color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            Uberspringen
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
