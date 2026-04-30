
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

const ACTIONS = [
  { label: "Einnahme", icon: "↑" },
  { label: "Ausgabe", icon: "↓" },
  { label: "Fahrt", icon: "⊙" },
  { label: "KI", icon: "✦" },
  { label: "Beleg", icon: "◎" },
  { label: "Simulation", icon: "≈" },
  { label: "Prognose", icon: "⤴" },
  { label: "Export", icon: "⇪" },
];

export function VariantC() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#e8edf2" }}>
      <div className="relative flex flex-col" style={{
        width: 390, minHeight: 844, background: BG, borderRadius: 40,
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)", overflow: "hidden"
      }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-1">
          <span style={{ fontSize: 13, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>9:41</span>
          <span style={{ fontSize: 13, color: MUTED }}>●●●</span>
        </div>

        {/* Compact header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif" }}>Guten Tag</div>
            <div style={{ fontSize: 20, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Max Mustermann</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
          </div>
        </div>

        {/* Slim progress banner */}
        <div style={{ margin: "0 16px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>§ 19 UStG Jahresgrenze</span>
            <span style={{ fontSize: 12, color: SUCCESS, fontFamily: "Inter, sans-serif", fontWeight: 600, background: "#DCFCE7", padding: "2px 8px", borderRadius: 20 }}>Sicher — {percent.toFixed(0)} %</span>
          </div>
          <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: `linear-gradient(90deg, ${PRIMARY}, #34A8FF)`, borderRadius: 4 }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif" }}>{fmtEur(ytdRevenue)} verwendet</span>
            <span style={{ fontSize: 11, color: SUCCESS, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{fmtEur(remaining)} frei</span>
          </div>
        </div>

        {/* Large balance card — glassmorphism gradient */}
        <div style={{ margin: "10px 16px 0", borderRadius: 20, padding: 22, background: `linear-gradient(135deg, ${PRIMARY} 0%, #004A8F 100%)`, position: "relative", overflow: "hidden" }}>
          {/* decorative circles */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
          <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}/>
          <div style={{ fontSize: 11, color: "rgba(207,230,255,0.85)", fontFamily: "Inter, sans-serif", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Jahresumsatz {new Date().getFullYear()}</div>
          <div style={{ fontSize: 38, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, marginTop: 8, letterSpacing: "-0.5px" }}>{fmtEur(ytdRevenue)}</div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "14px 0" }}/>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Prognose Jahresende", value: fmtEur(18200), color: WARNING },
              { label: "Absetzbare Ausgaben", value: fmtEur(3420), color: "rgba(207,230,255,0.8)" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: "rgba(207,230,255,0.7)", fontFamily: "Inter, sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 16, color: s.color, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 stat cards */}
        <div style={{ display: "flex", gap: 10, padding: "10px 16px 0" }}>
          {[
            { label: "Fahrtkosten", value: fmtEur(287), sub: "956 km · 0,30 €/km", icon: "⊙" },
            { label: "Einnahmen", value: "14 Buchungen", sub: fmtEur(12840) + " gesamt", icon: "↑" },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 18, marginBottom: 6, color: PRIMARY }}>{k.icon}</div>
              <div style={{ fontSize: 16, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* 4-column icon-first action grid */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 13, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginBottom: 10 }}>Schnellaktionen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {ACTIONS.map((a, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 4px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: 14, background: i === 0 ? "#DCFCE7" : i === 1 ? "#FEF3C7" : "#EBF5FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: i === 0 ? SUCCESS : i === 1 ? WARNING : PRIMARY }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 10, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 500, textAlign: "center" }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax tip teaser */}
        <div style={{ margin: "12px 16px 0", background: "#EBF5FF", border: `1px solid #BFDBFE`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, color: "#fff" }}>✦</div>
          <div>
            <div style={{ fontSize: 12, color: PRIMARY, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Steuertipp des Tages</div>
            <div style={{ fontSize: 11, color: "#1E40AF", fontFamily: "Inter, sans-serif", marginTop: 2 }}>Homeoffice-Pauschale 2025: bis 1.260 € absetzbar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
