
/**
 * Usability A — INFORMATIONSHIERARCHIE
 * Tradeoff: strict typographic scale + visual weight distribution over density.
 * One dominant focal point → supporting data → actions.
 * F-pattern: eyes land on status, scan left for revenue, then quick actions.
 */

const PRIMARY = "#0066B3";
const BG = "#F5F7FA";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const FOREGROUND = "#0F172A";
const SUCCESS = "#16A34A";
const WARNING = "#D97706";
const CRITICAL = "#DC2626";

const ytdRevenue = 12840;
const limit = 22000;
const percent = Math.min(100, (ytdRevenue / limit) * 100);
const remaining = limit - ytdRevenue;

function fmtEur(v: number) {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const STATUS = { color: SUCCESS, bg: "#DCFCE7", label: "Sicher im grünen Bereich", icon: "✓" };

const ACTIONS = [
  { label: "Einnahme", icon: "↑", color: "#DCFCE7", fg: SUCCESS },
  { label: "Ausgabe", icon: "↓", color: "#FEF3C7", fg: WARNING },
  { label: "Fahrt", icon: "⊙", color: "#EBF5FF", fg: PRIMARY },
  { label: "KI fragen", icon: "✦", color: "#F3E8FF", fg: "#9333EA" },
  { label: "Beleg-Check", icon: "◎", color: "#EBF5FF", fg: PRIMARY },
  { label: "Simulation", icon: "≈", color: "#F0FDF4", fg: SUCCESS },
  { label: "Prognose", icon: "⤴", color: "#EBF5FF", fg: PRIMARY },
  { label: "Export", icon: "⇪", color: "#F8FAFC", fg: MUTED },
];

export function UsabilityA() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#dde3ea" }}>
      <div style={{
        width: 390, minHeight: 844, background: BG, borderRadius: 40,
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden", display: "flex", flexDirection: "column"
      }}>
        {/* ── ZONE 1: Identity ── small, muted */}
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>TAXbuddy · 2025</div>
            <div style={{ fontSize: 17, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 600, marginTop: 2 }}>Max Mustermann</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: STATUS.bg, borderRadius: 20, padding: "5px 10px 5px 8px" }}>
            <span style={{ fontSize: 13, color: STATUS.color }}>{STATUS.icon}</span>
            <span style={{ fontSize: 11, color: STATUS.color, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{STATUS.label}</span>
          </div>
        </div>

        {/* ── ZONE 2: Primary focal point — the big number ── */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
            Jahresumsatz
          </div>
          {/* Dominant value — largest typographic weight on the page */}
          <div style={{ fontSize: 44, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>
            {fmtEur(ytdRevenue)}
          </div>
          {/* Secondary: limit context — smaller but still readable */}
          <div style={{ fontSize: 14, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 6 }}>
            von <span style={{ color: FOREGROUND, fontWeight: 600 }}>{fmtEur(limit)}</span> Kleinunternehmergrenze (§ 19 UStG)
          </div>
          {/* Progress — tertiary, supporting the number above */}
          <div style={{ marginTop: 12, height: 10, background: "#E2E8F0", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: `linear-gradient(90deg, ${PRIMARY}, #2196F3)`, borderRadius: 5 }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif" }}>{percent.toFixed(0)} % ausgeschöpft</span>
            <span style={{ fontSize: 12, color: SUCCESS, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>{fmtEur(remaining)} frei</span>
          </div>
        </div>

        {/* ── ZONE 3: Secondary metrics — medium weight ── */}
        <div style={{ padding: "16px 20px 0", display: "flex", gap: 10 }}>
          {[
            { tier: "secondary", label: "Prognose Jahresende", value: fmtEur(18200), note: "Im Auge behalten", noteColor: WARNING },
            { tier: "secondary", label: "Absetzbare Fahrten", value: fmtEur(287), note: "956 km · 8 Fahrten", noteColor: MUTED },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "14px 14px" }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</div>
              <div style={{ fontSize: 20, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 5 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: k.noteColor, fontFamily: "Inter, sans-serif", marginTop: 3, fontWeight: k.noteColor !== MUTED ? 600 : 400 }}>{k.note}</div>
            </div>
          ))}
        </div>

        {/* ── ZONE 4: Tertiary summary ── smallest weight, muted card */}
        <div style={{ margin: "12px 20px 0", background: "#F1F5F9", borderRadius: 14, padding: "10px 16px", display: "flex", justifyContent: "space-between" }}>
          {[["14", "Einnahmen"], [fmtEur(3420), "Ausgaben"], ["8", "Fahrten"]].map(([v, l], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── ZONE 5: Actions — labeled section heading guides the eye ── */}
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ height: 2, width: 18, background: PRIMARY, borderRadius: 1 }}/>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Schnellaktionen</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {ACTIONS.map((a, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "10px 4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: a.fg }}>{a.icon}</div>
                <span style={{ fontSize: 9, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 500, textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
