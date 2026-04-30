
/**
 * Usability B — INTERAKTION & AFFORDANZ
 * Tradeoff: maximum affordance clarity over information density.
 * Buttons have explicit depth/shadow. Primary CTA is unmistakable.
 * Touch targets are minimum 48px. Chevrons signal tappability.
 * Secondary info is de-emphasized so interactive elements dominate.
 */

const PRIMARY = "#0066B3";
const PRIMARY_DARK = "#004F8A";
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

// Chevron SVG inline
function Chevron({ color = MUTED }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

const PRIMARY_ACTIONS = [
  { label: "Einnahme erfassen", icon: "↑", color: SUCCESS, bg: "#DCFCE7" },
  { label: "Ausgabe erfassen", icon: "↓", color: WARNING, bg: "#FEF3C7" },
];

const SECONDARY_ACTIONS = [
  { label: "Fahrt eintragen", icon: "⊙" },
  { label: "KI fragen", icon: "✦" },
  { label: "Beleg-Check", icon: "◎" },
  { label: "Simulation", icon: "≈" },
  { label: "Prognose", icon: "⤴" },
  { label: "Export", icon: "⇪" },
];

export function UsabilityB() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#dde3ea" }}>
      <div style={{
        width: 390, minHeight: 844, background: BG, borderRadius: 40,
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden", display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif" }}>Guten Tag</div>
            <div style={{ fontSize: 20, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 1 }}>Max Mustermann</div>
          </div>
          {/* Profile button — explicit 44px target, visible ring on focus */}
          <button style={{
            width: 44, height: 44, borderRadius: 22, background: CARD,
            border: `1.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>

        {/* §19 summary — tappable card with explicit chevron */}
        <button style={{
          margin: "14px 20px 0", background: PRIMARY, borderRadius: 20, padding: "18px 20px",
          border: "none", cursor: "pointer", textAlign: "left",
          boxShadow: `0 8px 24px rgba(0,102,179,0.35), 0 2px 6px rgba(0,102,179,0.2)`,
          display: "flex", flexDirection: "column", gap: 0
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(207,230,255,0.85)", fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>§ 19 UStG Jahresumsatz</div>
              <div style={{ fontSize: 34, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, marginTop: 6, letterSpacing: "-0.5px" }}>{fmtEur(ytdRevenue)}</div>
              <div style={{ fontSize: 13, color: "rgba(207,230,255,0.8)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>von {fmtEur(limit)} · {percent.toFixed(0)} % ausgeschöpft</div>
            </div>
            {/* Explicit affordance: chevron to navigate */}
            <div style={{ width: 32, height: 32, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
              <Chevron color="#fff" />
            </div>
          </div>
          <div style={{ marginTop: 14, height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: "#4ADE80", borderRadius: 4 }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(207,230,255,0.8)", fontFamily: "Inter, sans-serif" }}>Spielraum: {fmtEur(remaining)}</span>
            <span style={{ fontSize: 12, color: "#4ADE80", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Sicher</span>
          </div>
        </button>

        {/* ── PRIMARY CTAs — unmistakably buttons ── */}
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Neu erfassen</div>
          <div style={{ display: "flex", gap: 10 }}>
            {PRIMARY_ACTIONS.map((a, i) => (
              <button key={i} style={{
                flex: 1, height: 52, borderRadius: 14, background: a.bg, border: `1.5px solid ${a.bg}`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)"
              }}>
                <span style={{ fontSize: 20, color: a.color }}>{a.icon}</span>
                <span style={{ fontSize: 14, color: a.color, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SECONDARY ACTIONS — list rows with 48px height ── */}
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Weitere Aktionen</div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
            {SECONDARY_ACTIONS.map((a, i) => (
              <button key={i} style={{
                width: "100%", height: 48, padding: "0 16px", background: "transparent", border: "none",
                borderBottom: i < SECONDARY_ACTIONS.length - 1 ? `1px solid ${BORDER}` : "none",
                display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left"
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#EBF5FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: PRIMARY, flexShrink: 0 }}>{a.icon}</div>
                <span style={{ flex: 1, fontSize: 14, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{a.label}</span>
                <Chevron />
              </button>
            ))}
          </div>
        </div>

        {/* Quick stats — smallest, supporting info */}
        <div style={{ margin: "12px 20px 0", background: "#F1F5F9", borderRadius: 14, padding: "10px 16px", display: "flex", justifyContent: "space-between" }}>
          {[["14", "Einnahmen"], [fmtEur(3420), "Ausgaben"], ["8", "Fahrten"]].map(([v, l], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
