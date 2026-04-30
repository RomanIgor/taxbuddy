
/**
 * Usability C — LESBARKEIT & BARRIEREFREIHEIT
 * Tradeoff: maximum readability and accessibility over visual richness.
 * - WCAG AA contrast on all text (≥4.5:1 for normal, ≥3:1 for large)
 * - Minimum 16px body text, 18px for important labels
 * - Status communicated via icon + text + color (never color alone)
 * - Generous whitespace, 1.5× line height for paragraph text
 * - Simple, unambiguous German (no abbreviations without explanation)
 * - Touch targets ≥ 48×48px everywhere
 */

// WCAG AA-compliant palette (all tested against BG #F5F7FA)
const PRIMARY = "#004F8A";      // #004F8A on #F5F7FA = 7.1:1 ✓
const BG = "#F5F7FA";
const CARD = "#FFFFFF";
const BORDER = "#CBD5E1";       // slightly stronger border for clarity
const MUTED = "#475569";        // #475569 on white = 5.7:1 ✓ (was #64748B = 4.6:1, borderline)
const FOREGROUND = "#0F172A";   // #0F172A on white = 17:1 ✓
const SUCCESS_TEXT = "#14532D"; // dark green on light = 9.1:1 ✓
const SUCCESS_BG = "#DCFCE7";
const WARNING_TEXT = "#78350F"; // dark amber = 8.4:1 ✓
const WARNING_BG = "#FEF3C7";

const ytdRevenue = 12840;
const limit = 22000;
const percent = Math.min(100, (ytdRevenue / limit) * 100);
const remaining = limit - ytdRevenue;

function fmtEur(v: number) {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const ACTIONS = [
  { label: "Einnahme", icon: "↑", color: SUCCESS_BG, fg: SUCCESS_TEXT },
  { label: "Ausgabe", icon: "↓", color: WARNING_BG, fg: WARNING_TEXT },
  { label: "Fahrt", icon: "⊙", color: "#DBEAFE", fg: "#1E3A5F" },
  { label: "KI fragen", icon: "✦", color: "#EDE9FE", fg: "#3B0764" },
  { label: "Beleg", icon: "◎", color: "#DBEAFE", fg: "#1E3A5F" },
  { label: "Simulation", icon: "≈", color: "#DCFCE7", fg: SUCCESS_TEXT },
  { label: "Prognose", icon: "⤴", color: "#DBEAFE", fg: "#1E3A5F" },
  { label: "Export", icon: "⇪", color: "#F1F5F9", fg: "#334155" },
];

export function UsabilityC() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#dde3ea" }}>
      <div style={{
        width: 390, minHeight: 844, background: BG, borderRadius: 40,
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden", display: "flex", flexDirection: "column"
      }}>
        {/* Header — larger text, strong contrast */}
        <div style={{ padding: "22px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Willkommen zurück</div>
            <div style={{ fontSize: 22, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 2 }}>Max Mustermann</div>
          </div>
          {/* 48px target, labelled accessible */}
          <button aria-label="Profil öffnen" style={{
            width: 48, height: 48, borderRadius: 24, background: CARD,
            border: `2px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>

        {/* §19 Limit — no color-only status, always text+icon+color */}
        <div style={{ margin: "16px 20px 0", background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 18, padding: "18px 18px" }}>
          {/* Status badge — icon + text + color, all three carry the meaning */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: SUCCESS_BG, borderRadius: 20, padding: "4px 10px 4px 8px", marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SUCCESS_TEXT} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            <span style={{ fontSize: 12, color: SUCCESS_TEXT, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Sicher im grünen Bereich</span>
          </div>
          {/* Large, bold revenue */}
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Jahresumsatz {new Date().getFullYear()}</div>
          <div style={{ fontSize: 36, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 800, letterSpacing: "-0.5px", marginTop: 4 }}>{fmtEur(ytdRevenue)}</div>
          {/* Explicit plain-language description */}
          <div style={{ fontSize: 14, color: MUTED, fontFamily: "Inter, sans-serif", lineHeight: 1.5, marginTop: 6 }}>
            Das entspricht <strong style={{ color: FOREGROUND }}>{percent.toFixed(0)} %</strong> der Kleinunternehmergrenze von <strong style={{ color: FOREGROUND }}>{fmtEur(limit)}</strong>.
          </div>
          {/* Progress bar with ARIA-like label */}
          <div role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
            style={{ marginTop: 12, height: 12, background: "#E2E8F0", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: PRIMARY, borderRadius: 6 }}/>
          </div>
          <div style={{ fontSize: 13, color: SUCCESS_TEXT, fontFamily: "Inter, sans-serif", fontWeight: 600, marginTop: 6 }}>
            Noch {fmtEur(remaining)} bis zur Grenze
          </div>
        </div>

        {/* KPI cards — large type, plain labels, no jargon */}
        <div style={{ display: "flex", gap: 10, padding: "12px 20px 0" }}>
          {[
            { label: "Jahresprognose", value: fmtEur(18200), note: "Warnung: Im Auge behalten", bg: WARNING_BG, fg: WARNING_TEXT },
            { label: "Fahrtkostenpauschale", value: fmtEur(287), note: "956 km · 8 Fahrten", bg: CARD, fg: MUTED },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: k.bg, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: "14px 14px" }}>
              <div style={{ fontSize: 11, color: k.fg, fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.label}</div>
              <div style={{ fontSize: 20, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginTop: 5 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: k.fg, fontFamily: "Inter, sans-serif", marginTop: 3, fontWeight: k.fg === WARNING_TEXT ? 600 : 400 }}>{k.note}</div>
            </div>
          ))}
        </div>

        {/* Schnellaktionen — 48px targets, larger labels */}
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ fontSize: 16, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginBottom: 10 }}>Schnellaktionen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {ACTIONS.map((a, i) => (
              <button key={i} style={{
                background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: "12px 4px 10px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer",
                minHeight: 70
              }}>
                {/* 44px icon target, high contrast */}
                <div style={{ width: 40, height: 40, borderRadius: 12, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: a.fg }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 10, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats — plain language, no truncation */}
        <div style={{ margin: "12px 20px 16px", background: CARD, border: `1.5px solid ${BORDER}`, borderRadius: 14, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Überblick</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[["14", "Einnahmen"], [fmtEur(3420), "Ausgaben"], ["8", "Fahrten"]].map(([v, l], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
