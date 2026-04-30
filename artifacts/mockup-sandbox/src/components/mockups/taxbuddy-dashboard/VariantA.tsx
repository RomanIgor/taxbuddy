
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

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const filled = CIRCUMFERENCE * (1 - percent / 100);

const ACTIONS = [
  { label: "Einnahme", icon: "↑" },
  { label: "Ausgabe", icon: "↓" },
  { label: "Fahrt", icon: "⊙" },
  { label: "KI fragen", icon: "✦" },
  { label: "Beleg-Check", icon: "◎" },
  { label: "Simulation", icon: "≈" },
  { label: "Prognose", icon: "⤴" },
  { label: "Export", icon: "⇪" },
];

export function VariantA() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#e8edf2" }}>
      <div className="relative overflow-hidden flex flex-col" style={{
        width: 390, minHeight: 844, background: BG, borderRadius: 40,
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)"
      }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <span style={{ fontSize: 13, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>9:41</span>
          <span style={{ fontSize: 13, color: MUTED, fontFamily: "Inter, sans-serif" }}>●●●</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-1 pb-2">
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.04em" }}>Guten Tag</div>
            <div style={{ fontSize: 22, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 1 }}>Max Mustermann</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
        </div>

        {/* Ring Hero */}
        <div className="flex flex-col items-center pt-4 pb-2" style={{ background: PRIMARY, margin: "0 16px", borderRadius: 20, padding: "24px 20px 20px" }}>
          <div style={{ fontSize: 12, color: "rgba(207,230,255,0.9)", fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>§ 19 UStG Jahresgrenze</div>
          <div style={{ position: "relative", width: 200, height: 200 }}>
            <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14"/>
              <circle cx="100" cy="100" r={RADIUS} fill="none" stroke={SUCCESS} strokeWidth="14"
                strokeDasharray={CIRCUMFERENCE} strokeDashoffset={filled}
                strokeLinecap="round"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(207,230,255,0.9)", fontFamily: "Inter, sans-serif", fontWeight: 500, marginBottom: 4 }}>Umsatz {new Date().getFullYear()}</div>
              <div style={{ fontSize: 28, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, lineHeight: 1 }}>{fmtEur(ytdRevenue)}</div>
              <div style={{ fontSize: 12, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>von {fmtEur(limit)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif" }}>Spielraum</div>
              <div style={{ fontSize: 16, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 2 }}>{fmtEur(remaining)}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }}/>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif" }}>Auslastung</div>
              <div style={{ fontSize: 16, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 2 }}>{percent.toFixed(0)} %</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }}/>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif" }}>Status</div>
              <div style={{ fontSize: 12, color: SUCCESS, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 2 }}>Sicher</div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "flex", gap: 10, padding: "14px 16px 0" }}>
          {[
            { label: "Jahresprognose", value: fmtEur(18200), tone: "warning", sub: "⚠ Im Auge behalten" },
            { label: "Fahrtenbuch", value: fmtEur(287), sub: "956 km gesamt" },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 18, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: k.tone === "warning" ? WARNING : MUTED, fontFamily: "Inter, sans-serif", marginTop: 3 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{ margin: "12px 16px 0", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, display: "flex" }}>
          {[["Einnahmen", "14"], ["Ausgaben", fmtEur(3420)], ["Fahrten", "8"]].map(([l, v], i) => (
            <div key={i} style={{ flex: 1, padding: "10px 0", textAlign: "center", borderRight: i < 2 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif" }}>{l}</div>
              <div style={{ fontSize: 15, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 13, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginBottom: 10 }}>Schnellaktionen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {ACTIONS.map((a, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "#EBF5FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: PRIMARY }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 10, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
