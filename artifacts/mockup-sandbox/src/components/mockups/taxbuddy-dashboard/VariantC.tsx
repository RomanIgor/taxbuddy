
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

/* ── Modern filled icons ─────────────────────────────────────────────────── */

const IcoEinnahme = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#16A34A" opacity="0"/>
    {/* Coin + up arrow */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#16A34A" opacity="0.15"/>
    <path d="M16 10l-4-4-4 4h2.5v4h3v-4H16z" fill="#16A34A"/>
    <path d="M9 16.5h6v1.5H9z" fill="#16A34A"/>
  </svg>
);

const IcoAusgabe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M8 8l4 4 4-4h-2.5V4h-3v4H8z" fill={WARNING}/>
    <path d="M9 0h6v1.5H9z" fill={WARNING}/>
    <rect x="4" y="14" width="16" height="2.5" rx="1.25" fill={WARNING}/>
    <rect x="4" y="18" width="10" height="2.5" rx="1.25" fill={WARNING} opacity="0.45"/>
  </svg>
);

const IcoFahrt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M17.5 8H6.5L4 13v5h16v-5l-2.5-5z" fill={PRIMARY} opacity="0.15" rx="2"/>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M6.94 6a2 2 0 0 0-1.86 1.26L3 13v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5l-2.08-5.74A2 2 0 0 0 17.06 6H6.94zM6 13l1.5-4h9L18 13H6z"
      fill={PRIMARY}/>
    <circle cx="7.5" cy="16.5" r="1.5" fill={PRIMARY}/>
    <circle cx="16.5" cy="16.5" r="1.5" fill={PRIMARY}/>
    <rect x="2" y="10" width="3" height="1.5" rx="0.75" fill={PRIMARY} opacity="0.4"/>
    <rect x="19" y="10" width="3" height="1.5" rx="0.75" fill={PRIMARY} opacity="0.4"/>
  </svg>
);

const IcoKI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l1.09 3.41L17 5l-2.73 2 1.09 3.41L12 8.5l-3.36 1.91L9.73 7 7 5l3.91.59L12 2z" fill="#7C3AED"/>
    <path d="M5 13l.73 2.27L8 16l-2.27.73L5 19l-.73-2.27L2 16l2.27-.73L5 13z" fill="#7C3AED" opacity="0.7"/>
    <path d="M19 13l.73 2.27L22 16l-2.27.73L19 19l-.73-2.27L16 16l2.27-.73L19 13z" fill="#7C3AED" opacity="0.5"/>
    <path d="M12 13a4 4 0 0 0-4 4v1h8v-1a4 4 0 0 0-4-4z" fill="#7C3AED" opacity="0.3"/>
  </svg>
);

const IcoBeleg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 2h9l3 3v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#0D9488" opacity="0.15"/>
    <path d="M6 2h9l3 3v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="#0D9488" strokeWidth="1.5" fill="none"/>
    <path d="M14 2v4h4" stroke="#0D9488" strokeWidth="1.5" fill="none"/>
    <rect x="7" y="10" width="6" height="1.5" rx="0.75" fill="#0D9488"/>
    <rect x="7" y="13" width="10" height="1.5" rx="0.75" fill="#0D9488"/>
    <rect x="7" y="16" width="8" height="1.5" rx="0.75" fill="#0D9488" opacity="0.5"/>
  </svg>
);

const IcoSimulation = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {/* Sliders icon — modern */}
    <rect x="2" y="5.5" width="20" height="2" rx="1" fill="#4F46E5" opacity="0.3"/>
    <rect x="2" y="11.5" width="20" height="2" rx="1" fill="#4F46E5" opacity="0.3"/>
    <rect x="2" y="17.5" width="20" height="2" rx="1" fill="#4F46E5" opacity="0.3"/>
    <circle cx="7" cy="6.5" r="3" fill="#4F46E5"/>
    <circle cx="17" cy="12.5" r="3" fill="#4F46E5"/>
    <circle cx="10" cy="18.5" r="3" fill="#4F46E5"/>
  </svg>
);

const IcoPrognose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 18l5-5 4 4 5-6 4-2" stroke={PRIMARY} strokeWidth="0" fill="none"/>
    {/* Filled bar chart with trend */}
    <rect x="3" y="14" width="3.5" height="6" rx="1.5" fill={PRIMARY} opacity="0.4"/>
    <rect x="8" y="10" width="3.5" height="10" rx="1.5" fill={PRIMARY} opacity="0.6"/>
    <rect x="13" y="6" width="3.5" height="14" rx="1.5" fill={PRIMARY} opacity="0.8"/>
    <rect x="18" y="2" width="3.5" height="18" rx="1.5" fill={PRIMARY}/>
    {/* Trend arrow */}
    <path d="M4 13l14-9" stroke={PRIMARY} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M15 4h3v3" stroke={PRIMARY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IcoExport = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {/* Share / upload tray — filled */}
    <rect x="3" y="14" width="18" height="7" rx="2" fill="#0284C7" opacity="0.2"/>
    <rect x="3" y="18" width="18" height="3" rx="1.5" fill="#0284C7" opacity="0.5"/>
    <path d="M12 3v10M8.5 7.5L12 3l3.5 4.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="2" y="19" width="20" height="3" rx="1.5" fill="#0284C7"/>
  </svg>
);

const IcoCarStat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M6.94 6a2 2 0 0 0-1.86 1.26L3 13v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5l-2.08-5.74A2 2 0 0 0 17.06 6H6.94zM6 13l1.5-4h9L18 13H6z"
      fill={PRIMARY}/>
    <circle cx="7.5" cy="16.5" r="1.5" fill={PRIMARY}/>
    <circle cx="16.5" cy="16.5" r="1.5" fill={PRIMARY}/>
  </svg>
);

const IcoTrendUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 17l5-5 4 4 9-10" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 6h5v5" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ACTIONS = [
  { label: "Einnahme",   Icon: IcoEinnahme,   bg: "#DCFCE7" },
  { label: "Ausgabe",    Icon: IcoAusgabe,    bg: "#FEF3C7" },
  { label: "Fahrt",      Icon: IcoFahrt,      bg: "#DBEAFE" },
  { label: "KI",         Icon: IcoKI,         bg: "#EDE9FE" },
  { label: "Beleg",      Icon: IcoBeleg,      bg: "#CCFBF1" },
  { label: "Simulation", Icon: IcoSimulation, bg: "#E0E7FF" },
  { label: "Prognose",   Icon: IcoPrognose,   bg: "#DBEAFE" },
  { label: "Export",     Icon: IcoExport,     bg: "#E0F2FE" },
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

        {/* Progress banner */}
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

        {/* Balance card */}
        <div style={{ margin: "10px 16px 0", borderRadius: 20, padding: 22, background: `linear-gradient(135deg, ${PRIMARY} 0%, #004A8F 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
          <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}/>
          <div style={{ fontSize: 11, color: "rgba(207,230,255,0.85)", fontFamily: "Inter, sans-serif", fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Jahresumsatz {new Date().getFullYear()}</div>
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

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 10, padding: "10px 16px 0" }}>
          {[
            { label: "Fahrtkosten", value: fmtEur(287), sub: "956 km · 0,30 €/km", Icon: IcoCarStat },
            { label: "Einnahmen",   value: "14 Buchungen", sub: fmtEur(12840) + " gesamt", Icon: IcoTrendUp },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 14 }}>
              <div style={{ marginBottom: 6 }}><k.Icon /></div>
              <div style={{ fontSize: 16, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "Inter, sans-serif" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick action grid */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 13, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginBottom: 10 }}>Schnellaktionen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {ACTIONS.map((a, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 4px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <a.Icon />
                </div>
                <span style={{ fontSize: 10, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 600, textAlign: "center" }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax tip */}
        <div style={{ margin: "12px 16px 0", background: "#EBF5FF", border: `1px solid #BFDBFE`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2a7 7 0 0 1 5.4 11.47l.6 2.53-2.5-.83A7 7 0 1 1 12 2zm0 2a5 5 0 1 0 2.77 9.19l1.83.6-.44-1.85A5 5 0 0 0 12 4z" fill="#fff" opacity="0.9"/>
              <rect x="11" y="9" width="2" height="5" rx="1" fill="#fff"/>
              <circle cx="12" cy="16" r="1" fill="#fff"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, color: PRIMARY, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>Steuertipp des Tages</div>
            <div style={{ fontSize: 11, color: "#1E40AF", fontFamily: "Inter, sans-serif", marginTop: 2 }}>Homeoffice-Pauschale 2025: bis 1.260 € absetzbar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
