
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

function Icon({ children, color = FOREGROUND }: { children: React.ReactNode; color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const IcoEinnahme = () => (
  <Icon color={SUCCESS}>
    <path d="M12 19V5"/><polyline points="5 12 12 5 19 12"/>
    <path d="M5 19h14"/>
  </Icon>
);

const IcoAusgabe = () => (
  <Icon color={WARNING}>
    <path d="M12 5v14"/><polyline points="19 12 12 19 5 12"/>
    <path d="M5 5h14"/>
  </Icon>
);

const IcoFahrt = () => (
  <Icon color={PRIMARY}>
    <path d="M5 17H3a2 2 0 0 1-2-2v-5l2-4h12l2 4v5a2 2 0 0 1-2 2H5z" strokeWidth="1.8"/>
    <circle cx="6.5" cy="17" r="1.5"/>
    <circle cx="15.5" cy="17" r="1.5"/>
    <path d="M3 11h16"/>
  </Icon>
);

const IcoKI = () => (
  <Icon color={PRIMARY}>
    <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.6 2.8-1.5 3.8A4 4 0 0 1 16 14v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a4 4 0 0 1 .5-3.2A5 5 0 0 1 12 2z" strokeWidth="1.6"/>
    <line x1="9" y1="21" x2="15" y2="21"/>
    <line x1="12" y1="18" x2="12" y2="21"/>
    <circle cx="9.5" cy="9.5" r="1" fill={PRIMARY} stroke="none"/>
    <circle cx="14.5" cy="9.5" r="1" fill={PRIMARY} stroke="none"/>
  </Icon>
);

const IcoBeleg = () => (
  <Icon color={PRIMARY}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="13" y2="17"/>
  </Icon>
);

const IcoSimulation = () => (
  <Icon color={PRIMARY}>
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="12" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="20" strokeDasharray="2 1"/>
  </Icon>
);

const IcoPrognose = () => (
  <Icon color={PRIMARY}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </Icon>
);

const IcoExport = () => (
  <Icon color={PRIMARY}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </Icon>
);

const IcoCarStat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2v-5l2-4h12l2 4v5a2 2 0 0 1-2 2H5z" strokeWidth="1.8"/>
    <circle cx="6.5" cy="17" r="1.5"/>
    <circle cx="15.5" cy="17" r="1.5"/>
    <path d="M3 11h16"/>
  </svg>
);

const IcoTrendUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const ACTIONS = [
  { label: "Einnahme", Icon: IcoEinnahme,   bg: "#DCFCE7" },
  { label: "Ausgabe",  Icon: IcoAusgabe,    bg: "#FEF3C7" },
  { label: "Fahrt",    Icon: IcoFahrt,      bg: "#EBF5FF" },
  { label: "KI",       Icon: IcoKI,         bg: "#EBF5FF" },
  { label: "Beleg",    Icon: IcoBeleg,      bg: "#EBF5FF" },
  { label: "Simulation", Icon: IcoSimulation, bg: "#EBF5FF" },
  { label: "Prognose", Icon: IcoPrognose,   bg: "#EBF5FF" },
  { label: "Export",   Icon: IcoExport,     bg: "#EBF5FF" },
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

        {/* Large balance card */}
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

        {/* 2 stat cards */}
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

        {/* 4-column semantic icon action grid */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 13, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 700, marginBottom: 10 }}>Schnellaktionen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {ACTIONS.map((a, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 4px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: 14, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <a.Icon />
                </div>
                <span style={{ fontSize: 10, color: FOREGROUND, fontFamily: "Inter, sans-serif", fontWeight: 500, textAlign: "center" }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax tip teaser */}
        <div style={{ margin: "12px 16px 0", background: "#EBF5FF", border: `1px solid #BFDBFE`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3A7 7 0 0 1 5 9a7 7 0 0 1 7-7z"/>
              <line x1="9" y1="21" x2="15" y2="21"/>
              <line x1="10" y1="18" x2="14" y2="18"/>
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
