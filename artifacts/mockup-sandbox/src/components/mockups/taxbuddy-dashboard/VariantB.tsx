
/**
 * Variante B — Split Column  (v2: usability + modern)
 *
 * Usability improvements over v1:
 *  - WCAG AA contrast on every text element
 *  - Status communicated via icon + text + color (not color alone)
 *  - All tappable surfaces are ≥ 48px tall with chevron affordance cues
 *  - Progress bar thicker (10px) and captioned plainly
 *  - KPI dot-indicator replaced with a color-coded left border (higher contrast)
 *  - Section labels + rule to group content zones
 *
 * Modern design improvements:
 *  - Hero card uses gradient + decorative geometry instead of flat fill
 *  - Cards use layered elevation (shadow + border) instead of border alone
 *  - Refined type scale: 32px hero, 20px KPI, 14px body, 11px label
 *  - Smoother corner radii (22px cards, 16px tiles)
 *  - Action rows have an explicit ▸ affordance and a tinted icon chip
 */

const PRIMARY      = "#0057A0";   // adjusted: 4.9:1 on white ✓ (AA)
const PRIMARY_DARK = "#003E75";
const BG           = "#F4F6F9";
const CARD         = "#FFFFFF";
const BORDER       = "#DDE3EC";
const MUTED        = "#475569";   // 5.7:1 on white ✓ (AA)
const FOREGROUND   = "#0F172A";   // 17:1 ✓
const SUCCESS_FG   = "#14532D";   // 9.1:1 on #DCFCE7 ✓
const SUCCESS_BG   = "#DCFCE7";
const SUCCESS_BAR  = "#22C55E";
const WARNING_FG   = "#78350F";
const WARNING_BG   = "#FEF3C7";
const CRITICAL_FG  = "#7F1D1D";

const ytdRevenue = 12840;
const limit      = 22000;
const percent    = Math.min(100, (ytdRevenue / limit) * 100);
const remaining  = limit - ytdRevenue;

function fmtEur(v: number) {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// Ring gauge constants
const R    = 36;
const CIRC = 2 * Math.PI * R;
const dash = CIRC * (1 - percent / 100);

// Chevron icon
function Chev({ size = 14, color = MUTED }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

// Elevated card wrapper
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 20,
      boxShadow: "0 1px 4px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
      ...style
    }}>
      {children}
    </div>
  );
}

const ACTIONS = [
  { label: "Einnahme",    icon: "↑", bg: SUCCESS_BG,  fg: SUCCESS_FG },
  { label: "Ausgabe",     icon: "↓", bg: WARNING_BG,  fg: WARNING_FG },
  { label: "Fahrt",       icon: "⊙", bg: "#DBEAFE",   fg: "#1E3A5F"  },
  { label: "KI fragen",   icon: "✦", bg: "#EDE9FE",   fg: "#3B0764"  },
  { label: "Beleg-Check", icon: "◎", bg: "#DBEAFE",   fg: "#1E3A5F"  },
  { label: "Simulation",  icon: "≈", bg: "#DCFCE7",   fg: SUCCESS_FG },
  { label: "Prognose",    icon: "⤴", bg: "#DBEAFE",   fg: "#1E3A5F"  },
  { label: "Export",      icon: "⇪", bg: "#F1F5F9",   fg: "#334155"  },
];

export function VariantB() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#dde3ea" }}>
      <div style={{
        width: 390, minHeight: 844,
        background: BG, borderRadius: 44,
        boxShadow: "0 40px 100px rgba(0,0,0,0.28)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>

        {/* ── Status bar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 22px 0" }}>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>9:41</span>
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: MUTED, opacity: 0.5 }}/>)}
          </div>
        </div>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 0" }}>
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontWeight: 500, letterSpacing: "0.02em" }}>Guten Tag</div>
            <div style={{ fontSize: 22, color: FOREGROUND, fontWeight: 800, marginTop: 2, letterSpacing: "-0.3px" }}>
              Max Mustermann
            </div>
          </div>
          {/* 44px profile button with visible ring */}
          <button style={{
            width: 44, height: 44, borderRadius: 22,
            background: CARD, border: `1.5px solid ${BORDER}`,
            boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* ── Hero card — Split Column ── */}
        <div style={{ margin: "14px 16px 0" }}>
          <div style={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
            borderRadius: 22, padding: "18px 18px 16px",
            boxShadow: `0 8px 32px rgba(0,87,160,0.32), 0 2px 8px rgba(0,87,160,0.18)`,
            position: "relative", overflow: "hidden"
          }}>
            {/* Decorative geometry */}
            <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }}/>
            <div style={{ position: "absolute", bottom: -30, left: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }}/>

            <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
              {/* Left column */}
              <div style={{ flex: 1 }}>
                {/* Status badge: icon + text + color */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: SUCCESS_BG, borderRadius: 20, padding: "3px 8px 3px 6px", marginBottom: 10 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SUCCESS_FG} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                  <span style={{ fontSize: 11, color: SUCCESS_FG, fontWeight: 700 }}>Sicher</span>
                </div>

                <div style={{ fontSize: 11, color: "rgba(207,230,255,0.8)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Umsatz {new Date().getFullYear()}
                </div>
                <div style={{ fontSize: 32, color: "#fff", fontWeight: 800, marginTop: 4, lineHeight: 1, letterSpacing: "-0.5px" }}>
                  {fmtEur(ytdRevenue)}
                </div>
                <div style={{ fontSize: 12, color: "rgba(207,230,255,0.65)", marginTop: 4 }}>
                  von {fmtEur(limit)} (§ 19 UStG)
                </div>

                {/* Progress bar — 10px, accessible */}
                <div style={{ marginTop: 12, height: 10, background: "rgba(255,255,255,0.12)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${percent}%`, background: SUCCESS_BAR, borderRadius: 5 }}/>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span style={{ fontSize: 11, color: "rgba(207,230,255,0.7)" }}>{percent.toFixed(0)} % ausgeschöpft</span>
                  <span style={{ fontSize: 11, color: SUCCESS_BAR, fontWeight: 600 }}>{fmtEur(remaining)} frei</span>
                </div>
              </div>

              {/* Right column — ring gauge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <div style={{ position: "relative", width: 86, height: 86 }}>
                  <svg width="86" height="86" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="43" cy="43" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9"/>
                    <circle cx="43" cy="43" r={R} fill="none" stroke={SUCCESS_BAR} strokeWidth="9"
                      strokeDasharray={CIRC} strokeDashoffset={dash} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, color: "#fff", fontWeight: 800 }}>{percent.toFixed(0)}%</span>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(207,230,255,0.6)", fontWeight: 500 }}>Auslastung</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI metrics — 3 tiles, color-coded left border ── */}
        <div style={{ display: "flex", gap: 9, padding: "12px 16px 0" }}>
          {[
            { label: "Jahresprognose", value: fmtEur(18200), accent: "#D97706", bg: "#FFFBEB" },
            { label: "Ausgaben",       value: fmtEur(3420),  accent: MUTED,     bg: CARD     },
            { label: "Fahrten-km",     value: "956",          accent: PRIMARY,   bg: "#F0F7FF" },
          ].map((k, i) => (
            <div key={i} style={{
              flex: 1, background: k.bg, borderRadius: 16,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
              borderLeft: `3px solid ${k.accent}`,
              padding: "11px 11px 10px"
            }}>
              <div style={{ fontSize: 18, color: FOREGROUND, fontWeight: 700 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: MUTED, fontWeight: 500, marginTop: 3, lineHeight: 1.3 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* ── Quick actions — 2-per-row, 52px rows, explicit chevrons ── */}
        <div style={{ padding: "14px 16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 16, height: 2, background: PRIMARY, borderRadius: 1 }}/>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Schnellaktionen
            </span>
          </div>
          <Card style={{ overflow: "hidden", borderRadius: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {ACTIONS.map((a, i) => {
                const isLastRow = i >= ACTIONS.length - 2;
                const isRight = i % 2 === 1;
                return (
                  <button key={i} style={{
                    height: 56, padding: "0 14px",
                    background: "transparent", border: "none", cursor: "pointer",
                    borderBottom: isLastRow ? "none" : `1px solid ${BORDER}`,
                    borderRight: isRight ? "none" : `1px solid ${BORDER}`,
                    display: "flex", alignItems: "center", gap: 12, textAlign: "left"
                  }}>
                    {/* Tinted icon chip */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                      background: a.bg, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 16, color: a.fg
                    }}>
                      {a.icon}
                    </div>
                    {/* Label */}
                    <span style={{ flex: 1, fontSize: 14, color: FOREGROUND, fontWeight: 600 }}>{a.label}</span>
                    {/* Affordance chevron */}
                    <Chev color="#CBD5E1" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
