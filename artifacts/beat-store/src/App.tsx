import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "#D4AF37";

/* ── Types ── */
interface BeatTier { earlyPrice: number; tierSales: number; salesCount: number; }
interface Beat {
  id: number; name: string; bpm: number; key: string; genre: string;
  price: number; tag: string; img: string; category: "beat" | "loop-kit" | "sample-pack";
  mood?: string; artistType?: string; featured?: boolean; freeDownload?: boolean;
  soldOut?: boolean; tier?: BeatTier; vault?: boolean;
}
interface SocialLinks { youtube: string; instagram: string; tiktok: string; whatsapp: string; }
interface AdminSettings {
  socialLinks: SocialLinks; logoImage: string; announcementText: string;
  discountCodes: { code: string; percent: number }[];
  basicPrice: number; premiumPrice: number; exclusivePrice: number;
}
type Page = "home" | "store" | "licensing" | "tips" | "inner-circle" | "vault";
type Theme = "dark" | "light";

/* ── Beats Data ── */
const beatsData: Beat[] = [
  { id:1,  name:"Dark Ritual",    bpm:145, key:"F Minor",  genre:"Trap",    price:349, tag:"BEAT", img:"https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=400&q=80", category:"beat", mood:"Dark",      artistType:"Meek Mill Type", tier:{ earlyPrice:199, tierSales:5, salesCount:3 } },
  { id:2,  name:"Midnight Vibes", bpm:72,  key:"G Minor",  genre:"Trapsoul",price:349, tag:"BEAT", img:"https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=400&q=80", category:"beat", mood:"Chill",    artistType:"Drake Type",     tier:{ earlyPrice:249, tierSales:5, salesCount:4 }, featured:true },
  { id:3,  name:"Soulfire",       bpm:80,  key:"C# Minor", genre:"RnB",     price:299, tag:"BEAT", img:"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", category:"beat", mood:"Emotional",artistType:"Bryson Tiller Type" },
  { id:4,  name:"Crown Season",   bpm:140, key:"A Minor",  genre:"Trap",    price:349, tag:"BEAT", img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80", category:"beat", mood:"Aggressive",artistType:"Gunna Type",    tier:{ earlyPrice:199, tierSales:5, salesCount:1 } },
  { id:5,  name:"Velvet Dreams",  bpm:68,  key:"Bb Major", genre:"Trapsoul",price:299, tag:"BEAT", img:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80", category:"beat", mood:"Romantic",  artistType:"Summer Walker Type" },
  { id:6,  name:"Gold Rush",      bpm:135, key:"D Minor",  genre:"Trap",    price:349, tag:"BEAT", img:"https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80", category:"beat", mood:"Hype",      artistType:"Lil Baby Type" },
  { id:7,  name:"Trench Talk",    bpm:148, key:"E Minor",  genre:"Hip Hop", price:299, tag:"BEAT", img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", category:"beat", mood:"Street",    artistType:"Polo G Type",   tier:{ earlyPrice:149, tierSales:5, salesCount:5 } },
  { id:8,  name:"Late Night",     bpm:76,  key:"G# Minor", genre:"RnB",     price:299, tag:"BEAT", img:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80", category:"beat", mood:"Smooth",   artistType:"H.E.R. Type" },
  { id:9,  name:"Blessed Up",     bpm:78,  key:"C Major",  genre:"Trapsoul",price:349, tag:"BEAT", img:"https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80", category:"beat", mood:"Uplifting", artistType:"Brent Faiyaz Type" },
  { id:10, name:"808 Nightmares", bpm:150, key:"B Minor",  genre:"Trap",    price:299, tag:"BEAT", img:"https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&q=80", category:"beat", mood:"Dark",      artistType:"Lil Durk Type" },
  // Vault Beats
  { id:21, name:"MS Vol.2 — Abyss",      bpm:138, key:"F# Minor", genre:"Trap",    price:399, tag:"VAULT", img:"https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80", category:"beat", mood:"Dark",  artistType:"Travis Scott Type", vault:true, tier:{ earlyPrice:249, tierSales:5, salesCount:1 } },
  { id:22, name:"MS Vol.2 — Eclipse",    bpm:74,  key:"Db Major", genre:"Trapsoul",price:349, tag:"VAULT", img:"https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80", category:"beat", mood:"Emotional", artistType:"Drake Type", vault:true },
  { id:23, name:"MS Vol.2 — Obsidian",   bpm:142, key:"C Minor",  genre:"Trap",    price:449, tag:"VAULT", img:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80", category:"beat", mood:"Aggressive", artistType:"Future Type", vault:true, featured:true },
  // Loop Kits
  { id:11, name:"Afro Drip Kit",         bpm:112, key:"A Major",  genre:"Afrobeats",price:199,tag:"KIT",   img:"https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=400&q=80", category:"loop-kit", mood:"Vibe", freeDownload:true },
  { id:12, name:"Trap Essentials",       bpm:140, key:"F# Minor", genre:"Trap",    price:249, tag:"KIT",   img:"https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=400&q=80", category:"loop-kit", mood:"Dark" },
  // Sample Packs
  { id:13, name:"Soul Sessions",         bpm:85,  key:"Eb Major", genre:"RnB",     price:299, tag:"PACK",  img:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80", category:"sample-pack", mood:"Soulful" },
  { id:14, name:"808 Vault",             bpm:0,   key:"Various",  genre:"Trap",    price:149, tag:"PACK",  img:"https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&q=80", category:"sample-pack", mood:"Hard", soldOut:true },
];

const artistCredits = [
  { artist:"@ArtistKofi",    song:"Loyal (feat. DTR)",    beat:"Midnight Vibes",    genre:"Trapsoul", streams:"12K",  img:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80" },
  { artist:"@TamaraSounds",  song:"Gold Season",          beat:"Gold Rush",          genre:"Trap",    streams:"8.4K", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" },
  { artist:"@PrinceVelvet",  song:"After Hours EP",       beat:"Velvet Dreams",      genre:"RnB",     streams:"22K",  img:"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80" },
  { artist:"@SoulMoverSA",   song:"Trench Chronicles",    beat:"Trench Talk",        genre:"Hip Hop", streams:"5.1K", img:"https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&q=80" },
];

const tipsArticles = [
  { id:1, cat:"Mixing Tip", title:"How to get your 808s to hit on phone speakers", excerpt:"Sidechain compression is the key — but there's more to it than just ducking the kick.", readTime:"4 min", icon:"🎛️" },
  { id:2, cat:"Industry News", title:"Streaming royalties explained: What producers need to know in 2026", excerpt:"Platforms have changed payout structures. Here's exactly how much you earn per stream.", readTime:"6 min", icon:"📰" },
  { id:3, cat:"Licensing Education", title:"Lease vs Exclusive: A practical guide for artists", excerpt:"You've seen the price difference — but what does it actually mean for your career?", readTime:"5 min", icon:"📋" },
  { id:4, cat:"Mixing Tip", title:"Mixing vocals over a leased beat: step-by-step workflow", excerpt:"Setting levels, EQ carve-outs, and reverb staging — a complete workflow.", readTime:"7 min", icon:"🎤" },
  { id:5, cat:"Production", title:"Understanding BPM and key — why they matter", excerpt:"Not all beats at 140 BPM sound the same. Key centre and mode affect your vocal fit.", readTime:"3 min", icon:"🎵" },
  { id:6, cat:"Industry News", title:"South African artists on the global stage: 2026", excerpt:"From Afrobeats crossover to Trapsoul exports — how SA producers are breaking international markets.", readTime:"5 min", icon:"🌍" },
];

const defaultAdmin: AdminSettings = {
  socialLinks: { youtube:"https://youtube.com", instagram:"https://instagram.com", tiktok:"https://tiktok.com", whatsapp:"https://wa.me/" },
  logoImage: "",
  announcementText: "🔥 New Drops Every Friday  •  First 5 buyers get early pricing — act fast  •  Use code DTRFAN for 15% off  •  Midnight Secrets Vol. 2 — Vault open now",
  discountCodes: [{ code:"DTRFAN", percent:15 },{ code:"FIRSTBEAT", percent:10 },{ code:"INNER15", percent:15 }],
  basicPrice:299, premiumPrice:599, exclusivePrice:2999,
};

const VAULT_PASSWORD = "MIDNIGHTSECRETS";
function fmt(n:number){ return "R\u00a0"+Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,","); }

/* ── PayFast Payment Integration ── */
const PAYFAST_MERCHANT_ID = "10000100"; // ← Replace with your PayFast Merchant ID
const PAYFAST_MERCHANT_KEY = "46f0cd694581a"; // ← Replace with your PayFast Merchant Key
const PAYFAST_SANDBOX = true; // ← Set to false when going live

function submitPayFastPayment(items: Beat[], totalAmount: number, firstName: string, lastName: string, email: string) {
  const baseUrl = PAYFAST_SANDBOX
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
  const domain = window.location.origin;
  const params: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${domain}/?payment=success`,
    cancel_url: `${domain}/?payment=cancelled`,
    notify_url: `${domain}/api/payment/notify`,
    name_first: firstName || "Customer",
    name_last: lastName || "Buyer",
    email_address: email || "customer@example.com",
    m_payment_id: `DTR-${Date.now()}`,
    amount: totalAmount.toFixed(2),
    item_name: items.length === 1 ? items[0].name : `${items.length} Beats — Dee Tracks Records`,
    item_description: items.map(b => b.name).join(", ").substring(0, 255),
  };
  const form = document.createElement("form");
  form.method = "POST";
  form.action = baseUrl;
  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

/* ── Waveform ── */
function Waveform({ playing, progress }:{ playing:boolean; progress:number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bars = useRef<number[]>([]);
  if (!bars.current.length) bars.current = Array.from({length:50}, ()=>0.2+Math.random()*0.8);
  useEffect(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d"); if(!ctx) return;
    const W=c.width, H=c.height; ctx.clearRect(0,0,W,H);
    const bw = W/bars.current.length-1;
    const played = Math.floor((progress/100)*bars.current.length);
    bars.current.forEach((h,i)=>{
      const x=i*(bw+1), bh=h*H*0.85, y=(H-bh)/2;
      ctx.fillStyle = i<played ? GOLD : playing?"rgba(212,175,55,0.3)":"rgba(255,255,255,0.15)";
      ctx.beginPath(); ctx.roundRect(x,y,bw,bh,1.5); ctx.fill();
    });
  },[progress,playing]);
  return <canvas ref={canvasRef} width={200} height={36} style={{width:"100%",height:36}} />;
}

/* ── VU Meter ── */
function VUMeter({ active }:{ active:boolean }) {
  const bars = 10;
  return (
    <div style={{display:"flex",gap:2,alignItems:"flex-end",height:28}}>
      {Array.from({length:bars},(_, i)=>(
        <motion.div key={i}
          animate={active ? { height:[6,6+Math.random()*14,6+Math.random()*20,6+Math.random()*10,6] } : { height:4 }}
          transition={active ? { duration:0.4+Math.random()*0.3, repeat:Infinity, ease:"easeInOut", delay:i*0.05 } : {}}
          style={{ width:4, borderRadius:2, background: i<6 ? "#4ade80" : i<8 ? "#facc15" : "#ef4444", minHeight:4 }}
        />
      ))}
    </div>
  );
}

/* ── TieredPriceBar ── */
function TieredPriceBar({ tier, C }:{ tier:BeatTier; C:any }) {
  const pct = Math.min((tier.salesCount/tier.tierSales)*100,100);
  const left = tier.tierSales - tier.salesCount;
  const sold = tier.salesCount >= tier.tierSales;
  return (
    <div style={{ marginTop:8, padding:"10px 12px", background:"rgba(212,175,55,0.05)", border:"1px solid rgba(212,175,55,0.15)", borderRadius:10 }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:6}}>
        <div>
          <div style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{sold?"Standard Price Active":"Early Buyer Price"}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontSize:18,fontWeight:800,color:sold?C.muted:GOLD}}>{sold?<span style={{textDecoration:"none"}}></span>:fmt(tier.earlyPrice)}</span>
            {!sold && <span style={{fontSize:11,color:C.muted,textDecoration:"line-through"}}>{fmt(9999)}</span>}
          </div>
        </div>
        {!sold && (
          <div style={{textAlign:"right"}}>
            <motion.div animate={{opacity:[1,0.5,1]}} transition={{duration:1.2,repeat:Infinity}} style={{display:"flex",alignItems:"center",gap:4,color:"#f97316",fontSize:11,fontWeight:700}}>
              🔥 {left} slot{left!==1?"s":""} left
            </motion.div>
          </div>
        )}
        {sold && <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>Standard price now active</div>}
      </div>
      <div style={{position:"relative",height:5,background:"rgba(255,255,255,0.06)",borderRadius:999,overflow:"hidden"}}>
        <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.2,ease:"easeOut"}}
          style={{position:"absolute",inset:"0 auto 0 0",background:"linear-gradient(90deg,#c2410c,#f97316,#fbbf24)",borderRadius:999}}/>
      </div>
      <div style={{marginTop:6,fontSize:9,color:C.muted,display:"flex",gap:3,alignItems:"flex-start"}}>
        <span style={{flexShrink:0}}>ℹ</span>
        <span>Once {tier.tierSales} licenses are claimed, price rises to standard rate.</span>
      </div>
    </div>
  );
}

/* ── Frequency Visualizer ── */
function FreqVisualizer({ active }:{ active:boolean }) {
  if(!active) return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:68,left:0,right:0,display:"flex",alignItems:"flex-end",justifyContent:"center",gap:2,padding:"0 12px",opacity:0.18}}>
        {Array.from({length:64},(_,i)=>(
          <motion.div key={i} animate={{height:[4,4+Math.random()*80,4+Math.random()*120,4+Math.random()*60,4]}}
            transition={{duration:0.3+Math.random()*0.3,repeat:Infinity,ease:"easeInOut",delay:i*0.02}}
            style={{flex:1,background:`hsl(${44+i*1.2},80%,${50+i*0.5}%)`,borderRadius:"2px 2px 0 0",minHeight:4}}/>
        ))}
      </div>
    </div>
  );
}

/* ── PDF License Generator ── */
function generateLicensePDF(beat: Beat, buyerName: string, licenseType: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 794; canvas.height = 1123;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0,0,794,1123);
  ctx.fillStyle = "#D4AF37"; ctx.fillRect(0,0,794,6);
  ctx.fillStyle = "#D4AF37"; ctx.font = "bold 28px serif";
  ctx.fillText("DEE TRACKS RECORDS", 60, 80);
  ctx.fillStyle = "#ffffff"; ctx.font = "22px serif";
  ctx.fillText("LICENSE AGREEMENT", 60, 118);
  ctx.fillStyle = "#333"; ctx.fillRect(60, 132, 674, 1);
  const rows:[string,string][] = [
    ["Beat Title:", beat.name],["Artist / Licensee:", buyerName || "Guest Buyer"],
    ["License Type:", licenseType],["Date Issued:", new Date().toLocaleDateString("en-ZA")],
    ["BPM:", String(beat.bpm > 0 ? beat.bpm : "N/A")],["Key:", beat.key],
    ["Genre:", beat.genre],["Producer:", "Dee Tracks Records"],
  ];
  rows.forEach(([label,val],i)=>{
    const y = 180 + i*48;
    ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.fillText(label.toUpperCase(),60,y);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 15px sans-serif"; ctx.fillText(val,60,y+20);
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(60,y+28,674,1);
  });
  const terms = [`By purchasing this license, the licensee (the buyer) is granted the rights specified under the ${licenseType} tier.`,`This license is non-transferable and applies only to the licensee named above.`,`"${beat.name}" is a production of Dee Tracks Records. All rights reserved.`,"For exclusive rights or custom clearance, contact via WhatsApp."];
  ctx.fillStyle = "#999"; ctx.font = "11px sans-serif";
  terms.forEach((t,i) => ctx.fillText(t, 60, 600 + i*28));
  ctx.fillStyle = "#D4AF37"; ctx.font = "bold 13px sans-serif";
  ctx.fillText("Dee Tracks Records", 60, 1050);
  ctx.fillStyle = "#666"; ctx.font = "10px sans-serif";
  ctx.fillText("www.deetracksrecords.com  •  dtrAdmin2026  •  © 2026", 60, 1070);
  const link = document.createElement("a");
  link.download = `DTR_License_${beat.name.replace(/\s/g,"_")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ═══════════ MAIN APP ═══════════ */
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [theme, setTheme] = useState<Theme>("dark");
  const [storeTab, setStoreTab] = useState<"beat"|"loop-kit"|"sample-pack">("beat");
  const [genre, setGenre] = useState("all");
  const [keyFilter, setKeyFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [artistTypeFilter, setArtistTypeFilter] = useState("all");
  const [similarTo, setSimilarTo] = useState<Beat|null>(null);
  const [cart, setCart] = useState<Beat[]>([]);
  const [wishlist, setWishlist] = useState<Beat[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [playing, setPlaying] = useState<Beat|null>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [vocalPocket, setVocalPocket] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [toast, setToast] = useState(""); const [toastVisible, setToastVisible] = useState(false);
  const progressTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<"login"|"signup">("login");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [purchasedBeat, setPurchasedBeat] = useState<Beat|null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadGenre, setLeadGenre] = useState<"Trap"|"RnB"|"Trapsoul"|"">(""); 
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{code:string;percent:number}|null>(null);
  const [vaultInput, setVaultInput] = useState("");
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [admin, setAdmin] = useState<AdminSettings>(defaultAdmin);
  const ADMIN_PASSWORD = "dtrAdmin2026";

  const C = theme==="dark" ? {
    bg:"#0a0a0a",card:"#111111",card2:"#161616",border:"rgba(255,255,255,0.08)",
    text:"#f0f0f0",muted:"#666666",navBg:"rgba(10,10,10,0.9)",footerBg:"#111",
    inputBg:"rgba(255,255,255,0.05)",inputBorder:"rgba(255,255,255,0.1)",
  } : {
    bg:"#f8f6f0",card:"#ffffff",card2:"#f0ede4",border:"rgba(0,0,0,0.08)",
    text:"#111111",muted:"#777777",navBg:"rgba(248,246,240,0.95)",footerBg:"#f0ede4",
    inputBg:"rgba(0,0,0,0.04)",inputBorder:"rgba(0,0,0,0.12)",
  };

  const showToast = useCallback((msg:string)=>{ setToast(msg);setToastVisible(true);setTimeout(()=>setToastVisible(false),3500); },[]);

  /* Buy 2 Get 1 Free: if cart has 3+ beats, apply 33% auto-discount on top */
  const buy2get1Active = cart.filter(b=>b.category==="beat").length >= 3;
  const discountMult = appliedDiscount ? 1-appliedDiscount.percent/100 : 1;
  const b2g1Mult = buy2get1Active ? (2/3) : 1;
  const cartSubtotal = cart.reduce((s,b)=>s+b.price,0);
  const cartTotal = cartSubtotal * discountMult * b2g1Mult;

  const allKeys = [...new Set(beatsData.filter(b=>b.category===storeTab && !b.vault).map(b=>b.key))].sort();
  const allMoods = [...new Set(beatsData.filter(b=>b.category===storeTab && !b.vault && b.mood).map(b=>b.mood!))].sort();
  const allArtistTypes = [...new Set(beatsData.filter(b=>b.category===storeTab && !b.vault && b.artistType).map(b=>b.artistType!))].sort();

  const base = similarTo
    ? beatsData.filter(b=>!b.vault && (b.genre===similarTo.genre || b.mood===similarTo.mood || Math.abs(b.bpm-similarTo.bpm)<20) && b.id!==similarTo.id)
    : beatsData.filter(b=>{
        if(b.vault) return false;
        if(b.category!==storeTab) return false;
        if(genre!=="all" && b.genre!==genre) return false;
        if(keyFilter!=="all" && b.key!==keyFilter) return false;
        if(moodFilter!=="all" && b.mood!==moodFilter) return false;
        if(artistTypeFilter!=="all" && b.artistType!==artistTypeFilter) return false;
        return true;
      });

  const addToCart = (id:number)=>{
    const b = beatsData.find(x=>x.id===id); if(!b||b.soldOut) return;
    if(cart.find(x=>x.id===id)){showToast("Already in cart!");return;}
    setCart(prev=>[...prev,b]);
    if(cart.filter(c=>c.category==="beat").length===2) showToast("🎉 Add 1 more beat — Buy 2 Get 1 Free activates!");
    else showToast(`🛒 ${b.name} added!`);
  };
  const removeFromCart=(id:number)=>setCart(prev=>prev.filter(x=>x.id!==id));
  const toggleWishlist=(id:number)=>{
    const b=beatsData.find(x=>x.id===id); if(!b) return;
    if(wishlist.find(x=>x.id===id)){setWishlist(prev=>prev.filter(x=>x.id!==id));showToast("Removed from wishlist");}
    else{setWishlist(prev=>[...prev,b]);showToast("❤️ Added to wishlist!");}
  };
  const inWishlist=(id:number)=>wishlist.some(x=>x.id===id);

  const applyDiscount=()=>{
    const found=admin.discountCodes.find(d=>d.code===discountInput.trim().toUpperCase());
    if(found){setAppliedDiscount(found);showToast(`✅ ${found.code} — ${found.percent}% off!`);}
    else showToast("❌ Invalid code.");
  };

  const playBeat=(id:number)=>{
    const b=beatsData.find(x=>x.id===id); if(!b) return;
    if(progressTimerRef.current) clearInterval(progressTimerRef.current);
    setPlaying(b);setPaused(false);setProgress(0);
    progressTimerRef.current=setInterval(()=>setProgress(p=>{
      if(p>=100){clearInterval(progressTimerRef.current!);return 100;}return p+0.4;
    }),120);
  };
  const stopPlay=()=>{if(progressTimerRef.current)clearInterval(progressTimerRef.current);setPlaying(null);setProgress(0);};
  const togglePlayPause=()=>{
    if(paused){setPaused(false);progressTimerRef.current=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(progressTimerRef.current!);return 100;}return p+0.4;}),120);}
    else{setPaused(true);if(progressTimerRef.current)clearInterval(progressTimerRef.current);}
  };

  const handleCheckout=()=>{
    const firstBeat=cart.find(b=>b.category==="beat")||cart[0]||null;
    setPurchasedBeat(firstBeat); setCartOpen(false); setPaymentOpen(true);
  };
  const handleAdminLogin=()=>{
    if(adminKey===ADMIN_PASSWORD){setAdminAuthed(true);setAdminOpen(true);setAccountOpen(false);}
    else showToast("❌ Incorrect admin password.");
  };
  const goToPage=(p:Page)=>{setSimilarTo(null);setPage(p);window.scrollTo({top:0,behavior:"smooth"});};
  const tryVault=()=>{
    if(vaultInput.trim().toUpperCase()===VAULT_PASSWORD){setVaultUnlocked(true);showToast("🔓 Vault unlocked! Welcome.");}
    else showToast("❌ Wrong password. Sign up to get the vault key.");
  };

  useEffect(()=>()=>{if(progressTimerRef.current)clearInterval(progressTimerRef.current);},[]);

  const navLinks:[{key:Page;label:string}] = [
    {key:"home",label:"Home"},{key:"store",label:"Beat Store"},{key:"licensing",label:"Licensing"},
    {key:"tips",label:"Tips & Knowledge"},{key:"inner-circle",label:"Inner Circle"},{key:"vault",label:"🔒 Vault"},
  ] as any;

  const themeIcon = theme==="dark"
    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;

  return (
    <div style={{background:C.bg,color:C.text,fontFamily:"'Inter',sans-serif",minHeight:"100vh",lineHeight:1.6,transition:"background 0.3s,color 0.3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.3);border-radius:3px}
        @keyframes marquee{from{transform:translateX(100vw)}to{transform:translateX(-100%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ann-inner{display:inline-block;white-space:nowrap;animation:marquee 30s linear infinite}
        .logo-disc{animation:spin 12s linear infinite}
        @keyframes logoShimmer{0%{background-position:0% center}50%{background-position:100% center}100%{background-position:0% center}}
        .logo-text-main{animation:logoShimmer 2.5s ease-in-out infinite;background-size:300% auto}
        .beat-card{transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s}
        .beat-card:hover{transform:translateY(-4px)}
        .beat-overlay{opacity:0;transition:opacity 0.3s}
        .beat-card:hover .beat-overlay{opacity:1!important}
        .beat-img{transition:transform 0.5s,opacity 0.3s}
        .beat-card:hover .beat-img{transform:scale(1.05);opacity:0.9!important}
        .btn-gold{transition:transform 0.2s,box-shadow 0.2s}
        .btn-gold:hover{transform:scale(1.03);box-shadow:0 0 50px rgba(212,175,55,0.4)!important}
        .nav-link{text-decoration:none;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;background:none;border:none;transition:color 0.2s;padding:4px 0}
        .nav-link:hover,.nav-link.active{color:${GOLD}!important}
        .icon-btn{background:none;border:none;cursor:pointer;padding:8px;transition:color 0.2s;display:flex;align-items:center;justify-content:center;position:relative}
        .icon-btn:hover{color:${GOLD}!important}
        .filter-btn{padding:6px 15px;border-radius:999px;border:1px solid;cursor:pointer;font-size:10px;font-weight:600;letter-spacing:0.05em;transition:all 0.2s;background:transparent}
        .filter-btn.active,.filter-btn:hover{background:${GOLD}!important;border-color:${GOLD}!important;color:#000!important}
        .social-btn{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;text-decoration:none;transition:all 0.2s}
        .social-btn:hover{background:${GOLD}!important;color:#000!important;border-color:${GOLD}!important}
        .footer-link{background:none;border:none;cursor:pointer;font-size:14px;transition:color 0.2s}
        .footer-link:hover{color:${GOLD}!important}
        .license-card{transition:border-color 0.3s,box-shadow 0.3s}
        .license-card:hover{border-color:rgba(212,175,55,0.35)!important}
        .tab-btn{padding:9px 18px;border:none;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;transition:all 0.2s;border-radius:10px}
        .tip-card{transition:transform 0.2s,border-color 0.2s}
        .tip-card:hover{transform:translateY(-3px);border-color:rgba(212,175,55,0.3)!important}
        .inp{outline:none;transition:border-color 0.2s}
        .inp:focus{border-color:${GOLD}!important}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(8px);z-index:250;display:flex;align-items:center;justify-content:center;padding:16px}
        @media(max-width:900px){.nav-links-row{gap:14px!important}}
        @media(max-width:768px){.nav-links-row{display:none!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}.footer-grid{grid-template-columns:1fr!important}}
        @media(max-width:480px){.beat-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}.license-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* Announcement Bar */}
      <div style={{background:GOLD,color:"#000",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",padding:"7px 0",overflow:"hidden"}}>
        <span className="ann-inner">{admin.announcementText} &nbsp;•&nbsp; {admin.announcementText}</span>
      </div>

      {/* Navbar */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:C.navBg,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:66}}>
          <button onClick={()=>goToPage("home")} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
            {admin.logoImage ? (
              <img src={admin.logoImage} alt="Logo" style={{width:38,height:38,borderRadius:"50%",objectFit:"cover"}}/>
            ) : (
              <div className="logo-disc" style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${GOLD},rgba(212,175,55,0.3))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🎵</div>
            )}
            <div style={{lineHeight:1.1}}>
              <span className="logo-text-main" style={{display:"block",fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:17,letterSpacing:"0.22em",background:"linear-gradient(90deg,#8B6914,#f5e06e,#D4AF37,#fffbe0,#f0c830,#D4AF37,#8B6914)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 6px rgba(212,175,55,0.55))"}}>DEE TRACKS</span>
              <span style={{display:"block",fontFamily:"'Playfair Display',serif",fontSize:9,fontWeight:700,letterSpacing:"0.55em",background:"linear-gradient(90deg,#c9960c,#f5d960,#D4AF37)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",opacity:0.9,marginTop:1}}>RECORDS</span>
            </div>
          </button>

          <ul className="nav-links-row" style={{display:"flex",gap:22,listStyle:"none",alignItems:"center"}}>
            {(navLinks as any[]).map((nl:any)=>(
              <li key={nl.key}>
                <button className={`nav-link${page===nl.key?" active":""}`} style={{color:page===nl.key?GOLD:C.muted}} onClick={()=>goToPage(nl.key)}>{nl.label}</button>
              </li>
            ))}
          </ul>

          <div style={{display:"flex",gap:2,alignItems:"center"}}>
            <button className="icon-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} title="Toggle theme" style={{color:C.muted}}>{themeIcon}</button>
            <button className="icon-btn" onClick={()=>setWishlistOpen(true)} title="Wishlist" style={{color:C.muted}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.length>0?"#e74c3c":"none"} stroke={wishlist.length>0?"#e74c3c":"currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlist.length>0 && <span style={{position:"absolute",top:2,right:2,background:"#e74c3c",color:"#fff",fontSize:8,fontWeight:800,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlist.length}</span>}
            </button>
            <button className="icon-btn" onClick={()=>setCartOpen(true)} title="Cart" style={{color:C.muted}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cart.length>0 && <span style={{position:"absolute",top:2,right:2,background:GOLD,color:"#000",fontSize:8,fontWeight:800,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{cart.length}</span>}
            </button>
            <button className="icon-btn" onClick={()=>setAccountOpen(true)} title="Account" style={{color:C.muted}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Pages */}
      {page==="home" && <HomePage C={C} theme={theme} goToPage={goToPage} beats={beatsData} onPlay={playBeat} onCart={addToCart} onToast={showToast} inWishlist={inWishlist} toggleWishlist={toggleWishlist} onJoinInner={()=>{setAccountTab("signup");setAccountOpen(true);}} onFreeDownload={()=>setLeadMagnetOpen(true)} artistCredits={artistCredits} />}

      {page==="store" && (
        <div style={{maxWidth:1280,margin:"0 auto",padding:"56px 24px"}}>
          <div style={{marginBottom:28}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:700,marginBottom:4}}>
              {similarTo ? `Beats Similar to "${similarTo.name}"` : "The Catalog"}
            </h2>
            {similarTo ? (
              <button onClick={()=>setSimilarTo(null)} style={{fontSize:12,color:GOLD,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>← Back to full catalog</button>
            ) : (
              <p style={{fontSize:13,color:C.muted}}>Browse beats, loop kits, and sample packs.</p>
            )}
          </div>

          {!similarTo && (
            <>
              <div style={{display:"flex",gap:8,marginBottom:20}}>
                {([["beat","Beats"],["loop-kit","Loop Kits"],["sample-pack","Sample Packs"]] as const).map(([k,l])=>(
                  <button key={k} className="tab-btn" onClick={()=>{setStoreTab(k);setGenre("all");setKeyFilter("all");setMoodFilter("all");setArtistTypeFilter("all");}}
                    style={{background:storeTab===k?GOLD:C.card2,color:storeTab===k?"#000":C.muted,border:`1px solid ${storeTab===k?GOLD:C.border}`}}>{l}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                {["all","Trap","Trapsoul","RnB","Hip Hop","Pop","Afrobeats"].map(g=>(
                  <button key={g} className={`filter-btn${genre===g?" active":""}`} onClick={()=>setGenre(g)} style={{color:C.muted,borderColor:C.border}}>{g==="all"?"All Genres":g}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                <button className={`filter-btn${keyFilter==="all"?" active":""}`} onClick={()=>setKeyFilter("all")} style={{color:C.muted,borderColor:C.border}}>All Keys</button>
                {allKeys.map(k=><button key={k} className={`filter-btn${keyFilter===k?" active":""}`} onClick={()=>setKeyFilter(k)} style={{color:C.muted,borderColor:C.border,fontSize:9}}>{k}</button>)}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                <button className={`filter-btn${moodFilter==="all"?" active":""}`} onClick={()=>setMoodFilter("all")} style={{color:C.muted,borderColor:C.border}}>All Moods</button>
                {allMoods.map(m=><button key={m} className={`filter-btn${moodFilter===m?" active":""}`} onClick={()=>setMoodFilter(m)} style={{color:C.muted,borderColor:C.border,fontSize:9}}>{m}</button>)}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>
                <button className={`filter-btn${artistTypeFilter==="all"?" active":""}`} onClick={()=>setArtistTypeFilter("all")} style={{color:C.muted,borderColor:C.border}}>All Artist Types</button>
                {allArtistTypes.map(a=><button key={a} className={`filter-btn${artistTypeFilter===a?" active":""}`} onClick={()=>setArtistTypeFilter(a)} style={{color:C.muted,borderColor:C.border,fontSize:9}}>{a}</button>)}
              </div>
            </>
          )}

          {base.length===0 ? (
            <div style={{textAlign:"center",padding:"80px 0",color:C.muted}}>
              <div style={{fontSize:48,marginBottom:12,opacity:0.3}}>🎵</div>
              <p>No beats match that filter. Try adjusting your search.</p>
            </div>
          ) : (
            <BeatGrid beats={base} onPlay={playBeat} onCart={addToCart} onToast={showToast} inWishlist={inWishlist} toggleWishlist={toggleWishlist} C={C} onFindSimilar={(b)=>{setSimilarTo(b);setStoreTab("beat");}} />
          )}
        </div>
      )}

      {page==="licensing" && <LicensingPage C={C} admin={admin} goToPage={goToPage} showToast={showToast}/>}
      {page==="tips" && <TipsPage C={C} articles={tipsArticles} onFreeDownload={()=>setLeadMagnetOpen(true)}/>}
      {page==="inner-circle" && <InnerCirclePage C={C} onJoin={()=>{setAccountTab("signup");setAccountOpen(true);}} onFreeDownload={()=>setLeadMagnetOpen(true)} vaultPassword={VAULT_PASSWORD}/>}

      {page==="vault" && (
        <VaultPage C={C} unlocked={vaultUnlocked} vaultInput={vaultInput} setVaultInput={setVaultInput} onTry={tryVault}
          beats={beatsData.filter(b=>b.vault)} onPlay={playBeat} onCart={addToCart} onToast={showToast}
          inWishlist={inWishlist} toggleWishlist={toggleWishlist} onJoin={()=>{setAccountTab("signup");setAccountOpen(true);}}/>
      )}

      <Footer C={C} admin={admin} goToPage={goToPage} showToast={showToast} openAccount={()=>{setAccountTab("login");setAccountOpen(true);}} theme={theme}/>

      {/* Cart Drawer */}
      {cartOpen && <div onClick={()=>setCartOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",zIndex:150}}/>}
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(420px,100vw)",background:C.card,borderLeft:`1px solid ${C.border}`,zIndex:160,transform:cartOpen?"translateX(0)":"translateX(100%)",transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20}}>Your Cart</h3>
            {buy2get1Active && (
              <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} style={{fontSize:10,color:"#4ade80",fontWeight:700,marginTop:3}}>
                🎉 Buy 2 Get 1 Free activated! 33% off applied.
              </motion.div>
            )}
            {cart.filter(b=>b.category==="beat").length===2 && !buy2get1Active && (
              <div style={{fontSize:10,color:GOLD,fontWeight:700,marginTop:3}}>Add 1 more beat to activate Buy 2 Get 1 Free!</div>
            )}
          </div>
          <button onClick={()=>setCartOpen(false)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"0 24px"}}>
          {cart.length===0 ? (
            <div style={{textAlign:"center",color:C.muted,padding:"60px 0",fontSize:14}}>
              <div style={{fontSize:48,marginBottom:12,opacity:0.3}}>🛒</div>
              <p>Your cart is empty.</p>
            </div>
          ) : cart.map(b=>(
            <div key={b.id} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
              <img src={b.img} alt={b.name} style={{width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div>
                <div style={{fontSize:11,color:GOLD,fontWeight:700}}>{fmt(b.price)}</div>
              </div>
              <button onClick={()=>removeFromCart(b.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,padding:4}}>✕</button>
            </div>
          ))}
        </div>
        {cart.length>0 && (
          <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`}}>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input className="inp" placeholder="Discount code" value={discountInput} onChange={e=>setDiscountInput(e.target.value)} style={{flex:1,background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:12,outline:"none"}}/>
              <button onClick={applyDiscount} style={{padding:"8px 14px",background:"rgba(212,175,55,0.12)",border:`1px solid ${GOLD}`,borderRadius:8,color:GOLD,fontSize:12,fontWeight:700,cursor:"pointer"}}>Apply</button>
            </div>
            {appliedDiscount && <div style={{fontSize:11,color:"#4ade80",marginBottom:10}}>✅ {appliedDiscount.code} — {appliedDiscount.percent}% off</div>}
            {buy2get1Active && <div style={{fontSize:11,color:"#4ade80",marginBottom:10}}>🎉 Buy 2 Get 1 Free — 33% discount applied</div>}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              {(appliedDiscount||buy2get1Active) && <div style={{fontSize:11,color:C.muted}}>Subtotal: <span style={{textDecoration:"line-through"}}>{fmt(cartSubtotal)}</span></div>}
              <div style={{fontWeight:700,fontSize:16,marginLeft:"auto"}}>Total: <strong style={{color:GOLD,fontSize:20}}>{fmt(cartTotal)}</strong></div>
            </div>
            <button className="btn-gold" onClick={handleCheckout} style={{width:"100%",display:"flex",justifyContent:"center",gap:8,padding:"13px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer",boxShadow:"0 0 30px rgba(212,175,55,0.3)"}}>
              💳 Pay with PayFast →
            </button>
            <p style={{textAlign:"center",fontSize:10,color:C.muted,marginTop:7}}>EFT • Credit Card • Instant EFT (Ozow) • Secure</p>
          </div>
        )}
      </div>

      {/* Wishlist Drawer */}
      {wishlistOpen && <div onClick={()=>setWishlistOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",zIndex:150}}/>}
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(380px,100vw)",background:C.card,borderLeft:`1px solid ${C.border}`,zIndex:160,transform:wishlistOpen?"translateX(0)":"translateX(100%)",transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20}}>❤️ Wishlist</h3>
          <button onClick={()=>setWishlistOpen(false)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"0 24px"}}>
          {wishlist.length===0 ? (<div style={{textAlign:"center",color:C.muted,padding:"60px 0",fontSize:14}}><div style={{fontSize:44,marginBottom:12,opacity:0.3}}>❤️</div><p>No saved beats yet.</p></div>)
          : wishlist.map(b=>(
            <div key={b.id} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
              <img src={b.img} alt={b.name} style={{width:44,height:44,borderRadius:8,objectFit:"cover"}}/>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{b.name}</div><div style={{fontSize:11,color:GOLD,fontWeight:700}}>{fmt(b.price)}</div></div>
              <button onClick={()=>addToCart(b.id)} style={{padding:"6px 11px",background:GOLD,border:"none",borderRadius:7,color:"#000",fontSize:11,fontWeight:700,cursor:"pointer"}}>Add</button>
              <button onClick={()=>toggleWishlist(b.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14}}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Player */}
      {playing && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:theme==="dark"?"rgba(10,10,10,0.97)":"rgba(248,246,240,0.97)",borderTop:`1px solid ${C.border}`,backdropFilter:"blur(20px)",padding:"10px 20px",display:"flex",alignItems:"center",gap:14,zIndex:200,minHeight:64}}>
          <img src={playing.img} alt={playing.name} style={{width:40,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
          <div style={{minWidth:0,flex:"0 0 150px"}}>
            <strong style={{display:"block",fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{playing.name}</strong>
            <span style={{fontSize:10,color:C.muted}}>{playing.bpm>0?playing.bpm+" BPM":"Samples"} • {playing.genre} • {playing.key}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            <button onClick={stopPlay} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer"}}>■</button>
            <button onClick={togglePlayPause} style={{width:36,height:36,borderRadius:"50%",background:GOLD,color:"#000",fontSize:13,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{paused?"▶":"⏸"}</button>
          </div>
          <div style={{flex:1,minWidth:0}}><Waveform playing={!paused} progress={progress}/></div>
          <VUMeter active={!paused}/>
          <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
            <button onClick={()=>setVocalPocket(v=>!v)} title="Vocal Pocket — cuts 1–3kHz to hear vocal room" style={{padding:"4px 9px",background:vocalPocket?"rgba(74,222,128,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${vocalPocket?"#4ade80":C.border}`,borderRadius:7,color:vocalPocket?"#4ade80":C.muted,fontSize:9,fontWeight:700,cursor:"pointer",letterSpacing:"0.05em"}}>
              🎙 {vocalPocket?"VOCAL ON":"VOCAL"}
            </button>
            <button onClick={()=>setShowVisualizer(v=>!v)} title="Toggle frequency visualizer" style={{padding:"4px 9px",background:showVisualizer?"rgba(212,175,55,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${showVisualizer?GOLD:C.border}`,borderRadius:7,color:showVisualizer?GOLD:C.muted,fontSize:9,fontWeight:700,cursor:"pointer"}}>
              VIZ
            </button>
          </div>
        </div>
      )}

      {/* Frequency Visualizer */}
      <FreqVisualizer active={showVisualizer && !!playing && !paused}/>

      {/* Toast */}
      <div style={{position:"fixed",bottom:playing?72:20,right:20,background:C.card2,border:"1px solid rgba(212,175,55,0.3)",color:C.text,padding:"11px 16px",borderRadius:12,fontSize:13,fontWeight:600,zIndex:300,transform:toastVisible?"translateY(0)":"translateY(16px)",opacity:toastVisible?1:0,transition:"all 0.3s",maxWidth:280,pointerEvents:"none"}}>
        {toast}
      </div>

      {/* Account Modal */}
      {accountOpen && (
        <div className="modal-overlay" onClick={()=>setAccountOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px 28px",maxWidth:440,width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{accountTab==="login"?"Welcome Back":"Join the Inner Circle"}</h3>
              <button onClick={()=>setAccountOpen(false)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",borderRadius:999,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:20}}>
              {(["login","signup"] as const).map(t=>(
                <button key={t} onClick={()=>setAccountTab(t)} style={{flex:1,padding:"10px",background:accountTab===t?GOLD:"transparent",color:accountTab===t?"#000":C.muted,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t==="login"?"Login":"Sign Up"}</button>
              ))}
            </div>
            {accountTab==="signup" && (
              <div style={{background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13}}>
                ✨ <strong style={{color:GOLD}}>Free Loop Kit</strong> + <strong style={{color:GOLD}}>15% off</strong> first Exclusive + <strong style={{color:GOLD}}>Vault password</strong> on signup.
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input className="inp" type="email" placeholder="Email address" style={{background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,outline:"none"}}/>
              <input className="inp" type="password" placeholder="Password" style={{background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,outline:"none"}}/>
              {accountTab==="signup" && <input className="inp" type="text" placeholder="Artist name (optional)" style={{background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:14,outline:"none"}}/>}
            </div>
            <button className="btn-gold" onClick={()=>{showToast(accountTab==="login"?"✅ Logged in!":"✅ Welcome! Your Vault password: MIDNIGHTSECRETS");setAccountOpen(false);}} style={{width:"100%",display:"flex",justifyContent:"center",marginTop:18,padding:"13px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer"}}>
              {accountTab==="login"?"Login →":"Join the Inner Circle →"}
            </button>
            <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.muted,textAlign:"center",marginBottom:7,textTransform:"uppercase",letterSpacing:"0.1em"}}>Admin Access</div>
              <div style={{display:"flex",gap:8}}>
                <input className="inp" type="password" placeholder="Admin key" value={adminKey} onChange={e=>setAdminKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()} style={{flex:1,background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:12,outline:"none"}}/>
                <button onClick={handleAdminLogin} style={{padding:"8px 14px",background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:8,color:GOLD,fontSize:12,fontWeight:700,cursor:"pointer"}}>Enter</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {adminOpen&&adminAuthed && (
        <div className="modal-overlay" onClick={()=>setAdminOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px",maxWidth:660,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>Admin Panel</h3><p style={{fontSize:10,color:GOLD,marginTop:2}}>✦ Store Management</p></div>
              <button onClick={()=>setAdminOpen(false)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <AdminPanel admin={admin} setAdmin={setAdmin} onToast={showToast} C={C}/>
          </div>
        </div>
      )}

      {/* PayFast Payment Modal */}
      {paymentOpen && (
        <div className="modal-overlay" onClick={()=>setPaymentOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px",maxWidth:460,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:10}}>💳</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:6}}>Complete Your Purchase</h3>
            <p style={{color:C.muted,fontSize:13,lineHeight:1.6,marginBottom:20}}>You'll be securely redirected to PayFast to complete your ZAR payment.</p>
            <div style={{background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.muted}}>{cart.length} item{cart.length!==1?"s":""}</span>
              <strong style={{color:GOLD,fontSize:18}}>{fmt(cartTotal)}</strong>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              <input className="inp" type="text" placeholder="First name" value={buyerName.split(" ")[0]||buyerName} onChange={e=>setBuyerName(e.target.value)} style={{width:"100%",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              <input className="inp" type="email" placeholder="Email address (for receipt & download)" value={buyerEmail} onChange={e=>setBuyerEmail(e.target.value)} style={{width:"100%",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <button className="btn-gold" onClick={()=>{
              if(!buyerEmail.includes("@")){showToast("⚠️ Please enter a valid email address.");return;}
              const [fn,...rest]=buyerName.trim().split(" ");
              submitPayFastPayment(cart, cartTotal, fn||"Customer", rest.join(" ")||"Buyer", buyerEmail);
            }} style={{width:"100%",display:"flex",justifyContent:"center",gap:8,padding:"14px",background:GOLD,color:"#000",fontWeight:800,fontSize:14,textTransform:"uppercase",letterSpacing:"0.08em",border:"none",borderRadius:999,cursor:"pointer",boxShadow:"0 0 24px rgba(212,175,55,0.4)"}}>
              🔒 Pay {fmt(cartTotal)} via PayFast →
            </button>
            <p style={{marginTop:12,fontSize:10,color:C.muted}}>EFT • Credit Card • Instant EFT (Ozow) • Secure 256-bit SSL</p>
            <button onClick={()=>setPaymentOpen(false)} style={{marginTop:8,background:"transparent",border:"none",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back to cart</button>
          </div>
        </div>
      )}

      {/* Post-Purchase Modal */}
      {savePromptOpen && (
        <div className="modal-overlay" onClick={()=>setSavePromptOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px",maxWidth:460,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:14}}>🎉</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:10}}>Payment Received!</h3>
            <p style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:16}}>Your files are ready. Save your details for lifetime Cloud Vault access.</p>
            {purchasedBeat && (
              <div style={{marginBottom:20}}>
                <input className="inp" type="text" placeholder="Your name (for license)" value={buyerName} onChange={e=>setBuyerName(e.target.value)} style={{width:"100%",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",marginBottom:10}}/>
                <button onClick={()=>{generateLicensePDF(purchasedBeat, buyerName, "Basic MP3 Lease");showToast("📄 License downloaded!");}} style={{padding:"9px 20px",background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:9,color:GOLD,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  📄 Download License PDF
                </button>
              </div>
            )}
            <div style={{background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:10,padding:14,marginBottom:20,fontSize:12}}>
              <strong style={{color:GOLD}}>☁️ Cloud Vault:</strong> Re-download anytime, license storage, monthly free loop kits.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button className="btn-gold" onClick={()=>{setSavePromptOpen(false);setAccountTab("signup");setAccountOpen(true);}} style={{display:"flex",justifyContent:"center",padding:"13px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:"0.08em",border:"none",borderRadius:999,cursor:"pointer"}}>Save My Details →</button>
              <button onClick={()=>{setSavePromptOpen(false);setCart([]);showToast("📧 Download link sent to your email!");}} style={{padding:"12px",background:"transparent",color:C.muted,border:"none",cursor:"pointer",fontSize:12}}>No thanks, email only</button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Magnet */}
      {leadMagnetOpen && (
        <div className="modal-overlay" onClick={()=>{setLeadMagnetOpen(false);setLeadGenre("");}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"36px 32px",maxWidth:460,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:14}}>🎁</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:8}}>Get Your Free Tagged Beat</h3>
            <p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}>Choose your genre, drop your email, and we'll send you a free tagged MP3. One free beat per customer — pick the style that fits your sound.</p>

            {/* Genre selector */}
            <div style={{marginBottom:20}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:12}}>Step 1 — Choose Your Genre</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                {([["Trap","🔥","Dark energy, hard 808s"],["RnB","✨","Smooth, soulful vibes"],["Trapsoul","🌙","Melodic, emotional"]] as const).map(([g,icon,desc])=>(
                  <button key={g} onClick={()=>setLeadGenre(g)}
                    style={{flex:"1 1 120px",padding:"14px 10px",borderRadius:12,border:`2px solid ${leadGenre===g?GOLD:C.border}`,background:leadGenre===g?"rgba(212,175,55,0.1)":C.card2,color:leadGenre===g?GOLD:C.muted,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                    <div style={{fontSize:22,marginBottom:5}}>{icon}</div>
                    <div style={{fontWeight:800,fontSize:13,letterSpacing:"0.04em"}}>{g==="RnB"?"R&B":g}</div>
                    <div style={{fontSize:10,marginTop:3,opacity:0.7}}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{marginBottom:14}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:10}}>Step 2 — Enter Your Email</p>
              <input className="inp" type="email" placeholder="Your email address" value={leadEmail} onChange={e=>setLeadEmail(e.target.value)}
                style={{width:"100%",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"12px 14px",color:C.text,fontSize:14,outline:"none"}}/>
            </div>

            {/* Selected genre confirmation */}
            {leadGenre && (
              <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                style={{background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:GOLD,fontWeight:600}}>
                ✓ You'll receive a free <strong>{leadGenre==="RnB"?"R&B":leadGenre}</strong> type beat — tagged MP3, yours to keep.
              </motion.div>
            )}

            <button className="btn-gold"
              onClick={()=>{
                if(!leadGenre){showToast("Please choose your genre first.");return;}
                if(!leadEmail){showToast("Please enter your email.");return;}
                setLeadMagnetOpen(false);setLeadEmail("");setLeadGenre("");
                showToast(`🎁 Your free ${leadGenre==="RnB"?"R&B":leadGenre} beat is on its way!`);
              }}
              style={{width:"100%",display:"flex",justifyContent:"center",padding:"13px",background:leadGenre?GOLD:"rgba(212,175,55,0.3)",color:"#000",fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:"0.08em",border:"none",borderRadius:999,cursor:leadGenre?"pointer":"not-allowed"}}>
              {leadGenre?`Send Me My Free ${leadGenre==="RnB"?"R&B":leadGenre} Beat →`:"Select a Genre to Continue"}
            </button>
            <p style={{fontSize:10,color:C.muted,marginTop:10}}>One free beat per customer. No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ SUB-COMPONENTS ═══════════════════════ */

function BeatGrid({beats,onPlay,onCart,onToast,inWishlist,toggleWishlist,C,onFindSimilar}:{
  beats:Beat[];onPlay:(id:number)=>void;onCart:(id:number)=>void;onToast:(m:string)=>void;
  inWishlist:(id:number)=>boolean;toggleWishlist:(id:number)=>void;C:any;onFindSimilar?:(b:Beat)=>void;
}){
  return (
    <div className="beat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
      {beats.map(b=>(
        <div key={b.id} className="beat-card" style={{background:b.vault?"linear-gradient(135deg,rgba(212,175,55,0.05),transparent)":C.card,borderRadius:16,overflow:"hidden",border:`1px solid ${b.featured?"rgba(212,175,55,0.4)":C.border}`,position:"relative"}}>
          {b.featured&&<div style={{position:"absolute",top:10,right:10,zIndex:3,background:GOLD,color:"#000",fontSize:7,fontWeight:800,padding:"3px 8px",borderRadius:999,letterSpacing:"0.1em"}}>★ FEATURED</div>}
          {b.soldOut&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",zIndex:4,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{background:"#333",color:"#666",fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:999}}>SOLD OUT</span></div>}
          {b.freeDownload&&<div style={{position:"absolute",top:10,left:10,zIndex:3,background:"#4ade80",color:"#000",fontSize:8,fontWeight:800,padding:"3px 8px",borderRadius:999}}>FREE DL</div>}
          {b.vault&&!b.freeDownload&&<div style={{position:"absolute",top:10,left:10,zIndex:3,background:"rgba(0,0,0,0.8)",color:GOLD,fontSize:8,fontWeight:800,padding:"3px 8px",borderRadius:999,border:"1px solid rgba(212,175,55,0.4)"}}>🔒 VAULT</div>}
          <div style={{position:"relative",aspectRatio:"1",background:"#111",overflow:"hidden"}}>
            <img className="beat-img" src={b.img} alt={b.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.75}} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
            <div className="beat-overlay" style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 60%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <button onClick={()=>onPlay(b.id)} style={{width:50,height:50,borderRadius:"50%",background:GOLD,color:"#000",fontSize:18,border:"none",cursor:"pointer",boxShadow:"0 0 30px rgba(212,175,55,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>▶</button>
            </div>
            <div style={{position:"absolute",top:10,left:b.freeDownload||b.vault?56:10,background:"rgba(0,0,0,0.75)",color:"#888",fontSize:7,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",padding:"3px 7px",borderRadius:4,backdropFilter:"blur(6px)"}}>{b.tag}</div>
          </div>
          <div style={{padding:"12px 13px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"58%"}}>{b.name}</span>
              <span style={{fontSize:14,fontWeight:800,color:GOLD}}>{fmt(b.tier&&b.tier.salesCount<b.tier.tierSales?b.tier.earlyPrice:b.price)}</span>
            </div>
            <div style={{fontSize:9,color:C.muted,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
              <span>{b.bpm>0?`${b.bpm} BPM`:"Samples"}</span><span style={{opacity:0.3}}>•</span>
              <span>{b.genre}</span><span style={{opacity:0.3}}>•</span><span>{b.key}</span>
              {b.mood&&<><span style={{opacity:0.3}}>•</span><span style={{color:"rgba(212,175,55,0.7)",fontSize:8}}>{b.mood}</span></>}
            </div>
            {b.artistType&&<div style={{fontSize:8,color:C.muted,marginBottom:6,background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",display:"inline-block"}}>{b.artistType}</div>}
            {b.tier && <TieredPriceBar tier={b.tier} C={C}/>}
            <div style={{display:"flex",gap:6,marginTop:8}}>
              <button onClick={()=>b.freeDownload?onToast("🎁 Free download sent!"):onCart(b.id)} disabled={!!b.soldOut} style={{flex:1,padding:"7px",background:b.freeDownload?"#4ade80":GOLD,color:"#000",fontSize:9,fontWeight:800,letterSpacing:"0.05em",textTransform:"uppercase",border:"none",borderRadius:7,cursor:b.soldOut?"not-allowed":"pointer"}}>
                {b.soldOut?"Sold Out":b.freeDownload?"Free Download":"Add to Cart"}
              </button>
              {onFindSimilar && (
                <button onClick={()=>onFindSimilar(b)} title="Find similar beats" style={{padding:"7px 9px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:7,color:C.muted,fontSize:10,cursor:"pointer"}}>≈</button>
              )}
              <button onClick={()=>toggleWishlist(b.id)} style={{padding:"7px 9px",background:inWishlist(b.id)?"rgba(231,76,60,0.1)":C.card2,border:`1px solid ${inWishlist(b.id)?"#e74c3c":C.border}`,color:inWishlist(b.id)?"#e74c3c":C.muted,borderRadius:7,cursor:"pointer",fontSize:12}}>
                {inWishlist(b.id)?"♥":"♡"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HomePage({C,theme,goToPage,beats,onPlay,onCart,onToast,inWishlist,toggleWishlist,onJoinInner,onFreeDownload,artistCredits}:any){
  const featured = beats.filter((b:Beat)=>b.category==="beat"&&!b.vault).slice(0,6);
  return (
    <>
      <section style={{minHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 80% 60% at 50% 40%,rgba(212,175,55,0.06) 0%,transparent 70%),linear-gradient(to bottom,transparent 40%,${C.bg} 100%)`}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:900,padding:"0 24px"}}>
          <div style={{display:"inline-block",padding:"5px 16px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.07)",color:GOLD,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:24}}>✦ Premium Instrumentals</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(52px,10vw,96px)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.02em",marginBottom:22,color:theme==="dark"?"#fff":"#111"}}>
            CRAFTED FOR<br/>
            <span style={{background:"linear-gradient(135deg,#f0d060 0%,#D4AF37 40%,#b8860b 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GREATNESS</span>
          </h1>
          <p style={{fontSize:17,color:C.muted,maxWidth:540,margin:"0 auto 36px",lineHeight:1.7}}>Industry-quality Trap, Trapsoul, and R&B beats. License premium instrumentals instantly.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-gold" onClick={()=>goToPage("store")} style={{display:"inline-flex",alignItems:"center",padding:"14px 32px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer",boxShadow:"0 0 40px rgba(212,175,55,0.3)"}}>Browse Catalog →</button>
            <button onClick={onFreeDownload} style={{display:"inline-flex",alignItems:"center",padding:"14px 28px",background:"rgba(255,255,255,0.05)",color:C.text,fontWeight:700,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:`1px solid ${C.border}`,borderRadius:999,cursor:"pointer"}}>🎁 Free Beat</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div className="stats-grid" style={{maxWidth:1200,margin:"0 auto",padding:"22px 24px",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
          {[["🎵","150+","Premium Beats"],["▶","50K+","Total Streams"],["⭐","HQ","Industry Quality"],["🎧","24/7","Instant Delivery"]].map(([icon,num,label],i,arr)=>(
            <div key={label} style={{textAlign:"center",padding:"0 16px",borderRight:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{fontSize:14,color:GOLD,marginBottom:4}}>{icon}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:GOLD}}>{num}</div>
              <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Beats */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"64px 24px"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:36}}>
          <div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:700}}>Featured Releases</h2><p style={{fontSize:13,color:C.muted,marginTop:5}}>The most popular instrumentals right now.</p></div>
          <button onClick={()=>goToPage("store")} style={{color:GOLD,background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:600}}>View All →</button>
        </div>
        <BeatGrid beats={featured} onPlay={onPlay} onCart={onCart} onToast={onToast} inWishlist={inWishlist} toggleWishlist={toggleWishlist} C={C} onFindSimilar={(b:Beat)=>{goToPage("store");}}/>
      </div>

      {/* Artist Credits */}
      <div style={{padding:"64px 24px",background:theme==="dark"?"rgba(255,255,255,0.01)":"rgba(0,0,0,0.02)",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{display:"inline-block",padding:"4px 14px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.07)",color:GOLD,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>✦ Artist Spotlights</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,3.5vw,34px)",fontWeight:700}}>Placed On</h2>
            <p style={{color:C.muted,fontSize:14,marginTop:8}}>Artists who built their sound with DTR beats.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
            {artistCredits.map((a:any)=>(
              <div key={a.artist} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 16px",display:"flex",gap:14,alignItems:"center"}}>
                <img src={a.img} alt={a.artist} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:`2px solid ${GOLD}`,flexShrink:0}}/>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.artist}</div>
                  <div style={{fontSize:11,color:GOLD,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{a.song}"</div>
                  <div style={{fontSize:10,color:C.muted,marginTop:2}}>on <em>{a.beat}</em> • {a.streams} streams</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Own Your Sound */}
      <div style={{padding:"72px 24px",textAlign:"center",borderBottom:`1px solid ${C.border}`}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(30px,5vw,52px)",fontWeight:900,marginBottom:16,background:"linear-gradient(135deg,#f0d060 0%,#D4AF37 40%,#b8860b 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Own Your Sound</h2>
        <p style={{maxWidth:480,margin:"0 auto 28px",color:C.muted,fontSize:15,lineHeight:1.7}}>Stop leasing what everyone else has. Invest in exclusive rights and take full ownership.</p>
        <button onClick={()=>goToPage("licensing")} style={{display:"inline-flex",padding:"13px 32px",background:"transparent",color:C.text,fontWeight:700,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:`1px solid ${C.border}`,borderRadius:999,cursor:"pointer"}}>Compare Licenses</button>
      </div>

      {/* Inner Circle Teaser */}
      <div style={{padding:"64px 24px",textAlign:"center"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{display:"inline-block",padding:"5px 14px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.07)",color:GOLD,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>✦ Exclusive Membership</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,4vw,38px)",fontWeight:900,marginBottom:12}}>Join the DTR Inner Circle</h2>
          <p style={{color:C.muted,fontSize:15,lineHeight:1.7,marginBottom:24}}>Sign up: <strong style={{color:GOLD}}>free Loop Kit</strong> + <strong style={{color:GOLD}}>15% off</strong> first Exclusive + <strong style={{color:GOLD}}>Midnight Secrets Vault password</strong>.</p>
          <button className="btn-gold" onClick={onJoinInner} style={{display:"inline-flex",padding:"14px 34px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer",boxShadow:"0 0 30px rgba(212,175,55,0.2)"}}>Join the Inner Circle →</button>
        </div>
      </div>
    </>
  );
}

function VaultPage({C,unlocked,vaultInput,setVaultInput,onTry,beats,onPlay,onCart,onToast,inWishlist,toggleWishlist,onJoin}:any){
  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"64px 24px"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{fontSize:48,marginBottom:14}}>{unlocked?"🔓":"🔒"}</div>
        <div style={{display:"inline-block",padding:"5px 14px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.08)",color:GOLD,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>Exclusive Vault</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,52px)",fontWeight:900,marginBottom:12}}>Midnight Secrets Vol. 2</h1>
        <p style={{color:C.muted,fontSize:15,lineHeight:1.7,maxWidth:520,margin:"0 auto"}}>
          {unlocked ? "You're in. These beats are available exclusively to Vault members." : "Password-protected exclusive releases. Sign up for the Inner Circle to receive the Vault password."}
        </p>
      </div>

      {!unlocked ? (
        <div style={{maxWidth:420,margin:"0 auto",textAlign:"center"}}>
          <div style={{background:C.card,border:"1px solid rgba(212,175,55,0.2)",borderRadius:20,padding:"36px 28px",marginBottom:24}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:8}}>Enter Vault Password</h3>
            <p style={{color:C.muted,fontSize:13,lineHeight:1.6,marginBottom:20}}>The password is revealed to all <strong style={{color:GOLD}}>DTR Inner Circle</strong> members when they sign up.</p>
            <input className="inp" type="password" placeholder="Vault password" value={vaultInput} onChange={(e:any)=>setVaultInput(e.target.value)} onKeyDown={(e:any)=>e.key==="Enter"&&onTry()} style={{width:"100%",background:C.inputBg,border:`1px solid ${C.inputBorder}`,borderRadius:10,padding:"12px 14px",color:C.text,fontSize:14,outline:"none",marginBottom:12,letterSpacing:"0.08em"}}/>
            <button className="btn-gold" onClick={onTry} style={{width:"100%",display:"flex",justifyContent:"center",padding:"13px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer"}}>Unlock the Vault →</button>
          </div>
          <div style={{background:"rgba(212,175,55,0.05)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:14,padding:"22px 20px",marginBottom:20}}>
            <h4 style={{color:GOLD,fontWeight:700,marginBottom:8,fontSize:14}}>Don't have the password?</h4>
            <p style={{color:C.muted,fontSize:12,lineHeight:1.7,marginBottom:14}}>Join the DTR Inner Circle for free. You'll receive the Vault password + a free Loop Kit + 15% off your first Exclusive.</p>
            <button className="btn-gold" onClick={onJoin} style={{display:"inline-flex",padding:"11px 28px",background:GOLD,color:"#000",fontWeight:800,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer"}}>Join the Inner Circle</button>
          </div>
          <div style={{padding:"14px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:`1px solid ${C.border}`}}>
            <p style={{fontSize:10,color:C.muted,textAlign:"center"}}>Vault contains 3 exclusive unreleased beats from Midnight Secrets Vol. 2. Early buyer pricing on all vault tracks.</p>
          </div>
        </div>
      ) : (
        <BeatGrid beats={beats} onPlay={onPlay} onCart={onCart} onToast={onToast} inWishlist={inWishlist} toggleWishlist={toggleWishlist} C={C}/>
      )}
    </div>
  );
}

const licenseData = [
  { tier:"Lease",     name:"Basic MP3",      priceKey:"basicPrice",    per:"/ beat", featured:false, badge:null,
    features:["MP3 file (tagged)","Up to 50,000 streams","1 music video allowed","Non-profit distribution"],excluded:["WAV / stems not included","No radio broadcasting"],btn:"store" },
  { tier:"Lease",     name:"Premium WAV",    priceKey:"premiumPrice",  per:"/ beat", featured:true,  badge:"Most Popular",
    features:["WAV file (untagged)","Up to 500,000 streams","3 music videos allowed","Profit & non-profit","Radio broadcasting (2 stations)"],excluded:["Stems not included"],btn:"store" },
  { tier:"Exclusive", name:"Exclusive Rights",priceKey:"exclusivePrice",per:"/ beat",featured:false, badge:null,
    features:["WAV + MP3 + Stems","Unlimited streams & sales","Unlimited music videos","Full commercial & radio","Beat removed from store","100% royalty-free"],excluded:[],btn:"exclusive" },
];

function LicensingPage({C,admin,goToPage,showToast}:any){
  return (
    <div style={{maxWidth:1180,margin:"0 auto",padding:"64px 24px"}}>
      <div style={{textAlign:"center",marginBottom:52}}>
        <div style={{display:"inline-block",padding:"5px 14px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.08)",color:GOLD,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>✦ Licensing Tiers</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:700,marginBottom:12,background:"linear-gradient(135deg,#f0d060 0%,#D4AF37 40%,#b8860b 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Simple, Transparent Pricing</h2>
        <p style={{color:C.muted,maxWidth:500,margin:"0 auto",fontSize:14,lineHeight:1.7}}>All licenses delivered instantly. No account required.</p>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px",marginBottom:40,overflowX:"auto"}}>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,marginBottom:16,color:GOLD}}>Access Tiers</h3>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            <th style={{textAlign:"left",padding:"7px 10px",color:C.muted,fontWeight:600}}>Feature</th>
            <th style={{textAlign:"center",padding:"7px 10px",color:C.text}}>Guest</th>
            <th style={{textAlign:"center",padding:"7px 10px",color:GOLD}}>Inner Circle</th>
          </tr></thead>
          <tbody>
            {[["Browsing / Preview","Unlimited","Unlimited"],["Checkout","Manual Entry","Saved / Fast Track"],["File Access","One-time Link","Lifetime Cloud Vault"],["Bonus Content","None","Monthly Free Loops"],["Vault Access","Password Only","Password Included"]].map(([f,g,m])=>(
              <tr key={f} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"10px 10px",color:C.text}}>{f}</td>
                <td style={{padding:"10px 10px",textAlign:"center",color:C.muted}}>{g}</td>
                <td style={{padding:"10px 10px",textAlign:"center",color:GOLD}}>{m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="license-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:20}}>
        {licenseData.map(lic=>{
          const price = (admin as any)[lic.priceKey];
          return (
            <div key={lic.name} className="license-card" style={{background:lic.featured?"linear-gradient(135deg,rgba(212,175,55,0.07) 0%,transparent 100%)":C.card,border:`1px solid ${lic.featured?"rgba(212,175,55,0.5)":C.border}`,borderRadius:18,padding:"28px 22px",position:"relative"}}>
              {lic.badge&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:GOLD,color:"#000",fontSize:8,fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",padding:"4px 13px",borderRadius:999}}>{lic.badge}</div>}
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:GOLD,marginBottom:6}}>{lic.tier}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:4}}>{lic.name}</div>
              <div style={{fontSize:32,fontWeight:800,color:GOLD,lineHeight:1,marginBottom:20}}>R{price} <small style={{fontSize:13,fontWeight:500,color:C.muted}}>{lic.per}</small></div>
              <ul style={{listStyle:"none",marginBottom:24}}>
                {lic.features.map(f=><li key={f} style={{display:"flex",gap:8,fontSize:12,color:C.muted,padding:"3px 0"}}><span style={{color:GOLD,fontWeight:800,flexShrink:0}}>✓</span>{f}</li>)}
                {lic.excluded.map(f=><li key={f} style={{display:"flex",gap:8,fontSize:12,color:"#444",padding:"3px 0"}}><span style={{color:"#444",fontWeight:800,flexShrink:0}}>✕</span>{f}</li>)}
              </ul>
              <button className="btn-gold" onClick={()=>lic.btn==="store"?goToPage("store"):showToast("📞 Contact via WhatsApp for exclusive negotiations!")} style={{width:"100%",display:"flex",justifyContent:"center",padding:"12px",background:GOLD,color:"#000",fontWeight:800,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer"}}>{lic.btn==="store"?"Choose Beats →":"Contact for Exclusives"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TipsPage({C,articles,onFreeDownload}:any){
  const [active,setActive]=useState("all");
  const cats=["all","Mixing Tip","Industry News","Licensing Education","Production"];
  const filtered=active==="all"?articles:articles.filter((a:any)=>a.cat===active);
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 24px"}}>
      <div style={{marginBottom:40}}>
        <div style={{display:"inline-block",padding:"5px 14px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.08)",color:GOLD,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:12}}>✦ Producer Resources</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,marginBottom:10}}>Tips, News & Knowledge</h2>
        <p style={{color:C.muted,fontSize:14,lineHeight:1.7,maxWidth:520}}>80% value, 20% promotion. Real knowledge to level up your craft.</p>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:32}}>
        {cats.map(c=><button key={c} className={`filter-btn${active===c?" active":""}`} onClick={()=>setActive(c)} style={{color:C.muted,borderColor:C.border}}>{c==="all"?"All":c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20,marginBottom:56}}>
        {filtered.map((art:any)=>(
          <div key={art.id} className="tip-card" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"22px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span style={{fontSize:26}}>{art.icon}</span>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:GOLD,background:"rgba(212,175,55,0.1)",padding:"3px 9px",borderRadius:999}}>{art.cat}</span>
            </div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,marginBottom:8,lineHeight:1.4}}>{art.title}</h3>
            <p style={{color:C.muted,fontSize:12,lineHeight:1.65,marginBottom:14}}>{art.excerpt}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:10,color:C.muted}}>📖 {art.readTime} read</span>
              <button style={{fontSize:11,color:GOLD,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Read More →</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"linear-gradient(135deg,rgba(212,175,55,0.07) 0%,transparent 60%)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:18,padding:"44px 32px",textAlign:"center"}}>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,marginBottom:10}}>Get a Free Tagged Beat</h3>
        <p style={{color:C.muted,fontSize:14,maxWidth:460,margin:"0 auto 22px",lineHeight:1.7}}>Drop your email and we'll send you a free MP3 + subscribe you to our newsletter.</p>
        <button className="btn-gold" onClick={onFreeDownload} style={{display:"inline-flex",padding:"13px 34px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer"}}>🎁 Get My Free Beat</button>
      </div>
    </div>
  );
}

function InnerCirclePage({C,onJoin,onFreeDownload,vaultPassword}:any){
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 24px"}}>
      <div style={{textAlign:"center",marginBottom:52}}>
        <div style={{display:"inline-block",padding:"5px 14px",borderRadius:999,border:"1px solid rgba(212,175,55,0.3)",background:"rgba(212,175,55,0.08)",color:GOLD,fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:14}}>✦ Exclusive Membership</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,56px)",fontWeight:900,marginBottom:14}}>The DTR Inner Circle</h1>
        <p style={{color:C.muted,fontSize:15,lineHeight:1.7,maxWidth:560,margin:"0 auto"}}>More than a beat store. A community for serious artists — real resources, real connections.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18,marginBottom:48}}>
        {[
          {icon:"🎁",title:"Free Loop Kit on Join",desc:"An Essential Loop Kit delivered to your inbox the moment you sign up."},
          {icon:"💰",title:"15% Off First Exclusive",desc:"Your first Exclusive license gets an automatic 15% discount."},
          {icon:"☁️",title:"Cloud Vault Access",desc:"Every beat you purchase is stored securely. Re-download anytime, forever."},
          {icon:"🔒",title:"Vault Password",desc:"Midnight Secrets Vol. 2 is password-protected. Inner Circle members get the key."},
          {icon:"🔁",title:"Monthly Free Loop Kits",desc:"Every month, members receive a new free loop kit — curated by Dee Tracks Records."},
          {icon:"🤝",title:"Early Access",desc:"Members get first access to new beats before they drop publicly."},
        ].map(b=>(
          <div key={b.title} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 18px"}}>
            <div style={{fontSize:30,marginBottom:10}}>{b.icon}</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,marginBottom:6,color:GOLD}}>{b.title}</h3>
            <p style={{color:C.muted,fontSize:12,lineHeight:1.6}}>{b.desc}</p>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",padding:"44px 24px",background:"linear-gradient(135deg,rgba(212,175,55,0.07) 0%,transparent 60%)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:18}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,4vw,40px)",fontWeight:900,marginBottom:12}}>Ready to Join?</h2>
        <p style={{color:C.muted,fontSize:14,marginBottom:24,maxWidth:440,margin:"0 auto 24px"}}>It's free. Your loop kit and vault password are waiting.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn-gold" onClick={onJoin} style={{display:"inline-flex",padding:"14px 36px",background:GOLD,color:"#000",fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",borderRadius:999,cursor:"pointer",boxShadow:"0 0 30px rgba(212,175,55,0.25)"}}>Join the Inner Circle →</button>
          <button onClick={onFreeDownload} style={{display:"inline-flex",padding:"14px 28px",background:"transparent",color:C.text,fontWeight:700,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",border:`1px solid ${C.border}`,borderRadius:999,cursor:"pointer"}}>🎁 Free Beat First</button>
        </div>
      </div>
    </div>
  );
}

function Footer({C,admin,goToPage,showToast,openAccount,theme}:any){
  return (
    <footer style={{background:C.footerBg,borderTop:`1px solid ${C.border}`,padding:"56px 24px 28px",paddingBottom:80}}>
      <div className="footer-grid" style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48,marginBottom:44}}>
        <div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,letterSpacing:"0.1em",background:"linear-gradient(135deg,#f0d060,#D4AF37,#b8860b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:10}}>DEE TRACKS RECORDS</h3>
          <p style={{fontSize:13,color:C.muted,maxWidth:280,lineHeight:1.7,marginBottom:20}}>Premium beats for artists who demand quality. Trap, Trapsoul, and R&B instrumentals crafted for greatness.</p>
          <div style={{display:"flex",gap:9}}>
            {[
              {title:"YouTube",href:admin.socialLinks.youtube,icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>},
              {title:"Instagram",href:admin.socialLinks.instagram,icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>},
              {title:"TikTok",href:admin.socialLinks.tiktok,icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.16 8.16 0 004.77 1.52V6.79a4.85 4.85 0 01-1-.1z"/></svg>},
              {title:"WhatsApp",href:admin.socialLinks.whatsapp,icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>},
            ].map(s=>(
              <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} className="social-btn" style={{background:theme==="dark"?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)",border:`1px solid ${C.border}`,color:C.muted}}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>Explore</h4>
          <ul style={{listStyle:"none"}}>
            {[["Beat Store","store"],["Loop Kits","store"],["Sample Packs","store"],["Licensing Info","licensing"],["🔒 Vault","vault"]].map(([l,p])=>(
              <li key={l} style={{marginBottom:9}}><button className="footer-link" onClick={()=>goToPage(p as Page)} style={{color:C.muted}}>{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>Connect</h4>
          <ul style={{listStyle:"none"}}>
            <li style={{marginBottom:9}}><button className="footer-link" onClick={()=>goToPage("tips" as Page)} style={{color:C.muted}}>Tips & Knowledge</button></li>
            <li style={{marginBottom:9}}><button className="footer-link" onClick={()=>goToPage("inner-circle" as Page)} style={{color:C.muted}}>Inner Circle</button></li>
            <li style={{marginBottom:9}}><button className="footer-link" onClick={()=>showToast("Contact us via WhatsApp!")} style={{color:C.muted}}>Contact Us</button></li>
            <li style={{marginBottom:9}}><button className="footer-link" onClick={openAccount} style={{color:C.muted}}>Producer Login</button></li>
          </ul>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",paddingTop:22,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,fontSize:11,color:C.muted}}>
        <p>© 2026 Dee Tracks Records. All rights reserved.</p>
        <p>Produced by <span style={{color:GOLD}}>Dee Tracks Records</span></p>
      </div>
    </footer>
  );
}

function AdminPanel({admin,setAdmin,onToast,C}:{admin:AdminSettings;setAdmin:any;onToast:any;C:any}){
  const [tab,setTab]=useState<"beats"|"pricing"|"codes"|"socials"|"content"|"logo">("beats");
  const [logoUrl,setLogoUrl]=useState(admin.logoImage);
  const [newCode,setNewCode]=useState(""); const [newPct,setNewPct]=useState("10");
  const tabs:[typeof tab,string][]=[["beats","Beats"],["pricing","Pricing"],["codes","Codes"],["socials","Socials"],["content","Content"],["logo","Logo"]];
  return (
    <div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:20}}>
        {tabs.map(([k,l])=><button key={k} className="tab-btn" onClick={()=>setTab(k)} style={{background:tab===k?GOLD:C.card2,color:tab===k?"#000":C.muted,border:`1px solid ${tab===k?GOLD:C.border}`,fontSize:10}}>{l}</button>)}
      </div>
      {tab==="beats" && (
        <div>
          <p style={{color:C.muted,fontSize:12,marginBottom:12}}>Manage your catalog. Tiers show scarcity pricing status.</p>
          <div style={{maxHeight:340,overflowY:"auto"}}>
            {beatsData.map(b=>(
              <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600}}>{b.name} {b.vault&&"🔒"}</div>
                  <div style={{fontSize:9,color:C.muted}}>{b.genre} • {b.bpm>0?b.bpm+" BPM":"Samples"} • {b.key}</div>
                  {b.tier&&<div style={{fontSize:9,color:b.tier.salesCount>=b.tier.tierSales?"#666":GOLD}}>{b.tier.salesCount>=b.tier.tierSales?"Tier full — standard price":"Early: "+fmt(b.tier.earlyPrice)+" ("+b.tier.salesCount+"/"+b.tier.tierSales+")"}</div>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {b.soldOut&&<span style={{fontSize:8,background:"#333",color:"#666",padding:"2px 6px",borderRadius:999,fontWeight:700}}>SOLD</span>}
                  {b.freeDownload&&<span style={{fontSize:8,background:"rgba(74,222,128,0.15)",color:"#4ade80",padding:"2px 6px",borderRadius:999,fontWeight:700}}>FREE</span>}
                  <span style={{color:GOLD,fontWeight:700,fontSize:11}}>R{b.price}</span>
                  <button onClick={()=>onToast(`Edit "${b.name}" — connect DB to enable`)} style={{padding:"3px 8px",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:5,color:C.text,fontSize:9,cursor:"pointer"}}>Edit</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>onToast("➕ Upload beat — connect AWS S3 to enable (see PDF guide)")} style={{marginTop:12,width:"100%",padding:"10px",background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.25)",borderRadius:9,color:GOLD,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Upload New Beat / Kit / Pack</button>
        </div>
      )}
      {tab==="pricing" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <p style={{color:C.muted,fontSize:12}}>Prices update live on the Licensing page.</p>
          {([["basicPrice","Basic MP3 Lease"],["premiumPrice","Premium WAV Lease"],["exclusivePrice","Exclusive Rights"]] as const).map(([key,label])=>(
            <div key={key}>
              <label style={{fontSize:10,color:C.muted,marginBottom:5,display:"block"}}>{label}</label>
              <div style={{display:"flex",gap:0}}>
                <span style={{padding:"9px 11px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:"8px 0 0 8px",color:GOLD,fontSize:13}}>R</span>
                <input type="number" value={admin[key]} onChange={e=>setAdmin((a:AdminSettings)=>({...a,[key]:Number(e.target.value)}))} className="inp" style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderLeft:"none",borderRadius:"0 8px 8px 0",padding:"9px 12px",color:C.text,fontSize:13,outline:"none"}}/>
              </div>
            </div>
          ))}
          <button onClick={()=>onToast("✅ Prices saved!")} style={{padding:"10px",background:GOLD,border:"none",borderRadius:9,color:"#000",fontSize:12,fontWeight:800,cursor:"pointer"}}>Save Prices</button>
        </div>
      )}
      {tab==="codes" && (
        <div>
          <p style={{color:C.muted,fontSize:12,marginBottom:14}}>Discount codes applied at checkout. Buy 2 Get 1 Free is automatic (3+ beats in cart).</p>
          {admin.discountCodes.map((dc,i)=>(
            <div key={dc.code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:GOLD}}>{dc.code}</span> <span style={{fontSize:11,color:C.muted}}>— {dc.percent}% off</span></div>
              <button onClick={()=>setAdmin((a:AdminSettings)=>({...a,discountCodes:a.discountCodes.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:"#e74c3c",cursor:"pointer",fontSize:14}}>✕</button>
            </div>
          ))}
          <div style={{display:"flex",gap:7,marginTop:14}}>
            <input className="inp" placeholder="Code" value={newCode} onChange={e=>setNewCode(e.target.value.toUpperCase())} style={{flex:2,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 11px",color:C.text,fontSize:12,outline:"none"}}/>
            <input className="inp" type="number" placeholder="%" value={newPct} onChange={e=>setNewPct(e.target.value)} style={{width:54,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 9px",color:C.text,fontSize:12,outline:"none"}}/>
            <button onClick={()=>{if(!newCode)return;setAdmin((a:AdminSettings)=>({...a,discountCodes:[...a.discountCodes,{code:newCode,percent:Number(newPct)}]}));setNewCode("");onToast("✅ Code added!");}} style={{padding:"8px 13px",background:GOLD,border:"none",borderRadius:7,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>Add</button>
          </div>
        </div>
      )}
      {tab==="socials" && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <p style={{color:C.muted,fontSize:12}}>These appear as clickable links in the footer.</p>
          {([["youtube","YouTube URL"],["instagram","Instagram URL"],["tiktok","TikTok URL"],["whatsapp","WhatsApp URL (wa.me/...)"]] as const).map(([key,label])=>(
            <div key={key}>
              <label style={{fontSize:10,color:C.muted,marginBottom:4,display:"block"}}>{label}</label>
              <input className="inp" type="url" value={admin.socialLinks[key]} onChange={e=>setAdmin((a:AdminSettings)=>({...a,socialLinks:{...a.socialLinks,[key]:e.target.value}}))} style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:12,outline:"none"}}/>
            </div>
          ))}
          <button onClick={()=>onToast("✅ Social links saved!")} style={{padding:"10px",background:GOLD,border:"none",borderRadius:9,color:"#000",fontSize:12,fontWeight:800,cursor:"pointer"}}>Save Links</button>
        </div>
      )}
      {tab==="content" && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <label style={{fontSize:10,color:C.muted}}>Announcement Bar Text</label>
          <textarea value={admin.announcementText} onChange={e=>setAdmin((a:AdminSettings)=>({...a,announcementText:e.target.value}))} rows={4} className="inp" style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:12,outline:"none",resize:"vertical"}}/>
          <button onClick={()=>onToast("✅ Content updated!")} style={{padding:"10px",background:GOLD,border:"none",borderRadius:9,color:"#000",fontSize:12,fontWeight:800,cursor:"pointer"}}>Save</button>
        </div>
      )}
      {tab==="logo" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <p style={{color:C.muted,fontSize:12}}>Paste an image URL to replace the spinning disc with your logo. Square format works best.</p>
          {admin.logoImage&&<img src={admin.logoImage} alt="Logo preview" style={{width:72,height:72,borderRadius:"50%",objectFit:"cover",border:`2px solid ${GOLD}`}}/>}
          <input className="inp" type="url" placeholder="Image URL (https://...)" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:12,outline:"none"}}/>
          <button onClick={()=>{setAdmin((a:AdminSettings)=>({...a,logoImage:logoUrl}));onToast("✅ Logo applied!");}} style={{padding:"10px",background:GOLD,border:"none",borderRadius:9,color:"#000",fontSize:12,fontWeight:800,cursor:"pointer"}}>Apply Logo</button>
          {admin.logoImage&&<button onClick={()=>{setAdmin((a:AdminSettings)=>({...a,logoImage:""}));setLogoUrl("");onToast("Logo reset.");}} style={{padding:"9px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:9,color:C.muted,fontSize:12,cursor:"pointer"}}>Reset to Default Disc</button>}
        </div>
      )}
    </div>
  );
}
