
/**
 * Vibe 1 — WARM & VERTRAUENSVOLL
 * Emotional register: approachable, reassuring, human.
 * Palette: burnt amber hero, warm cream surfaces, terracotta accents.
 * Shadows carry a warm tint. No cool blues anywhere.
 * Feels like a trusted financial advisor, not a cold fintech app.
 * Same structure as VariantB v2.
 */

const AMBER      = "#92400E";   // hero gradient start
const AMBER_MID  = "#B45309";
const AMBER_LITE = "#D97706";
const BG         = "#FFFDF7";   // warm white
const CARD       = "#FFFFFF";
const BORDER     = "#E7DDD0";   // warm border
const MUTED      = "#78716C";   // warm gray (stone-500)
const FOREGROUND = "#1C1917";   // warm near-black (stone-900)
const SUCCESS_FG = "#14532D";
const SUCCESS_BG = "#DCFCE7";
const SUCCESS_BAR= "#22C55E";
const WARN_FG    = "#78350F";
const WARN_BG    = "#FEF3C7";

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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

const ACTIONS = [
  { label: "Einnahme",    icon: "↑", bg: "#DCFCE7",  fg: SUCCESS_FG },
  { label: "Ausgabe",     icon: "↓", bg: WARN_BG,    fg: WARN_FG    },
  { label: "Fahrt",       icon: "⊙", bg: "#FEF3C7",  fg: "#92400E"  },
  { label: "KI fragen",   icon: "✦", bg: "#FDF4FF",  fg: "#6B21A8"  },
  { label: "Beleg-Check", icon: "◎", bg: "#FEF3C7",  fg: "#92400E"  },
  { label: "Simulation",  icon: "≈", bg: "#DCFCE7",  fg: SUCCESS_FG },
  { label: "Prognose",    icon: "⤴", bg: "#FEF3C7",  fg: "#92400E"  },
  { label: "Export",      icon: "⇪", bg: "#F5F5F4",  fg: "#57534E"  },
];

export function VibeWarm() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#EDE0D0" }}>
      <div style={{
        width:390, minHeight:844, background:BG, borderRadius:44,
        boxShadow:"0 40px 100px rgba(92,40,14,0.22), 0 8px 24px rgba(92,40,14,0.10)",
        overflow:"hidden", display:"flex", flexDirection:"column",
        fontFamily:"'Inter', system-ui, sans-serif"
      }}>

        {/* Status bar */}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"18px 22px 0" }}>
          <span style={{ fontSize:13, color:MUTED, fontWeight:600 }}>9:41</span>
          <div style={{ display:"flex", gap:4 }}>
            {[1,2,3].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:MUTED, opacity:0.45 }}/>)}
          </div>
        </div>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px 0" }}>
          <div>
            <div style={{ fontSize:12, color:MUTED, fontWeight:500, letterSpacing:"0.02em" }}>Guten Tag</div>
            <div style={{ fontSize:22, color:FOREGROUND, fontWeight:800, marginTop:2, letterSpacing:"-0.3px" }}>Max Mustermann</div>
          </div>
          <button style={{
            width:44, height:44, borderRadius:22, background:"#FFF8F0",
            border:`1.5px solid ${BORDER}`,
            boxShadow:"0 2px 8px rgba(92,40,14,0.10)",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={FOREGROUND} strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* Hero card — warm amber gradient */}
        <div style={{ margin:"14px 16px 0" }}>
          <div style={{
            background:`linear-gradient(135deg, ${AMBER_MID} 0%, ${AMBER} 100%)`,
            borderRadius:22, padding:"18px 18px 16px",
            boxShadow:"0 8px 32px rgba(180,83,9,0.30), 0 2px 8px rgba(180,83,9,0.16)",
            position:"relative", overflow:"hidden"
          }}>
            <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
            <div style={{ position:"absolute", bottom:-30, left:80, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>

            <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative" }}>
              {/* Left */}
              <div style={{ flex:1 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:SUCCESS_BG, borderRadius:20, padding:"3px 8px 3px 6px", marginBottom:10 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SUCCESS_FG} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                  <span style={{ fontSize:11, color:SUCCESS_FG, fontWeight:700 }}>Sicher</span>
                </div>
                <div style={{ fontSize:11, color:"rgba(254,243,199,0.85)", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Umsatz {new Date().getFullYear()}
                </div>
                <div style={{ fontSize:32, color:"#fff", fontWeight:800, marginTop:4, lineHeight:1, letterSpacing:"-0.5px" }}>
                  {fmtEur(ytdRevenue)}
                </div>
                <div style={{ fontSize:12, color:"rgba(254,243,199,0.65)", marginTop:4 }}>
                  von {fmtEur(limit)} (§ 19 UStG)
                </div>
                <div style={{ marginTop:12, height:10, background:"rgba(255,255,255,0.15)", borderRadius:5, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${percent}%`, background:SUCCESS_BAR, borderRadius:5 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                  <span style={{ fontSize:11, color:"rgba(254,243,199,0.7)" }}>{percent.toFixed(0)} % ausgeschöpft</span>
                  <span style={{ fontSize:11, color:SUCCESS_BAR, fontWeight:600 }}>{fmtEur(remaining)} frei</span>
                </div>
              </div>
              {/* Right ring */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
                <div style={{ position:"relative", width:86, height:86 }}>
                  <svg width="86" height="86" style={{ transform:"rotate(-90deg)" }}>
                    <circle cx="43" cy="43" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9"/>
                    <circle cx="43" cy="43" r={R} fill="none" stroke={SUCCESS_BAR} strokeWidth="9"
                      strokeDasharray={CIRC} strokeDashoffset={dash} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:20, color:"#fff", fontWeight:800 }}>{percent.toFixed(0)}%</span>
                  </div>
                </div>
                <span style={{ fontSize:10, color:"rgba(254,243,199,0.6)", fontWeight:500 }}>Auslastung</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI tiles — warm accents */}
        <div style={{ display:"flex", gap:9, padding:"12px 16px 0" }}>
          {[
            { label:"Jahresprognose", value:fmtEur(18200), accent:AMBER_LITE, bg:"#FFFBEB" },
            { label:"Ausgaben",       value:fmtEur(3420),  accent:MUTED,      bg:CARD     },
            { label:"Fahrten-km",     value:"956",          accent:AMBER_MID,  bg:"#FFF8F0"},
          ].map((k,i)=>(
            <div key={i} style={{
              flex:1, background:k.bg, borderRadius:16,
              border:`1px solid ${BORDER}`,
              boxShadow:"0 1px 4px rgba(92,40,14,0.06)",
              borderLeft:`3px solid ${k.accent}`,
              padding:"11px 11px 10px"
            }}>
              <div style={{ fontSize:18, color:FOREGROUND, fontWeight:700 }}>{k.value}</div>
              <div style={{ fontSize:10, color:MUTED, fontWeight:500, marginTop:3 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding:"14px 16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:16, height:2, background:AMBER_MID, borderRadius:1 }}/>
            <span style={{ fontSize:11, color:MUTED, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>Schnellaktionen</span>
          </div>
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, overflow:"hidden", boxShadow:"0 1px 4px rgba(92,40,14,0.05), 0 4px 16px rgba(92,40,14,0.03)" }}>
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
                    <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:a.fg }}>
                      {a.icon}
                    </div>
                    <span style={{ flex:1, fontSize:14, color:FOREGROUND, fontWeight:600 }}>{a.label}</span>
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
