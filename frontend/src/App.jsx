/**
 * YojanaSathi — Complete UI
 * Non-literacy friendly: big icons, visual cues, minimal text, warm Indian palette
 */

import { useState } from "react";

const C = {
  teal:"#0D6B63", tealMid:"#1A8A80", tealSoft:"#E6F7F5", tealDark:"#084E47",
  orange:"#F4721E", orangeSoft:"#FEF0E7",
  cream:"#FFFBF5", ink:"#1A1A2E", inkSoft:"#5777b0ff", border:"#E8EEF0",
  white:"#FFFFFF", green:"#1A7F4B", greenSoft:"#E8F5EE",
  red:"#C0392B", redSoft:"#FDECEA", amber:"#D97706", amberSoft:"#FEF3C7",
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Hind:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Hind',sans-serif;background:${C.cream};color:${C.ink};-webkit-font-smoothing:antialiased}
h1,h2,h3,.bal{font-family:'Baloo 2',cursive}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pop{0%{transform:scale(.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}

.fu{animation:fadeUp .4s ease both}
.fu1{animation:fadeUp .4s .07s ease both}
.fu2{animation:fadeUp .4s .14s ease both}
.fu3{animation:fadeUp .4s .21s ease both}
.fu4{animation:fadeUp .4s .28s ease both}
.pop{animation:pop .35s ease both}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:14px;font-family:'Baloo 2',cursive;font-weight:700;cursor:pointer;transition:transform .15s,opacity .15s,box-shadow .15s}
.btn:active{transform:scale(.96)!important}
.btn-orange{background:linear-gradient(135deg,${C.orange},#D95A0A);color:#fff;padding:15px 28px;font-size:1.05rem;box-shadow:0 5px 20px rgba(244,114,30,.38)}
.btn-orange:hover{opacity:.92;box-shadow:0 7px 26px rgba(244,114,30,.48);transform:translateY(-1px)}
.btn-teal{background:linear-gradient(135deg,${C.tealMid},${C.teal});color:#fff;padding:13px 22px;font-size:.92rem;box-shadow:0 4px 16px rgba(18, 173, 160, 0.3)}
.btn-teal:hover{opacity:.9;transform:translateY(-1px)}
.btn-ghost{background:transparent;color:${C.teal};border:2px solid ${C.teal};padding:10px 18px;font-size:.88rem}
.btn-ghost:hover{background:${C.tealSoft}}
.btn-back{background:none;border:none;color:rgba(255,255,255,.8);font-family:'Hind',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 0;transition:color .2s}
.btn-back:hover{color:#fff}

/* Chips */
.chip-wrap{display:flex;flex-wrap:wrap;gap:8px}
.chip{padding:9px 16px;border:2px solid ${C.border};border-radius:30px;font-family:'Baloo 2',cursive;font-weight:600;font-size:.88rem;cursor:pointer;transition:all .15s;background:#fff;color:${C.inkSoft}}
.chip:hover{border-color:${C.teal};color:${C.teal}}
.chip.on{background:${C.teal};border-color:${C.teal};color:#fff}

/* Form */
.field{margin-bottom:22px}
.label{font-family:'Baloo 2',cursive;font-weight:700;font-size:.95rem;color:${C.ink};margin-bottom:8px;display:flex;align-items:center;gap:6px}
.req{color:${C.orange}}
.inp,.sel{width:100%;padding:14px 16px;border:2px solid ${C.border};border-radius:14px;font-family:'Hind',sans-serif;font-size:1rem;color:${C.ink};background:#FAFAFA;outline:none;transition:border-color .2s,box-shadow .2s,background .2s;appearance:none}
.inp:focus,.sel:focus{border-color:${C.teal};background:#fff;box-shadow:0 0 0 4px rgba(13,107,99,.09)}
.sel{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%234A5568' d='M5 7L0 0h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px;cursor:pointer}
.err{color:${C.red};font-size:.78rem;margin-top:4px}

/* Profile page layout */
.pg-profile{min-height:100vh;background:linear-gradient(165deg,${C.teal} 0%,${C.tealMid} 45%,${C.tealSoft} 100%);display:flex;flex-direction:column}
.hero{padding:32px 22px 24px;color:#fff;text-align:center}
.form-card{background:#fff;border-radius:26px 26px 0 0;flex:1;padding:26px 20px 110px;box-shadow:0 -8px 40px rgba(0,0,0,.12)}

/* Results */
.res-header{background:linear-gradient(135deg,${C.teal},${C.tealMid});padding:22px 20px 44px;color:#fff}
.res-body{margin-top:-22px;background:${C.cream};border-radius:22px 22px 0 0;padding:22px 18px 80px}
.stat-row{display:flex;gap:10px;margin-top:16px}
.stat-box{flex:1;background:rgba(255,255,255,.15);border-radius:12px;padding:10px 6px;text-align:center;backdrop-filter:blur(4px)}

/* Scheme cards */
.s-card{background:#fff;border:2px solid ${C.border};border-radius:18px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;margin-bottom:10px}
.s-card:hover{border-color:${C.tealMid};box-shadow:0 6px 24px rgba(13,107,99,.1);transform:translateX(3px)}
.s-card.dim{opacity:.55;background:#FAFAFA;cursor:default}
.s-card.dim:hover{transform:none;border-color:${C.border};box-shadow:none}
.s-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.55rem;flex-shrink:0}
.s-name{font-family:'Baloo 2',cursive;font-weight:700;font-size:1rem;color:${C.ink};margin-bottom:3px}
.s-reason{font-size:.8rem;color:${C.inkSoft};line-height:1.4}
.badge{display:inline-flex;align-items:center;gap:3px;border-radius:20px;padding:3px 10px;font-size:.76rem;font-weight:700;font-family:'Baloo 2',cursive;margin-bottom:4px;white-space:nowrap}
.b-ok{background:${C.greenSoft};color:${C.green}}
.b-no{background:${C.redSoft};color:${C.red}}
.b-maybe{background:${C.amberSoft};color:${C.amber}}
.arr{color:${C.teal};font-size:1.3rem;flex-shrink:0;opacity:0;transform:translateX(-6px);transition:all .2s}
.s-card:hover .arr{opacity:1;transform:translateX(0)}

/* Detail */
.d-header{background:linear-gradient(135deg,${C.teal},${C.tealMid});padding:20px 20px 44px;color:#fff}
.d-body{background:${C.cream};border-radius:22px 22px 0 0;margin-top:-22px;padding:22px 18px 100px}
.sec{margin-bottom:34px}
.sec-title{font-family:'Baloo 2',cursive;font-weight:700;font-size:1.1rem;color:${C.ink};display:flex;align-items:center;gap:10px;margin-bottom:14px}
.sec-icon{width:32px;height:32px;border-radius:9px;background:${C.tealSoft};display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0}
.bpill{background:${C.tealSoft};border-left:4px solid ${C.teal};border-radius:0 12px 12px 0;padding:13px 16px;color:${C.teal};font-weight:600;font-size:.92rem;margin-bottom:8px;line-height:1.5}
.erow{border-radius:12px;padding:13px 16px;margin-bottom:7px;display:flex;gap:11px;align-items:flex-start}
.erow.yes{background:${C.greenSoft}}
.erow.no{background:${C.redSoft}}
.erow.maybe{background:${C.amberSoft}}
.etext{font-weight:600;font-size:.9rem}
.esub{font-size:.78rem;color:${C.inkSoft};margin-top:3px}
.doc-row{display:flex;align-items:center;gap:13px;padding:13px 15px;border-bottom:1px solid ${C.border}}
.doc-row:last-child{border-bottom:none}
.dnum{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,${C.tealMid},${C.teal});color:#fff;font-weight:800;font-size:.78rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step-row{display:flex;gap:14px;margin-bottom:18px}
.snum{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${C.tealMid},${C.teal});color:#fff;font-weight:800;font-family:'Baloo 2',cursive;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.88rem;box-shadow:0 3px 10px rgba(13,107,99,.28)}
.sline{width:2px;background:linear-gradient(${C.tealSoft},transparent);margin:4px auto 0;height:24px}
.sticky{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid ${C.border};padding:13px 18px 18px;box-shadow:0 -4px 20px rgba(0,0,0,.07)}
.safe{text-align:center;font-size:.68rem;font-weight:700;color:${C.inkSoft};letter-spacing:.08em;text-transform:uppercase;margin-top:7px}

/* Loading */
.loader-pg{min-height:100vh;background:linear-gradient(165deg,${C.teal},${C.tealMid});display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;gap:18px}
.spinner{width:42px;height:42px;border:4px solid rgba(214, 25, 25, 0.25);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}
.sec-label{font-family:'Baloo 2',cursive;font-weight:700;font-size:.78rem;color:${C.inkSoft};text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}

@media(max-width:460px){.stat-row{gap:7px}}
`;

// Data
const PROFESSIONS = [
  {v:"Farmer",c:"#1A7F4B"},{v:"Student",c:"#2563EB"},{v:"Daily Wage Worker",c:"#D97706"},
  {v:"Self-Employed",c:"#7C3AED"},{v:"Street Vendor",c:"#DC2626"},{v:"Salaried",c:"#0D6B63"},
  {v:"Homemaker",c:"#DB2777"},{v:"Unemployed",c:"#4A5568"},
];
const CATS   = ["General","OBC","SC","ST","EWS"];
const LANGS  = [{v:"English"},{v:"हिंदी"},{v:"తెలుగు"},{v:"தமிழ்"},{v:"বাংলা"},{v:"मराठी"}];
const LANG_MAP = {'English':'en','हिंदी':'hi','తెలుగు':'te','தமிழ்':'ta','বাংলা':'bn','मराठी':'mr'};
const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry"];
const INCOMES = ["Below ₹10,000 / month","₹10,000 – ₹25,000 / month","₹25,000 – ₹50,000 / month","Above ₹50,000 / month"];

// Components
function Badge({status}){
  if(status==="Eligible")    return <span className="badge b-ok">✓ Eligible</span>;
  if(status==="Not Eligible")return <span className="badge b-no">✗ Not Eligible</span>;
  return <span className="badge b-maybe">? Check Eligibility</span>;
}

// Profile Form Page
function ProfilePage({onSubmit, prefill={}}){
  const [f,setF] = useState({age:prefill.age||"",income:prefill.income||"",
    category:prefill.category||"",profession:prefill.profession||"",
    state:prefill.state||""});
  const [err,setErr] = useState({});
  const [loading,setLoading] = useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const go=async()=>{
    const e={};
    if(!f.age||f.age<1||f.age>100) e.age="Enter a valid age (1–100)";
    if(!f.income)    e.income="Please select income range";
    if(!f.category)  e.category="Please select a category";
    if(!f.profession)e.profession="Please select your profession";
    if(!f.state)     e.state="Please select your state";
    setErr(e);
    if(Object.keys(e).length) return;
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${apiUrl}/schemes/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            age: parseInt(f.age),
            income: f.income,
            category: f.category,
            occupation: f.profession,
            state: f.state,
            gender: 'male'
          },
          query: '',
          language: 'en'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const schemes = (data.results || []).map(s => ({
        id: s.id,
        icon: s.name.charAt(0).toUpperCase(),
        bg: getSchemeColor(s.id),
        name: s.name,
        status: s.ai_assessment?.status || 'Eligible',
        reason: s.ai_assessment?.reasoning || s.description?.substring(0, 100) + '...',
        benefits: [s.benefit || 'Check official website for benefits'],
        documents: Array.isArray(s.documents) ? s.documents : (s.documents || '').split(',').map(d => d.trim()).filter(d => d),
        steps: Array.isArray(s.applicationProcess) ? s.applicationProcess.map((step, i) => ({
          t: `Step ${i + 1}`,
          d: typeof step === 'string' ? step : step.description || step.title || ''
        })) : [],
        ministry: s.ministry || 'Government of India',
        desc: s.description || 'No description available',
        link: s.officialLinks?.portal || '#',
        elig: [{y: true, t: s.description || 'Check eligibility criteria'}]
      }));
      
      setLoading(false);
      onSubmit(f, schemes);
    } catch (error) {
      console.error('API Error:', error);
      setLoading(false);
      setErr({...err, api: 'Failed to fetch schemes. Please try again.'});
    }
  };
  
  const getSchemeColor = (id) => {
    const colors = ['#E8F5E9', '#FCE4EC', '#FFF8E1', '#E3F2FD', '#F3E5F5', '#E0F2F1'];
    return colors[Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length];
  };

  if(loading) return(
    <div className="loader-pg">
      <div className="spinner"/>
      <p className="bal" style={{fontSize:"1.35rem",fontWeight:800,color:"#fff"}}>Searching Schemes…</p>
      <p style={{color:"#fff",fontSize:".9rem"}}>Checking 100+ government schemes for you</p>
    </div>
  );

  return(
    <div className="pg-profile">
      <div className="hero fu">
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18}}>
          <div style={{width:40,height:40,background:"rgba(255,255,255,.2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid rgba(255,255,255,.35)"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="bal" style={{fontWeight:800,fontSize:"1.4rem",color:"#fff"}}>Yojana<span style={{color:"#A7F3D0"}}>Sathi</span></span>
        </div>
        <h1 style={{fontSize:"clamp(1.5rem,5vw,2rem)",fontWeight:800,lineHeight:1.2,marginBottom:6}}>
          Find Your Government Benefits
        </h1>
        <p style={{color:"#fff",fontSize:".92rem"}}>
          Answer a few questions — we'll find every scheme you qualify for
        </p>
      </div>

      <div className="form-card">
        {err.api&&<div style={{background:C.redSoft,border:`2px solid ${C.red}`,borderRadius:14,padding:14,marginBottom:20,color:C.red,fontWeight:600,fontSize:".9rem"}}>
          {err.api}
          <button onClick={()=>setErr({...err,api:null})} style={{marginLeft:10,background:C.red,color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:".85rem",fontWeight:700}}>
            Try Again
          </button>
        </div>}
        
        <div className="field fu1">
          <div className="label">Your Age <span className="req">*</span></div>
          <input className="inp" type="number" placeholder="e.g. 28"
            value={f.age} onChange={e=>set("age",e.target.value)}
            style={err.age?{borderColor:C.red}:{}}/>
          {err.age&&<div className="err">{err.age}</div>}
        </div>

        <div className="field fu1">
          <div className="label">Monthly Income <span className="req">*</span></div>
          <select className="sel" value={f.income} onChange={e=>set("income",e.target.value)}
            style={err.income?{borderColor:C.red}:{}}>
            <option value="">Select income range</option>
            {INCOMES.map(i=><option key={i} value={i}>{i}</option>)}
          </select>
          {err.income&&<div className="err">{err.income}</div>}
        </div>

        <div className="field fu2">
          <div className="label">Category / Caste <span className="req">*</span></div>
          <div className="chip-wrap">
            {CATS.map(c=>(
              <button key={c} className={`chip ${f.category===c?"on":""}`} onClick={()=>set("category",c)}>{c}</button>
            ))}
          </div>
          {err.category&&<div className="err" style={{marginTop:6}}>{err.category}</div>}
        </div>

        <div className="field fu2">
          <div className="label">What do you do? <span className="req">*</span></div>
          <div className="chip-wrap">
            {PROFESSIONS.map(p=>(
              <button key={p.v} className={`chip ${f.profession===p.v?"on":""}`} onClick={()=>set("profession",p.v)}>
                <span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:p.c,marginRight:6}}/>
                {p.v}
              </button>
            ))}
          </div>
          {err.profession&&<div className="err" style={{marginTop:6}}>{err.profession}</div>}
        </div>

        <div className="field fu3">
          <div className="label">Your State <span className="req">*</span></div>
          <select className="sel" value={f.state} onChange={e=>set("state",e.target.value)}
            style={err.state?{borderColor:C.red}:{}}>
            <option value="">Select your state</option>
            {STATES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          {err.state&&<div className="err">{err.state}</div>}
        </div>
      </div>

      <div className="sticky">
        <button className="btn btn-orange" style={{width:"100%",fontSize:"1.1rem",padding:"16px",borderRadius:16}} onClick={go}>
          Find My Schemes
        </button>
        <div className="safe">Private & Secure — No data stored without your consent</div>
      </div>
    </div>
  );
}

// Results Page
function ResultsPage({schemes,profile,onBack,onView}){
  const ok    = schemes.filter(s=>s.status==="Eligible");
  const maybe = schemes.filter(s=>s.status==="Potentially Eligible");
  const no    = schemes.filter(s=>s.status==="Not Eligible");

  const Section=({title,items})=>items.length===0?null:(
    <div style={{marginBottom:24}}>
      <div className="sec-label">{title} ({items.length})</div>
      {items.map((s,i)=>(
        <div key={s.id} className={`s-card fu ${s.status==="Not Eligible"?"dim":""}`}
          style={{animationDelay:`${i*.07}s`}}
          onClick={()=>s.status!=="Not Eligible"&&onView(s)}>
          <div className="s-icon" style={{background:s.bg,fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:"1.3rem",color:C.teal}}>{s.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <Badge status={s.status}/>
            <div className="s-name">{s.name}</div>
            <div className="s-reason">{s.reason}</div>
          </div>
          {s.status!=="Not Eligible"&&<div className="arr">›</div>}
        </div>
      ))}
    </div>
  );

  return(
    <div>
      <div className="res-header">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,background:"rgba(255,255,255,.2)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="bal" style={{fontWeight:800,fontSize:"1.1rem",color:"#fff"}}>Yojana<span style={{color:"#A7F3D0"}}>Sathi</span></span>
          </div>
          <button className="btn btn-ghost" style={{borderColor:"rgba(255,255,255,.4)",color:"#fff",fontSize:".82rem",padding:"8px 16px"}} onClick={onBack}>
            ← New Search
          </button>
        </div>
        <div className="fu">
          <h2 className="bal" style={{fontSize:"1.45rem",fontWeight:800,marginBottom:3}}>Found {ok.length} schemes for you!</h2>
          <p style={{opacity:.78,fontSize:".85rem"}}>{profile.profession} · {profile.state} · {profile.category}</p>
        </div>
        <div className="stat-row">
          {[{n:ok.length,l:"Eligible",c:"#A7F3D0"},{n:maybe.length,l:"Check",c:"#FED7AA"},{n:no.length,l:"Not Eligible",c:"rgba(255,255,255,.4)"}].map(s=>(
            <div key={s.l} className="stat-box">
              <div className="bal" style={{fontWeight:800,fontSize:"1.4rem",color:s.c}}>{s.n}</div>
              <div style={{fontSize:".7rem",opacity:.8,fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="res-body">
        <Section title="Eligible Now" items={ok}/>
        <Section title="Check These" items={maybe}/>
        <Section title="Not Eligible" items={no}/>
        <p style={{textAlign:"center",color:C.inkSoft,fontSize:".75rem",marginTop:8}}>
          Results are AI-generated. Verify at official government portals before applying.
        </p>
      </div>
    </div>
  );
}

// Detail Page
function DetailPage({scheme,onBack}){
  return(
    <div style={{paddingBottom:100}}>
      <div className="d-header">
        <button className="btn-back" onClick={onBack}>← Back to Results</button>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginTop:16}}>
          <div style={{width:58,height:58,background:scheme.bg,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:"1.8rem",color:C.teal,flexShrink:0}}>
            {scheme.icon}
          </div>
          <div>
            <div style={{fontSize:".7rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",background:"rgba(255,255,255,.2)",borderRadius:20,padding:"3px 10px",display:"inline-block",marginBottom:8}}>
              Government Scheme
            </div>
            <h1 className="bal" style={{fontWeight:800,fontSize:"1.25rem",lineHeight:1.3,color:"#fff"}}>{scheme.name}</h1>
            <p style={{opacity:.7,fontSize:".78rem",marginTop:3,color:"#fff"}}>{scheme.ministry}</p>
          </div>
        </div>
      </div>

      <div className="d-body">
        <div className="sec fu">
          <div className="sec-title">
            <div className="sec-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke={C.teal} strokeWidth="1.5"/>
                <path d="M8 7V11M8 5H8.005" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            What is this?
          </div>
          <p style={{color:C.inkSoft,lineHeight:1.75,marginBottom:14,fontSize:".93rem"}}>{scheme.desc}</p>
          {scheme.benefits.map((b,i)=><div key={i} className="bpill">{b}</div>)}
        </div>

        {scheme.elig&&scheme.elig.length>0&&(
          <div className="sec fu1">
            <div className="sec-title">
              <div className="sec-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 4L6 11.5L2.5 8" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Am I eligible?
            </div>
            {scheme.elig.map((e,i)=>(
              <div key={i} className={`erow ${e.y===true?"yes":e.y===false?"no":"maybe"}`}>
                <div style={{fontSize:"1.1rem",flexShrink:0}}>
                  {e.y===true?"✓":e.y===false?"✗":"?"}
                </div>
                <div>
                  <div className="etext" style={{color:e.y===true?C.green:e.y===false?C.red:C.amber}}>{e.t}</div>
                  {e.s&&<div className="esub">{e.s}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {scheme.documents&&scheme.documents.length>0&&(
          <div className="sec fu2">
            <div className="sec-title">
              <div className="sec-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 1V6H14" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Documents needed
            </div>
            <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              {scheme.documents.map((d,i)=>(
                <div key={i} className="doc-row">
                  <div className="dnum">{i+1}</div>
                  <span style={{fontWeight:500,fontSize:".92rem"}}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {scheme.steps&&scheme.steps.length>0&&(
          <div className="sec fu3">
            <div className="sec-title">
              <div className="sec-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1V15M8 1L3 6M8 1L13 6" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              How to apply
            </div>
            {scheme.steps.map((s,i)=>(
              <div key={i} className="step-row">
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div className="snum">{i+1}</div>
                  {i<scheme.steps.length-1&&<div className="sline"/>}
                </div>
                <div style={{paddingTop:4,paddingBottom:i<scheme.steps.length-1?14:0}}>
                  <div className="bal" style={{fontWeight:700,marginBottom:3}}>{s.t}</div>
                  <div style={{color:C.inkSoft,fontSize:".87rem",lineHeight:1.6}}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky">
        <a href={scheme.link} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
          <button className="btn btn-teal" style={{width:"100%",borderRadius:16,padding:"16px",fontSize:"1.02rem",fontWeight:700}}>
            Go to Official Website →
          </button>
        </a>
        <div className="safe">Safe & Secure Government Link</div>
      </div>
    </div>
  );
}

// App
export default function App(){
  const [screen,setScreen] = useState("profile");
  const [schemes,setSchemes] = useState([]);
  const [profile,setProfile] = useState({});
  const [selected,setSelected] = useState(null);

  return(
    <>
      <style>{STYLES}</style>
      {screen==="profile"&&(
        <ProfilePage prefill={profile} onSubmit={(f,r)=>{setProfile(f);setSchemes(r);setScreen("results");}}/>
      )}
      {screen==="results"&&(
        <ResultsPage schemes={schemes} profile={profile}
          onBack={()=>setScreen("profile")}
          onView={s=>{setSelected(s);setScreen("detail");}}/>
      )}
      {screen==="detail"&&selected&&(
        <DetailPage scheme={selected} onBack={()=>setScreen("results")}/>
      )}
    </>
  );
}
