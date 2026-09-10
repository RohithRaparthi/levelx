import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Sparkles, Lock, Zap, Search, ArrowUpRight,
  Eye, EyeOff, Flame, Star, Hexagon, ChevronRight,
} from "lucide-react";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { api } from "../api/client";
import type { AchievementItem } from "../types";

interface AchievementsPageProps {
  onSelectTeam: (teamId: number) => void;
}

/* ── HAMMER CURSOR ── */
const HAMMER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect x='14' y='18' width='5' height='12' rx='1.5' fill='%23a16207'/%3E%3Crect x='7' y='4' width='18' height='10' rx='2.5' fill='%23d97706'/%3E%3Crect x='7' y='4' width='7' height='10' rx='2' fill='%23f59e0b'/%3E%3Crect x='14' y='12' width='5' height='6' rx='1' fill='%23b45309'/%3E%3C/svg%3E") 8 28, crosshair`;

/* ── BRICK EXPLOSION ── */
interface BrickItem { x:number;y:number;w:number;h:number;vx:number;vy:number;rot:number;rotV:number;color:string;life:number;gravity:number; }
interface DustItem { x:number;y:number;vx:number;vy:number;r:number;life:number;color:string; }
const BRICK_COLORS = ["#7c3d12","#92400e","#a16207","#b45309","#c2410c","#9a3412","#78350f","#6b4226","#8a4a2f"];
const MORTAR_COLORS = ["#d6ccc2","#e8e0d5","#c8bdb0","#f0ebe5"];

function BrickExplosionCanvas({ active, onDone, width, height }: { active:boolean;onDone:()=>void;width:number;height:number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!active) return;
    doneRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = width||400, H = height||300;
    canvas.width = W; canvas.height = H;
    const cx = W/2, cy = H/2;
    const brickW=52,brickH=22,gap=4;
    const cols=Math.ceil(W/(brickW+gap))+2, rows=Math.ceil(H/(brickH+gap))+2;
    const bricks: BrickItem[] = [];
    for (let r=0;r<rows;r++) {
      const offset = r%2===0 ? 0 : (brickW+gap)/2;
      for (let c=0;c<cols;c++) {
        const bx=c*(brickW+gap)+offset-brickW/2;
        const by=r*(brickH+gap)-brickH/2;
        const dx=bx+brickW/2-cx, dy=by+brickH/2-cy;
        const dist=Math.sqrt(dx*dx+dy*dy)||1;
        const forceMag=8+Math.random()*14+(1-Math.min(dist/(Math.max(W,H)*0.7),1))*10;
        bricks.push({ x:bx, y:by, w:brickW, h:brickH,
          vx:(dx/dist)*forceMag+(Math.random()-0.5)*5,
          vy:(dy/dist)*forceMag-Math.random()*8,
          rot:Math.random()*Math.PI*2, rotV:(Math.random()-0.5)*0.3,
          color:BRICK_COLORS[Math.floor(Math.random()*BRICK_COLORS.length)],
          life:1, gravity:0.45+Math.random()*0.2 });
      }
    }
    const dusts: DustItem[] = Array.from({length:100},()=>{
      const angle=Math.random()*Math.PI*2, speed=2+Math.random()*7;
      return { x:cx+(Math.random()-0.5)*W*0.6, y:cy+(Math.random()-0.5)*H*0.6,
        vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed-Math.random()*3,
        r:4+Math.random()*14, life:1, color:MORTAR_COLORS[Math.floor(Math.random()*MORTAR_COLORS.length)] };
    });
    let alive=true;
    const animate=()=>{
      if (!alive) return;
      ctx.clearRect(0,0,W,H);
      dusts.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy; d.vy+=0.05; d.vx*=0.96; d.life-=0.02;
        if (d.life<=0) return;
        ctx.globalAlpha=d.life*0.5; ctx.fillStyle=d.color;
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r*d.life,0,Math.PI*2); ctx.fill();
      });
      bricks.forEach(b=>{
        b.x+=b.vx; b.y+=b.vy; b.vy+=b.gravity; b.vx*=0.985; b.rot+=b.rotV; b.life-=0.013;
        if (b.life<=0) return;
        ctx.globalAlpha=Math.min(b.life*1.6,1); ctx.save();
        ctx.translate(b.x+b.w/2, b.y+b.h/2); ctx.rotate(b.rot);
        ctx.fillStyle=b.color; ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h);
        ctx.strokeStyle="rgba(255,255,255,0.14)"; ctx.lineWidth=1;
        ctx.strokeRect(-b.w/2+1,-b.h/2+1,b.w-2,b.h-2); ctx.restore();
      });
      ctx.globalAlpha=1;
      if (bricks.every(b=>b.life<=0)&&dusts.every(d=>d.life<=0)) {
        alive=false; if (!doneRef.current) { doneRef.current=true; onDone(); } return;
      }
      rafRef.current=requestAnimationFrame(animate);
    };
    rafRef.current=requestAnimationFrame(animate);
    return ()=>{ alive=false; cancelAnimationFrame(rafRef.current); };
  }, [active,onDone,width,height]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{width:"100%",height:"100%"}} className="absolute inset-0 pointer-events-none z-30 rounded-3xl" />;
}

/* ── SCRAMBLE ── */
const SCHARS="!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function useScramble(finalText:string, run:boolean) {
  const [display,setDisplay]=useState("████████████████");
  const frameRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    if (!run) { setDisplay("████████████████"); return; }
    let frame=0; const totalFrames=20; const len=finalText.length;
    const tick=()=>{
      frame++;
      const rUp=Math.floor((frame/totalFrames)*len);
      const s=finalText.split("").map((ch,i)=>i<rUp?ch:SCHARS[Math.floor(Math.random()*SCHARS.length)]).join("");
      setDisplay(s);
      if (frame<totalFrames) { frameRef.current=setTimeout(tick,40); } else { setDisplay(finalText); }
    };
    tick();
    return ()=>{ if (frameRef.current) clearTimeout(frameRef.current); };
  }, [run,finalText]);
  return display;
}

/* ── VAULT DATA ── */
interface VaultCard {
  id:string; tier:number; glyphIcon:React.ComponentType<{className?:string}>;
  glyphColor:string; glowColor:string; heatLabel:string;
  teaser:string; revealLines:string[]; eligibilityHint:string;
}
const vaultCards: VaultCard[] = [
  { id:"vault-alpha", tier:1, glyphIcon:Flame, glyphColor:"text-amber-400", glowColor:"rgba(245,158,11,0.5)", heatLabel:"TIER — Omega",
    teaser:"Something legendary awaits the team that dominates every phase.",
    revealLines:["An artifact forged for the few who conquer all 300 credits.","Tangible. Physical. Permanent. Yours to keep forever.","Revealed only at the Grand Climax — live on stage."],
    eligibilityHint:"Cumulative #1 across all 3 Phases" },
  { id:"vault-beta", tier:2, glyphIcon:Zap, glyphColor:"text-blue-400", glowColor:"rgba(96,165,250,0.4)", heatLabel:"TIER — Sigma",
    teaser:"A door that does not exist for most — unlocked only for builders who go the distance.",
    revealLines:["Access to rooms most people never enter.","Resources to turn your idea into something real.","The starting line that most teams never reach."],
    eligibilityHint:"Top 3 Finalist Teams" },
  { id:"vault-gamma", tier:3, glyphIcon:Star, glyphColor:"text-emerald-400", glowColor:"rgba(52,211,153,0.4)", heatLabel:"TIER — Lambda",
    teaser:"A rare encounter with people who have already walked the path you are on.",
    revealLines:["Private conversations. Real guidance. No generic advice.","A shortcut through doors that usually take years to find.","Your name in the right rooms before you even ask."],
    eligibilityHint:"Top 5 Cumulative Podium Teams" },
  { id:"vault-delta", tier:4, glyphIcon:Hexagon, glyphColor:"text-rose-400", glowColor:"rgba(251,113,133,0.4)", heatLabel:"TIER — ???",
    teaser:"Not even the organizers will say what this one is. Sealed until the lights go up.",
    revealLines:["REDACTED.","Known only to the jury.","You will know when you see it."],
    eligibilityHint:"All Phase 3 Finalists eligible" },
];

const phases = [
  {num:1,label:"Phase 01",tag:"COMPLETE",tagColor:"bg-emerald-500/20 text-emerald-400 border-emerald-500/30",credits:100,fill:100,desc:"Foundational vector intelligence and retrieval architecture under live eval.",stat:"44 prototypes shipped"},
  {num:2,label:"Phase 02",tag:"INCOMING",tagColor:"bg-blue-500/20 text-blue-400 border-blue-500/30",credits:200,fill:0,desc:"Multi-agent orchestration and deterministic tool execution at scale.",stat:"Unlocks Phase 3 slot"},
  {num:3,label:"Phase 03",tag:"SEALED",tagColor:"bg-rose-500/20 text-rose-400 border-rose-500/30",credits:300,fill:0,desc:"Live production deployment plus Grand Climax reveal on stage.",stat:"All vaults open here"},
];

function AnimatedCounter({to,suffix=""}:{to:number;suffix?:string}) {
  const [val,setVal]=useState(0);
  useEffect(()=>{
    let start=0; const step=Math.ceil(to/40);
    const t=setInterval(()=>{ start+=step; if (start>=to){setVal(to);clearInterval(t);}else setVal(start); },30);
    return ()=>clearInterval(t);
  },[to]);
  return <>{val}{suffix}</>;
}

function useScreenShake() {
  const [shaking,setShaking]=useState(false);
  const shake=useCallback(()=>{ setShaking(true); setTimeout(()=>setShaking(false),500); },[]);
  return {shaking,shake};
}

/* ── MAIN PAGE ── */
export const AchievementsPage: React.FC<AchievementsPageProps> = ({ onSelectTeam }) => {
  const [achievements,setAchievements]=useState<AchievementItem[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const [activeTab,setActiveTab]=useState<"vaults"|"earners">("vaults");
  const [search,setSearch]=useState("");
  const [cracked,setCracked]=useState<Record<string,boolean>>({});
  const [cracking,setCracking]=useState<string|null>(null);
  const [peeked,setPeeked]=useState<Record<string,boolean>>({});
  const {shaking,shake}=useScreenShake();

  useEffect(()=>{
    setIsLoading(true);
    api.getAchievements()
      .then(res=>{ const items=Array.isArray(res)?res:(res as {items?:AchievementItem[]})?.items||[]; setAchievements(items); })
      .catch(()=>setAchievements([]))
      .finally(()=>setIsLoading(false));
  },[]);

  const handleCrack=useCallback((id:string)=>{
    if (cracked[id]||cracking) return;
    shake(); setCracking(id);
    setTimeout(()=>{ setCracked(p=>({...p,[id]:true})); setCracking(null); },1500);
  },[cracked,cracking,shake]);

  const safeAchievements=Array.isArray(achievements)?achievements:[];
  const filtered=safeAchievements.filter(a=>{
    const q=search.toLowerCase();
    return a.team_name.toLowerCase().includes(q)||(a.project_name?.toLowerCase().includes(q)??false);
  });

  return (
    <motion.div
      animate={shaking?{x:[0,-6,8,-8,6,-4,2,0],y:[0,3,-5,4,-3,2,0]}:{}}
      transition={{duration:0.45}}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14"
    >
      {/* HERO */}
      <div className="relative space-y-5">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#DF421A] opacity-[0.06] blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#DF421A] border border-[#DF421A]/30 bg-[#DF421A]/8 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DF421A] animate-pulse" />
            Classified Reward Vault
          </span>
        </div>
        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#14161B] tracking-tight leading-none">
          What is waiting<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF421A] via-amber-500 to-[#DF421A]">for you.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#5D616F] max-w-xl leading-relaxed">
          Each reward is sealed behind a wall. Double-tap any wall to smash it open and reveal what is hidden inside.
        </p>
        <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] border border-[#E8E1D5] rounded-2xl w-fit font-mono text-xs shadow-sm">
          <button onClick={()=>setActiveTab("vaults")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab==="vaults"?"bg-[#14161B] text-white shadow":"text-[#5D616F] hover:text-[#14161B]"}`}>
            <Lock className="w-3.5 h-3.5" />Sealed Vaults
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#DF421A] text-white">{vaultCards.length}</span>
          </button>
          <button onClick={()=>setActiveTab("earners")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab==="earners"?"bg-[#14161B] text-white shadow":"text-[#5D616F] hover:text-[#14161B]"}`}>
            <Sparkles className="w-3.5 h-3.5" />Phase 1 Earners
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E8E1D5] text-[#5D616F]">{safeAchievements.length}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab==="vaults" ? (
          <motion.div key="vaults" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}} className="space-y-12">

            {/* PHASE PIPELINE */}
            <section className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-[0_2px_12px_rgba(20,22,27,0.05)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#DF421A] font-bold mb-1">300-Credit Pipeline</div>
                  <h2 className="font-display font-black text-2xl text-[#14161B]">The Road to Everything</h2>
                </div>
                <div className="text-xs font-mono text-[#7E8290] hidden sm:block">Progress compounds across phases</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {phases.map((ph,i)=>(
                  <div key={ph.num} className="relative">
                    {i<phases.length-1&&<div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"><ChevronRight className="w-4 h-4 text-[#C8C0B2]" /></div>}
                    <div className={`p-5 rounded-2xl border h-full flex flex-col gap-3 ${ph.num===1?"bg-[#14161B] border-[#14161B] text-white":"bg-[#FAF7F2] border-[#E8E1D5]"}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ph.num===1?"bg-white/15 text-white border-white/20":"bg-white text-[#5D616F] border-[#E8E1D5]"}`}>{ph.label}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${ph.tagColor}`}>{ph.tag}</span>
                      </div>
                      <div>
                        <div className={`font-mono text-2xl font-black ${ph.num===1?"text-amber-400":"text-[#14161B]"}`}>{ph.credits}<span className="text-xs font-normal opacity-60 ml-1">credits</span></div>
                        <p className={`text-xs mt-1 leading-relaxed ${ph.num===1?"text-[#B7BAC6]":"text-[#5D616F]"}`}>{ph.desc}</p>
                      </div>
                      <div className={`h-1.5 rounded-full ${ph.num===1?"bg-white/10":"bg-[#E8E1D5]"}`}>
                        <motion.div initial={{width:0}} animate={{width:`${ph.fill}%`}} transition={{delay:0.3+i*0.1,duration:0.8,ease:"easeOut"}} className={`h-full rounded-full ${ph.num===1?"bg-amber-400":"bg-[#DF421A]/30"}`} />
                      </div>
                      <div className={`text-[10px] font-mono font-semibold ${ph.num===1?"text-emerald-400":"text-[#7E8290]"}`}>{ph.stat}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WALL VAULT CARDS */}
            <section className="space-y-5">
              <div className="flex items-end justify-between pb-2 border-b border-[#E8E1D5]">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#DF421A] font-bold mb-1 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />Classified Dossiers
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14161B]">Crack a Vault</h2>
                </div>
                <p className="text-xs font-mono text-[#7E8290] hidden sm:block">🔨 Double-tap any wall to smash it open</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vaultCards.map(card=>(
                  <WallVaultCard key={card.id} card={card}
                    isCracked={!!cracked[card.id]} isCracking={cracking===card.id}
                    isPeeked={!!peeked[card.id]}
                    onCrack={()=>handleCrack(card.id)}
                    onPeek={()=>setPeeked(p=>({...p,[card.id]:!p[card.id]}))} />
                ))}
              </div>
            </section>

            {/* STATS */}
            <section className="bg-[#14161B] rounded-3xl p-8 sm:p-10 text-white shadow-[0_20px_50px_-10px_rgba(20,22,27,0.3)]">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF421A] font-bold mb-6">Live Series Telemetry</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono">
                {[
                  {label:"Phase 1 High Score",val:78,suffix:".0",sub:"RAGMIND & Arise",subColor:"text-amber-400"},
                  {label:"Total Teams Active",val:60,suffix:"",sub:"260 Builders",subColor:"text-emerald-400"},
                  {label:"Credits Locked",val:200,suffix:"",sub:"Phases 2 & 3",subColor:"text-blue-400"},
                  {label:"Vault Tiers Sealed",val:3,suffix:"/4",sub:"Opens at Climax",subColor:"text-rose-400"},
                ].map(stat=>(
                  <div key={stat.label} className="space-y-1">
                    <div className="text-[9px] text-[#8C90A0] uppercase font-bold tracking-wider">{stat.label}</div>
                    <div className="text-3xl sm:text-4xl font-black text-white"><AnimatedCounter to={stat.val} suffix={stat.suffix} /></div>
                    <div className={`text-xs font-semibold ${stat.subColor}`}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="earners" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}} className="space-y-6">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-[#7E8290] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search teams or projects..." value={search} onChange={e=>setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#D6CDBF] rounded-xl text-xs sm:text-sm text-[#14161B] placeholder-[#7E8290] focus:outline-none focus:border-[#14161B] transition-colors" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#7E8290]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span><strong className="text-[#14161B]">{filtered.length}</strong> teams unlocked Phase 1</span>
              </div>
            </div>
            {isLoading ? <LoadingSpinner label="Decrypting phase records..." /> :
              filtered.length===0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E1D5]">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display font-bold text-xl text-[#14161B]">No teams found</h3>
                  <p className="text-sm text-[#5D616F] mt-2">Try clearing your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((item,idx)=>(<EarnerCard key={idx} item={item} index={idx} onSelect={()=>onSelectTeam(item.team_id)} />))}
                </div>
              )
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── WALL VAULT CARD ── */
interface WallVaultCardProps {
  card:VaultCard; isCracked:boolean; isCracking:boolean;
  isPeeked:boolean; onCrack:()=>void; onPeek:()=>void;
}

const WallVaultCard: React.FC<WallVaultCardProps> = ({card,isCracked,isCracking,isPeeked,onCrack,onPeek}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({w:400,h:300});
  const [hovering, setHovering] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const Icon = card.glyphIcon;
  const controls = useAnimation();
  const s1 = useScramble(card.revealLines[0], isCracked);
  const s2 = useScramble(card.revealLines[1], isCracked);
  const s3 = useScramble(card.revealLines[2], isCracked);

  useEffect(()=>{
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries=>{
      for (const e of entries) {
        const {width, height} = e.contentRect;
        setDims({w:Math.round(width)||400, h:Math.round(height)||300});
      }
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setDims({w:Math.round(r.width)||400, h:Math.round(r.height)||300});
    return ()=>ro.disconnect();
  },[]);

  useEffect(()=>{
    if (isCracking) {
      controls.start({
        scale:[1,1.04,0.97,1.03,0.98,1],
        rotate:[0,-2,2.5,-2,1,0],
        transition:{duration:0.65,ease:"easeInOut"}
      });
    }
  },[isCracking,controls]);

  const handleDoubleClick = () => { if (!isCracked && !isCracking) onCrack(); };
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now-lastTap < 350) handleDoubleClick();
    setLastTap(now);
  };

  return (
    <motion.div ref={cardRef} animate={controls}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={()=>setHovering(true)}
      onMouseLeave={()=>setHovering(false)}
      style={{cursor: isCracked?"default":HAMMER_CURSOR, userSelect:"none"}}
      className="relative overflow-hidden rounded-3xl"
    >

      {/* ── SEALED WALL ── */}
      <AnimatePresence>
        {!isCracked && (
          <motion.div key="wall"
            initial={{opacity:1}}
            exit={{opacity:0, scale:1.1, filter:"blur(6px)"}}
            transition={{duration:0.18}}
            className="relative flex flex-col min-h-[300px] overflow-hidden rounded-3xl border-[3px]"
            style={{background:"#7c3d12", borderColor:"#4e2009"}}
          >
            {/* horizontal mortar lines */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              backgroundImage:"repeating-linear-gradient(0deg,transparent 0px,transparent 22px,rgba(0,0,0,0.25) 22px,rgba(0,0,0,0.25) 25px)",
              backgroundSize:"100% 25px"
            }} />
            {/* vertical mortar - even rows */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              backgroundImage:"repeating-linear-gradient(90deg,transparent 0px,transparent 51px,rgba(0,0,0,0.2) 51px,rgba(0,0,0,0.2) 54px)",
              backgroundSize:"54px 50px", backgroundPosition:"0 0"
            }} />
            {/* vertical mortar - odd rows offset */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              backgroundImage:"repeating-linear-gradient(90deg,transparent 0px,transparent 51px,rgba(0,0,0,0.2) 51px,rgba(0,0,0,0.2) 54px)",
              backgroundSize:"54px 50px", backgroundPosition:"27px 25px"
            }} />
            {/* brick colour variation */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              backgroundImage:"radial-gradient(ellipse at 25% 35%,rgba(255,180,80,0.1) 0%,transparent 55%),radial-gradient(ellipse at 75% 65%,rgba(100,30,0,0.2) 0%,transparent 55%)",
            }} />
            {/* dark vignette */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

            {/* glow on hover */}
            {hovering && !isCracking && (
              <div className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
                style={{boxShadow:`inset 0 0 40px ${card.glowColor}`, opacity:0.6}} />
            )}

            {/* CONTENT ON WALL */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-10 text-center gap-5">
              <motion.div
                animate={isCracking ? {scale:[1,1.2,0.9,1.1,1],rotate:[0,-5,5,-3,0]} : hovering ? {scale:1.08} : {scale:1}}
                transition={{duration:0.5}}
                className={`p-4 rounded-2xl bg-black/35 backdrop-blur-sm border border-white/10`}
              >
                <Icon className={`w-8 h-8 ${card.glyphColor} drop-shadow-lg`} />
              </motion.div>

              <div>
                <div className="text-[10px] font-mono font-bold tracking-[0.22em] text-amber-200/70 mb-1">{card.heatLabel}</div>
                <div className="text-[10px] font-mono text-white/30">Tier {card.tier} of {vaultCards.length}</div>
              </div>

              <p className="text-white/75 text-sm leading-relaxed max-w-xs font-sans">{card.teaser}</p>

              {/* CRACK TO REVEAL stamp */}
              <div className={`relative mt-1 transition-all duration-200 ${hovering&&!isCracking?"scale-105":""}`}>
                <div className="absolute inset-0 blur-xl rounded-xl transition-all duration-300"
                  style={{background: isCracking?card.glowColor:hovering?"rgba(255,255,255,0.15)":"transparent"}} />
                <div className={`relative font-mono text-[11px] font-black tracking-[0.25em] uppercase px-5 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                  isCracking
                    ? "border-amber-400/80 text-amber-300 bg-black/60 animate-pulse"
                    : hovering
                    ? "border-white/60 text-white bg-black/50"
                    : "border-white/20 text-white/55 bg-black/30"
                }`}>
                  {isCracking ? "💥 BREAKING SEAL..." : "🔨 CRACK TO REVEAL"}
                </div>
              </div>

              {!isCracking && (
                <div className="text-[9px] font-mono tracking-widest" style={{color:"rgba(255,255,255,0.2)"}}>
                  DOUBLE-TAP TO SMASH OPEN
                </div>
              )}
            </div>

            {/* breaking progress bar */}
            {isCracking && (
              <div className="relative z-10 px-8 pb-6">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{background:`linear-gradient(90deg,${card.glowColor},#fffbe8)`}}
                    animate={{width:["0%","100%"]}} transition={{duration:1.45,ease:"easeIn"}} />
                </div>
              </div>
            )}

            {/* crack fissure SVG */}
            {isCracking && (
              <motion.svg initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.08}}
                className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                <motion.path d="M200,150 L178,88 L160,52 L191,80 L183,32"
                  stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" fill="none" strokeLinecap="round"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.42,delay:0.12}} />
                <motion.path d="M200,150 L237,96 L260,60 L242,88 L270,42"
                  stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" fill="none" strokeLinecap="round"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.36,delay:0.2}} />
                <motion.path d="M200,150 L152,180 L130,220 L150,198 L122,244"
                  stroke="rgba(255,255,255,0.68)" strokeWidth="2.2" fill="none" strokeLinecap="round"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.48,delay:0.18}} />
                <motion.path d="M200,150 L250,188 L274,230 L254,207 L282,252"
                  stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" fill="none" strokeLinecap="round"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.4,delay:0.26}} />
                <motion.path d="M200,150 L108,140 L62,136"
                  stroke="rgba(255,255,255,0.32)" strokeWidth="1.3" fill="none"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.26,delay:0.33}} />
                <motion.path d="M200,150 L298,142 L348,138"
                  stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.24,delay:0.36}} />
                <motion.path d="M200,150 L190,265 L196,298"
                  stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" fill="none"
                  initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.3,delay:0.28}} />
              </motion.svg>
            )}

            {/* Brick explosion canvas */}
            <BrickExplosionCanvas active={isCracking} onDone={()=>{}} width={dims.w} height={dims.h} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REVEALED STATE ── */}
      <AnimatePresence>
        {isCracked && (
          <motion.div key="revealed"
            initial={{opacity:0, scale:0.88, y:12}}
            animate={{opacity:1, scale:1, y:0}}
            transition={{duration:0.5, ease:"backOut"}}
            style={{boxShadow:`0 0 0 1.5px ${card.glowColor}, 0 28px 65px -12px ${card.glowColor}`}}
            className="flex flex-col min-h-[300px] rounded-3xl border-transparent bg-gradient-to-br from-[#0E1017] via-[#14161B] to-[#1A1D27] overflow-hidden"
          >
            <div className="h-1 w-full" style={{background:`linear-gradient(90deg,transparent,${card.glowColor},transparent)`}} />
            <div className="flex flex-col gap-5 p-7 sm:p-8 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl blur-lg opacity-70" style={{background:card.glowColor}} />
                    <div className="relative p-3.5 rounded-2xl bg-white/8 border border-white/15">
                      <Icon className={`w-6 h-6 ${card.glyphColor}`} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-[0.15em] text-[#8C90A0]">{card.heatLabel}</div>
                    <div className="text-[10px] font-mono text-[#5A5F70]">Tier {card.tier} of {vaultCards.length}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white/8 border-white/20 text-[10px] font-mono font-bold text-white">
                  <Sparkles className="w-3 h-3" /><span>CRACKED</span>
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 space-y-4">
                <div className="space-y-2 font-mono text-sm">
                  {[s1,s2,s3].map((line,i)=>(
                    <motion.div key={i} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
                      className="flex items-start gap-2.5 text-[#C8C8D8] leading-relaxed">
                      <span style={{color:card.glowColor}} className="text-xs mt-0.5 shrink-0">◆</span>
                      <span className={line==="REDACTED."?"blur-[3px] hover:blur-0 transition-all cursor-pointer":""}>{line}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-[#5A5F70]">
                    <span className="text-[#8C90A0] uppercase mr-2">Who:</span>
                    <span className="text-white/70">{card.eligibilityHint}</span>
                  </div>
                  <button onClick={e=>{e.stopPropagation();onPeek();}} className="flex items-center gap-1 text-[10px] font-mono text-[#5A5F70] hover:text-white transition-colors cursor-pointer">
                    {isPeeked?<EyeOff className="w-3 h-3" />:<Eye className="w-3 h-3" />}
                    {isPeeked?"Hide":"Peek"}
                  </button>
                </div>
                {isPeeked && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
                    className="text-[11px] font-mono text-[#4A4F60] bg-white/4 border border-white/8 rounded-xl p-3">
                    "{card.teaser}"
                  </motion.div>
                )}
              </div>
            </div>
            <div className="px-7 sm:px-8 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#5A5F70]">SPEC #{card.id.toUpperCase()}</span>
              <span className={`font-bold ${card.glyphColor}`}>● DECRYPTED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── EARNER CARD ── */
const RANK_GLOWS: Record<number,string> = {
  1:"shadow-[0_0_0_2px_rgba(245,158,11,0.5),0_8px_24px_-4px_rgba(245,158,11,0.2)]",
  2:"shadow-[0_0_0_2px_rgba(156,163,175,0.5),0_8px_24px_-4px_rgba(156,163,175,0.15)]",
  3:"shadow-[0_0_0_2px_rgba(180,120,80,0.5),0_8px_24px_-4px_rgba(180,120,80,0.15)]",
};
const RANK_ORBS: Record<number,string> = {
  1:"bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  2:"bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  3:"bg-gradient-to-br from-amber-700 to-amber-800 text-white",
};
interface EarnerCardProps { item:AchievementItem; index:number; onSelect:()=>void; }
const EarnerCard: React.FC<EarnerCardProps> = ({item,index,onSelect}) => {
  const rank = item.rank??0;
  const glowClass = rank>=1&&rank<=3?(RANK_GLOWS[rank]||""):"";
  const orbClass = rank>=1&&rank<=3?(RANK_ORBS[rank]||"bg-[#FAF7F2] text-[#14161B] border border-[#E8E1D5]"):"bg-[#FAF7F2] text-[#14161B] border border-[#E8E1D5]";
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:index*0.04,duration:0.3}}
      onClick={onSelect} className={`bg-white rounded-3xl border border-[#E8E1D5] p-6 cursor-pointer group hover:border-[#D6CDBF] transition-all flex flex-col justify-between ${glowClass} hover:shadow-[0_16px_36px_-8px_rgba(20,22,27,0.1)]`}>
      <div>
        <div className="flex items-center justify-between mb-5">
          {rank ? (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black font-mono ${orbClass}`}>#{rank}</div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E1D5] flex items-center justify-center"><Sparkles className="w-4 h-4 text-[#C8C0B2]" /></div>
          )}
          {item.score!==null&&item.score!==undefined&&(
            <div className="font-mono text-xs font-bold text-[#14161B] bg-[#FAF7F2] border border-[#E8E1D5] px-3 py-1 rounded-full">{item.score} <span className="text-[#7E8290] font-normal">pts</span></div>
          )}
        </div>
        <h3 className="font-display font-black text-xl text-[#14161B] group-hover:text-[#DF421A] transition-colors mb-1">{item.team_name}</h3>
        {item.project_name&&<p className="text-xs font-mono text-[#7E8290] line-clamp-1">{item.project_name}</p>}
      </div>
      <div className="pt-4 mt-4 border-t border-[#E8E1D5] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[1,2,3].map(ph=>(<div key={ph} className={`w-2 h-2 rounded-full ${ph===1?"bg-emerald-500":"bg-[#E8E1D5]"}`} />))}
          <span className="text-[10px] font-mono text-[#B7BAC6] ml-1.5">Phase 1 cleared</span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#14161B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View <ArrowUpRight className="w-3.5 h-3.5 text-[#DF421A] opacity-70" />
        </span>
      </div>
    </motion.div>
  );
};
