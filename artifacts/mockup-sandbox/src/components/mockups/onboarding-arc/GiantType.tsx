export function GiantType() {
  const checks = ["Steuern verstehen", "Geld sparen", "Stress vermeiden"];
  return (
    <div
      className="relative overflow-hidden flex flex-col min-h-screen"
      style={{ backgroundColor: "#080F1E", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Status bar */}
      <div className="flex justify-between px-6 pt-4 pb-2">
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}>9:41</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>● ● ●</span>
      </div>

      {/* App slug — small */}
      <div className="px-6 pt-2">
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, textTransform: "uppercase" }}>
          TAXbuddy
        </span>
      </div>

      {/* GIANT typography hero — the axis we're exploring */}
      <div className="px-6 pt-4 flex-1" style={{ minHeight: 0 }}>
        {/* The one BIG word */}
        <div
          style={{
            fontSize: 108,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 0.9,
            letterSpacing: "-4px",
            marginBottom: 6,
          }}
        >
          MEHR
        </div>

        {/* Secondary — much smaller contrast */}
        <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.55)", lineHeight: 1.2, letterSpacing: "-0.5px", marginBottom: 20 }}>
          behalten.{" "}
          <span style={{ color: "#3DB54A" }}>Weniger</span>{" "}
          zahlen.
        </div>

        {/* Body tiny */}
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, maxWidth: 220, marginBottom: 24 }}>
          Dein smarter Steuer-Buddy fur Selbstandige & Kleinunternehmer.
        </p>

        {/* Checkmarks — pill style */}
        <div className="flex flex-col gap-2">
          {checks.map((c) => (
            <div
              key={c}
              className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(61,181,74,0.14)", border: "1px solid rgba(61,181,74,0.35)" }}
            >
              <span style={{ color: "#3DB54A", fontSize: 11, fontWeight: 800 }}>✓</span>
              <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 12, fontWeight: 600 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Raccoon bottom-right, large */}
      <div style={{ position: "absolute", bottom: 80, right: -16, width: 200, height: 220 }}>
        <img
          src="/raccoon.png"
          alt="TAXbuddy mascot"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Glow behind raccoon */}
      <div style={{
        position: "absolute", bottom: 40, right: -60,
        width: 280, height: 180, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(61,181,74,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Dots + buttons */}
      <div
        className="flex flex-col gap-3 px-6 pb-8"
        style={{ paddingBottom: 32, backgroundColor: "transparent" }}
      >
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
