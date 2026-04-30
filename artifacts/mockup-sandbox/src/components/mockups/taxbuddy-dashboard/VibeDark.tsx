
/**
 * Vibe 2 — DARK & PREMIUM
 * Emotional register: authoritative, sophisticated, high-stakes.
 * Palette: near-black surfaces, electric indigo-blue accents, luminous glows.
 * Feels like a Bloomberg terminal meets Vercel dashboard.
 * Same structure as VariantB v2.
 */

const ACCENT     = "#6366F1";   // indigo-500 — electric, premium
const ACCENT_LIT = "#818CF8";   // indigo-400
const SUCCESS    = "#34D399";   // emerald on dark
const SUCCESS_FG = "#065F46";
const SUCCESS_BG = "#D1FAE5";
const WARN       = "#FBBF24";   // amber on dark

const BG         = "#0B0F1A";   // deepest navy
const SURFACE    = "#111827";   // card surface
const SURFACE2   = "#1E2536";   // elevated card
const BORDER     = "#1F2D45";   // subtle separation
const MUTED      = "#94A3B8";   // slate-400 (4.5:1 on #111827)
const FOREGROUND = "#F1F5F9";   // slate-100

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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

const ACTIONS = [
  { label:"Einnahme",    icon:"↑", bg:"#064E3B", fg:SUCCESS       },
  { label:"Ausgabe",     icon:"↓", bg:"#451A03", fg:WARN           },
  { label:"Fahrt",       icon:"⊙", bg:"#1E1B4B", fg:ACCENT_LIT    },
  { label:"KI fragen",   icon:"✦", bg:"#2E1065", fg:"#C084FC"     },
  { label:"Beleg-Check", icon:"◎", bg:"#1E1B4B", fg:ACCENT_LIT    },
  { label:"Simulation",  icon:"≈", bg:"#064E3B", fg:SUCCESS        },
  { label:"Prognose",    icon:"⤴", bg:"#1E1B4B", fg:ACCENT_LIT    },
  { label:"Export",      icon:"⇪", bg:"#1E293B", fg:MUTED         },
];

export function VibeDark() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#050810" }}>
      <div style={{
        width:390, minHeight:844, background:BG, borderRadius:44,
        boxShadow:`0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${BORDER}`,
        overflow:"hidden", display:"flex", flexDirection:"column",
        fontFamily:"'Inter', system-ui, sans-serif"
      }}>

        {/* Status bar */}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"18px 22px 0" }}>
          <span style={{ fontSize:13, color:MUTED, fontWeight:600 }}>9:41</span>
          <div style={{ display:"flex", gap:4 }}>
            {[1,2,3].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:MUTED, opacity:0.4 }}/>)}
          </div>
        </div>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px 0" }}>
          <div>
            <div style={{ fontSize:12, color:MUTED, fontWeight:500 }}>Guten Tag</div>
            <div style={{ fontSize:22, color:FOREGROUND, fontWeight:800, marginTop:2, letterSpacing:"-0.3px" }}>Max Mustermann</div>
          </div>
          <button style={{
            width:44, height:44, borderRadius:22, background:SURFACE2,
            border:`1px solid ${BORDER}`,
            boxShadow:"0 2px 12px rgba(0,0,0,0.4)",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
        </div>

        {/* Hero card — dark with electric glow */}
        <div style={{ margin:"14px 16px 0" }}>
          <div style={{
            background:`linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)`,
            borderRadius:22, padding:"18px 18px 16px",
            boxShadow:`0 0 0 1px ${BORDER}, 0 8px 32px rgba(99,102,241,0.20), 0 2px 8px rgba(0,0,0,0.5)`,
            position:"relative", overflow:"hidden"
          }}>
            {/* Glow orb */}
            <div style={{ position:"absolute", top:-60, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(99,102,241,0.12)", filter:"blur(30px)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", bottom:-40, left:60, width:120, height:120, borderRadius:"50%", background:"rgba(99,102,241,0.07)", filter:"blur(20px)", pointerEvents:"none" }}/>

            <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative" }}>
              {/* Left */}
              <div style={{ flex:1 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(52,211,153,0.12)", border:"1px solid rgba(52,211,153,0.2)", borderRadius:20, padding:"3px 8px 3px 6px", marginBottom:10 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SUCCESS} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                  <span style={{ fontSize:11, color:SUCCESS, fontWeight:700 }}>Sicher</span>
                </div>
                <div style={{ fontSize:11, color:MUTED, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Umsatz {new Date().getFullYear()}
                </div>
                <div style={{ fontSize:32, color:FOREGROUND, fontWeight:800, marginTop:4, lineHeight:1, letterSpacing:"-0.5px" }}>
                  {fmtEur(ytdRevenue)}
                </div>
                <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>
                  von {fmtEur(limit)} (§ 19 UStG)
                </div>
                <div style={{ marginTop:12, height:10, background:"rgba(255,255,255,0.06)", borderRadius:5, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${percent}%`, background:SUCCESS, borderRadius:5, boxShadow:`0 0 8px rgba(52,211,153,0.6)` }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                  <span style={{ fontSize:11, color:"#475569" }}>{percent.toFixed(0)} % ausgeschöpft</span>
                  <span style={{ fontSize:11, color:SUCCESS, fontWeight:600 }}>{fmtEur(remaining)} frei</span>
                </div>
              </div>
              {/* Right ring */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
                <div style={{ position:"relative", width:86, height:86 }}>
                  <svg width="86" height="86" style={{ transform:"rotate(-90deg)" }}>
                    <circle cx="43" cy="43" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
                    <circle cx="43" cy="43" r={R} fill="none" stroke={SUCCESS} strokeWidth="9"
                      strokeDasharray={CIRC} strokeDashoffset={dash} strokeLinecap="round"
                      style={{ filter:"drop-shadow(0 0 6px rgba(52,211,153,0.7))" }}/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:20, color:FOREGROUND, fontWeight:800 }}>{percent.toFixed(0)}%</span>
                  </div>
                </div>
                <span style={{ fontSize:10, color:MUTED, fontWeight:500 }}>Auslastung</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI tiles */}
        <div style={{ display:"flex", gap:9, padding:"12px 16px 0" }}>
          {[
            { label:"Jahresprognose", value:fmtEur(18200), accent:WARN,    bg:SURFACE2 },
            { label:"Ausgaben",       value:fmtEur(3420),  accent:MUTED,   bg:SURFACE2 },
            { label:"Fahrten-km",     value:"956",          accent:ACCENT,  bg:SURFACE2 },
          ].map((k,i)=>(
            <div key={i} style={{
              flex:1, background:k.bg, borderRadius:16,
              border:`1px solid ${BORDER}`,
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
            <div style={{ width:16, height:2, background:ACCENT, borderRadius:1 }}/>
            <span style={{ fontSize:11, color:MUTED, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>Schnellaktionen</span>
          </div>
          <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:20, overflow:"hidden" }}>
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
