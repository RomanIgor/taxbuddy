
/**
 * Vibe 3 — MINIMAL & RUHIG
 * Emotional register: calm, focused, distraction-free.
 * Palette: near-white surfaces, hairline borders, single ink-blue accent.
 * Almost no color — data speaks through type and spacing, not decoration.
 * Feels like Linear, Notion, or a Swiss design system.
 * Same structure as VariantB v2.
 */

const INK        = "#1A2332";   // single dark anchor color
const ACCENT     = "#2563EB";   // one blue, used sparingly
const BG         = "#F8F9FB";   // barely-off-white
const CARD       = "#FFFFFF";
const BORDER     = "#E8ECF0";   // hairline
const MUTED      = "#8896A4";   // muted label
const FOREGROUND = "#1A2332";

const SUCCESS_FG = "#166534";
const SUCCESS_BG = "#F0FDF4";
const SUCCESS_BAR= "#4ADE80";

const ytdRevenue = 12840;
const limit      = 22000;
const percent    = Math.min(100, (ytdRevenue / limit) * 100);
const remaining  = limit - ytdRevenue;

function fmtEur(v: number) {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const R = 36, CIRC = 2 * Math.PI * R;
const dash = CIRC * (1 - percent / 100);

function Chev() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D9E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

const ACTIONS = [
  { label:"Einnahme",    icon:"↑", bg:SUCCESS_BG, fg:SUCCESS_FG },
  { label:"Ausgabe",     icon:"↓", bg:"#FFFBEB",  fg:"#92400E"  },
  { label:"Fahrt",       icon:"⊙", bg:"#EFF6FF",  fg:"#1E40AF"  },
  { label:"KI fragen",   icon:"✦", bg:"#F5F3FF",  fg:"#5B21B6"  },
  { label:"Beleg-Check", icon:"◎", bg:"#EFF6FF",  fg:"#1E40AF"  },
  { label:"Simulation",  icon:"≈", bg:SUCCESS_BG, fg:SUCCESS_FG },
  { label:"Prognose",    icon:"⤴", bg:"#EFF6FF",  fg:"#1E40AF"  },
  { label:"Export",      icon:"⇪", bg:"#F8F9FB",  fg:MUTED      },
];

export function VibeQuiet() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#EAECEF" }}>
      <div style={{
        width:390, minHeight:844, background:BG, borderRadius:44,
        boxShadow:"0 32px 80px rgba(26,35,50,0.12), 0 1px 0 rgba(26,35,50,0.06)",
        overflow:"hidden", display:"flex", flexDirection:"column",
        fontFamily:"'Inter', system-ui, sans-serif"
      }}>

        {/* Status bar */}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"18px 22px 0" }}>
          <span style={{ fontSize:13, color:MUTED, fontWeight:500 }}>9:41</span>
          <div style={{ display:"flex", gap:4 }}>
            {[1,2,3].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:MUTED, opacity:0.35 }}/>)}
          </div>
        </div>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px 0" }}>
          <div>
            <div style={{ fontSize:12, color:MUTED, fontWeight:400, letterSpacing:"0.01em" }}>Guten Tag</div>
            <div style={{ fontSize:22, color:FOREGROUND, fontWeight:700, marginTop:2, letterSpacing:"-0.3px" }}>Max Mustermann</div>
          </div>
          <button style={{
            width:44, height:44, borderRadius:22, background:CARD,
            border:`1px solid ${BORDER}`,
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.75">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* Hero card — near-white, single accent border-top */}
        <div style={{ margin:"14px 16px 0" }}>
          <div style={{
            background:CARD, borderRadius:22,
            border:`1px solid ${BORDER}`,
            borderTop:`3px solid ${ACCENT}`,
            padding:"18px 18px 16px",
            boxShadow:"0 1px 3px rgba(26,35,50,0.06), 0 4px 16px rgba(26,35,50,0.04)"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* Left */}
              <div style={{ flex:1 }}>
                {/* Status: icon + text, no reliance on color alone */}
                <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:SUCCESS_BG, borderRadius:20, padding:"3px 8px 3px 6px", marginBottom:10 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SUCCESS_FG} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                  <span style={{ fontSize:11, color:SUCCESS_FG, fontWeight:600 }}>Sicher</span>
                </div>
                <div style={{ fontSize:11, color:MUTED, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Umsatz {new Date().getFullYear()}
                </div>
                <div style={{ fontSize:32, color:FOREGROUND, fontWeight:700, marginTop:4, lineHeight:1, letterSpacing:"-0.5px" }}>
                  {fmtEur(ytdRevenue)}
                </div>
                <div style={{ fontSize:12, color:MUTED, marginTop:4 }}>
                  von {fmtEur(limit)} (§ 19 UStG)
                </div>
                {/* Hairline progress track */}
                <div style={{ marginTop:12, height:6, background:"#EEF1F5", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${percent}%`, background:ACCENT, borderRadius:3 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                  <span style={{ fontSize:11, color:MUTED }}>{percent.toFixed(0)} % ausgeschöpft</span>
                  <span style={{ fontSize:11, color:ACCENT, fontWeight:500 }}>{fmtEur(remaining)} frei</span>
                </div>
              </div>
              {/* Right ring — monochrome */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
                <div style={{ position:"relative", width:86, height:86 }}>
                  <svg width="86" height="86" style={{ transform:"rotate(-90deg)" }}>
                    <circle cx="43" cy="43" r={R} fill="none" stroke="#EEF1F5" strokeWidth="8"/>
                    <circle cx="43" cy="43" r={R} fill="none" stroke={ACCENT} strokeWidth="8"
                      strokeDasharray={CIRC} strokeDashoffset={dash} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:20, color:FOREGROUND, fontWeight:700 }}>{percent.toFixed(0)}%</span>
                  </div>
                </div>
                <span style={{ fontSize:10, color:MUTED, fontWeight:400 }}>Auslastung</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI tiles — hairline borders, no color fills */}
        <div style={{ display:"flex", gap:9, padding:"12px 16px 0" }}>
          {[
            { label:"Jahresprognose", value:fmtEur(18200), accent:"#F59E0B" },
            { label:"Ausgaben",       value:fmtEur(3420),  accent:BORDER    },
            { label:"Fahrten-km",     value:"956",          accent:ACCENT    },
          ].map((k,i)=>(
            <div key={i} style={{
              flex:1, background:CARD, borderRadius:16,
              border:`1px solid ${BORDER}`,
              borderLeft:`2px solid ${k.accent}`,
              padding:"11px 11px 10px"
            }}>
              <div style={{ fontSize:18, color:FOREGROUND, fontWeight:600 }}>{k.value}</div>
              <div style={{ fontSize:10, color:MUTED, fontWeight:400, marginTop:3 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Actions — no fills on section header, clean list */}
        <div style={{ padding:"14px 16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:16, height:1.5, background:BORDER, borderRadius:1 }}/>
            <span style={{ fontSize:11, color:MUTED, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.07em" }}>
              Schnellaktionen
            </span>
          </div>
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
              {ACTIONS.map((a,i)=>{
                const isLastRow = i >= ACTIONS.length-2;
                const isRight = i%2===1;
                return (
                  <button key={i} style={{
                    height:56, padding:"0 14px", background:"transparent", border:"none", cursor:"pointer",
                    borderBottom: isLastRow ? "none" : `1px solid ${BORDER}`,
                    borderRight:  isRight   ? "none" : `1px solid ${BORDER}`,
                    display:"flex", alignItems:"center", gap:12, textAlign:"left"
                  }}>
                    <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:a.fg }}>
                      {a.icon}
                    </div>
                    <span style={{ flex:1, fontSize:14, color:FOREGROUND, fontWeight:500 }}>{a.label}</span>
                    <Chev />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
