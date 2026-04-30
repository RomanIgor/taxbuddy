
const PRIMARY = "#0066B3";
const BG = "#F5F7FA";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const FOREGROUND = "#0F172A";
const SUCCESS = "#16A34A";
const WARNING = "#D97706";

const ytdRevenue = 12840;
const limit = 22000;
const percent = Math.min(100, (ytdRevenue / limit) * 100);
const remaining = limit - ytdRevenue;

function fmtEur(v: number) {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const SMALL_R = 38;
const SMALL_CIRC = 2 * Math.PI * SMALL_R;
const smallFilled = SMALL_CIRC * (1 - percent / 100);

const ACTIONS = [
  { label: "Einnahme", icon: "↑", color: "#DCFCE7", text: "#16A34A" },
  { label: "Ausgabe", icon: "↓", color: "#FEF3C7", text: "#D97706" },
  { label: "Fahrt", icon: "⊙", color: "#EBF5FF", text: PRIMARY },
  { label: "KI fragen", icon: "✦", color: "#F3E8FF", text: "#9333EA" },
  { label: "Beleg-Check", icon: "◎", color: "#EBF5FF", text: PRIMARY },
  { label: "Simulation", icon: "≈", color: "#F0FDF4", text: SUCCESS },
  { label: "Prognose", icon: "⤴", color: "#EBF5FF", text: PRIMARY },
  { label: "Export", icon: "⇪", color: "#F8FAFC", text: MUTED },
];

export function VariantB() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#e8edf2" }}>
      <div className="relative flex flex-col" style={{
        width: 390, minHeight: 844, background: BG, borderRadius: 40,
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)", overflow: "hidden"
      }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <span style={{ fontSize: 13, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>9:41</span>
          <span style={{ fontSize: 13, color: MUTED }}>●●●</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-0 pb-3">
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Guten Tag</div>
            <div style={{ fontSize: 22, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 1 }}>Max Mustermann</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
        </div>

        {/* Two-column hero */}
        <div style={{ margin: "0 16px", background: PRIMARY, borderRadius: 20, padding: 18, display: "flex", gap: 16, alignItems: "center" }}>
          {/* Left: revenue stack */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "rgba(207,230,255,0.85)", fontFamily: "Inter, sans-serif", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Umsatz {new Date().getFullYear()}</div>
            <div style={{ fontSize: 30, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, marginTop: 6, lineHeight: 1 }}>{fmtEur(ytdRevenue)}</div>
            <div style={{ fontSize: 12, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif", marginTop: 5 }}>von {fmtEur(limit)}</div>
            {/* Progress bar */}
            <div style={{ marginTop: 12, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${percent}%`, background: SUCCESS, borderRadius: 3 }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif" }}>Spielraum: {fmtEur(remaining)}</span>
              <span style={{ fontSize: 11, color: SUCCESS, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Sicher</span>
            </div>
          </div>
          {/* Right: mini ring gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative", width: 90, height: 90 }}>
              <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="45" cy="45" r={SMALL_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
                <circle cx="45" cy="45" r={SMALL_R} fill="none" stroke={SUCCESS} strokeWidth="10"
                  strokeDasharray={SMALL_CIRC} strokeDashoffset={smallFilled} strokeLinecap="round"/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 18, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800 }}>{percent.toFixed(0)}%</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif", textAlign: "center" }}>Auslastung</div>
          </div>
        </div>

        {/* Three KPI cards in a row */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>
          {[
            { label: "Prognose", value: fmtEur(18200), color: WARNING },
            { label: "Ausgaben", value: fmtEur(3420), color: MUTED },
            { label: "Fahrten km", value: "956", color: PRIMARY },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "10px 10px" }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: k.color, marginBottom: 6 }}/>
              <div style={{ fontSize: 16, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions — 2-per-row list */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 13, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginBottom: 10 }}>Aktionen</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {ACTIONS.map((a, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: a.text, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 13, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
