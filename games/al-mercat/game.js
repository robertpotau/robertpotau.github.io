"use strict";
/* Al Mercat! — lògica del joc */
const $=id=>document.getElementById(id);
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const NB=" ";

/* ───────── Emmagatzematge ───────── */
const store={
  get(k,d){try{const v=localStorage.getItem("mercat."+k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){try{localStorage.setItem("mercat."+k,JSON.stringify(v));}catch(e){}}
};
let settings=Object.assign({palette:"mercat",sound:true,voice:true,autoRead:"auto",help:"auto",rounds:0,voiceLang:"ca",lastLang:"ca"},store.get("settings",{}));
let profiles=store.get("profiles",[null,null,null,null,null,null]);
while(profiles.length<6)profiles.push(null);
let cur=null;
const save=()=>{store.set("settings",settings);store.set("profiles",profiles);};
const P=()=>cur!=null?profiles[cur]:null;

/* ───────── Idioma ───────── */
const curLang=()=>{const p=P();return p?p.lang:(settings.lastLang||"ca");};
const tl=()=>{const l=curLang();return l==="ic"?(settings.voiceLang||"ca"):l;};
function t(k,v){
  const d=I18N[tl()]||I18N.ca;
  let s=d[k]!=null?d[k]:(I18N.ca[k]!=null?I18N.ca[k]:k);
  if(v&&typeof s==="string")for(const x in v)s=s.replace("{"+x+"}",v[x]);
  return s;
}
function applyI18n(){
  document.documentElement.lang=tl();
  document.body.classList.toggle("ic",curLang()==="ic");
  document.querySelectorAll("[data-i18n]").forEach(n=>{n.textContent=t(n.dataset.i18n);});
}

/* ───────── RNG ───────── */
let rnd=Math.random;
const ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const pick=a=>a[Math.floor(rnd()*a.length)];
function mulberry(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let x=Math.imul(seed^seed>>>15,1|seed);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
const todayStr=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
const yesterdayStr=()=>{const d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};

/* ───────── Diners: format ───────── */
function num(c){return c%100===0?String(c/100):(c/100).toFixed(2).replace(".",",");}
function eur(c){return num(c)+NB+"€";}
function kgTxt(g){return g<1000?g+NB+"g":(g/1000).toString().replace(".",",")+NB+"kg";}
function kgDec(g){return (g/1000).toString().replace(".",",")+NB+"kg";}
const DW={1:38,2:44,5:50,10:46,20:52,50:58,100:54,200:60,500:92,1000:98,2000:104,5000:110};
const isBill=v=>v>=500;

/* ───────── Diners: dibuixos SVG ───────── */
function coinSVG(v){
  let outer="gAu",inner=null;
  if(v===100){outer="gAu";inner="gAg";}else if(v===200){outer="gAg";inner="gAu";}else if(v<=5)outer="gCu";
  const n=v>=100?String(v/100):String(v),sub=v>=100?"EURO":"CENT";
  let s=`<svg class="dsv" viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="48" fill="url(#${outer})" stroke="rgba(0,0,0,.4)" stroke-width="2"/>`+
    `<circle cx="50" cy="50" r="41" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2" stroke-dasharray="2 3"/>`;
  if(inner)s+=`<circle cx="50" cy="50" r="31" fill="url(#${inner})" stroke="rgba(0,0,0,.4)" stroke-width="2"/>`;
  const fs=n.length===1?(v>=100?38:46):34,ty=v>=100?58:58;
  s+=`<text x="50" y="${ty}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${fs}" fill="#4a3210">${n}</text>`+
     `<text x="50" y="${v>=100?73:76}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${v>=100?9:11}" fill="#4a3210" fill-opacity=".8">${sub}</text></svg>`;
  return s;
}
function billSVG(v){
  const B={500:["#c9d3c6","#5f6f5b"],1000:["#f5a3a0","#a13a3a"],2000:["#9cc7f2","#2b62a3"],5000:["#f8c88f","#a9600f"]}[v];
  const n=v/100;
  return `<svg class="dsv" viewBox="0 0 140 76" width="100%" height="100%"><rect x="1" y="1" width="138" height="74" rx="7" fill="${B[0]}" stroke="${B[1]}" stroke-width="2"/>`+
   `<rect x="6" y="6" width="128" height="64" rx="4" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="1.5"/>`+
   `<path d="M78 68V40a22 22 0 0 1 44 0v28z" fill="#fff" fill-opacity=".45" stroke="${B[1]}" stroke-width="1.5"/>`+
   `<path d="M85 68V42a15 15 0 0 1 30 0v26" fill="none" stroke="${B[1]}" stroke-opacity=".5" stroke-width="1.5"/>`+
   `<text x="14" y="52" font-family="Nunito,sans-serif" font-weight="900" font-size="${n>=10?36:44}" fill="${B[1]}">${n}</text>`+
   `<text x="14" y="22" font-family="Nunito,sans-serif" font-weight="900" font-size="11" fill="${B[1]}">EURO</text>`+
   `<text x="14" y="66" font-family="Nunito,sans-serif" font-weight="900" font-size="12" fill="${B[1]}">€</text>`+
   `<text x="100" y="19" text-anchor="middle" font-size="9" fill="${B[1]}">★ ★ ★ ★ ★</text></svg>`;
}
function dSVG(v){return isBill(v)?billSVG(v):coinSVG(v);}
function dBox(v,scale){
  const w=DW[v]*(scale||1),h=isBill(v)?w*76/140:w;
  return `style="width:calc(${w/16}rem*var(--cs));height:calc(${h/16}rem*var(--cs))"`;
}

/* ───────── So (WebAudio) ───────── */
let actx=null;
function tone(f,d,type,when,vol){
  if(!settings.sound)return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(),g=actx.createGain(),t0=actx.currentTime+(when||0);
    o.type=type||"sine";o.frequency.setValueAtTime(f,t0);
    g.gain.setValueAtTime(vol||.12,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);
    o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+d+.02);
  }catch(e){}
}
let noiseBuf=null;
function noise(d,when,vol,fq){
  if(!settings.sound)return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    if(!noiseBuf){const n=Math.floor(actx.sampleRate*.3);noiseBuf=actx.createBuffer(1,n,actx.sampleRate);const ch=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)ch[i]=Math.random()*2-1;}
    const buf=noiseBuf;
    const s=actx.createBufferSource(),f=actx.createBiquadFilter(),gn=actx.createGain(),t0=actx.currentTime+(when||0);
    s.buffer=buf;f.type="bandpass";f.frequency.value=fq||3000;f.Q.value=.8;
    gn.gain.setValueAtTime(vol||.1,t0);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);
    s.connect(f);f.connect(gn);gn.connect(actx.destination);s.start(t0,0,Math.min(d,.3));s.onended=()=>{try{s.disconnect();f.disconnect();gn.disconnect();}catch(e){}};
  }catch(e){}
}
const sfx={
  coin(v){const f=1500+Math.max(0,COINS.indexOf(v))*180;tone(f,.09,"triangle",0,.1);tone(f*1.4,.12,"triangle",.05,.08);},
  bill(v){const f={500:520,1000:620,2000:740,5000:880}[v]||600;noise(.14,0,.09,2800);noise(.1,.09,.06,3600);tone(f,.12,"sine",.02,.07);tone(f*1.5,.16,"sine",.09,.05);},
  chaching(){
    noise(.08,0,.12,5000);tone(1200,.08,"square",0,.06);tone(1600,.18,"triangle",.09,.1);
    [2093,2637,3136].forEach((f,i)=>tone(f,.7,"sine",.22+i*.02,.07));
    for(let i=0;i<9;i++)tone(1800+Math.random()*1400,.09,"triangle",.55+i*.07+Math.random()*.03,.07);
    tone(1568,.5,"sine",1.25,.05);
  },
  remove(){tone(700,.08,"triangle",0,.08);},
  ok(){[523,659,784,1047].forEach((f,i)=>tone(f,.18,"sine",i*.09,.12));},
  bad(){tone(200,.25,"sawtooth",0,.09);tone(150,.3,"sawtooth",.12,.08);},
  register(){tone(1200,.1,"square",0,.06);tone(1600,.25,"triangle",.1,.1);tone(2400,.3,"triangle",.2,.08);},
  trophy(){[659,784,988,1319].forEach((f,i)=>tone(f,.25,"triangle",i*.12,.12));},
  key(){tone(900,.04,"triangle",0,.05);}
};

/* ───────── Veu (TTS) ───────── */
function pickVoice(code){
  try{const vs=speechSynthesis.getVoices();return vs.find(v=>v.lang.toLowerCase().replace("_","-").startsWith(code))||null;}catch(e){return null;}
}
function speak(text){
  if(!settings.voice||!("speechSynthesis" in window)||!text)return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text),code=tl()==="es"?"es":"ca";
    u.lang=code==="es"?"es-ES":"ca-ES";const v=pickVoice(code);if(v)u.voice=v;u.rate=.88;
    speechSynthesis.speak(u);
  }catch(e){}
}
let warmed=false;
window.addEventListener("pointerdown",()=>{
  if(warmed)return;warmed=true;
  try{if("speechSynthesis" in window){speechSynthesis.getVoices();const u=new SpeechSynthesisUtterance(" ");u.volume=0;speechSynthesis.speak(u);}}catch(e){}
},{once:true});
function sayMoney(c){
  const S_=SAY[tl()],e=Math.floor(c/100),ct=c%100,p=[];
  if(e>0)p.push(e+" "+S_.euro[e===1?0:1]);
  if(ct>0)p.push((e>0?S_.with+" ":"")+ct+" "+S_.cent[ct===1?0:1]);
  return p.join(" ")||"0";
}
function sayWeight(g){
  const S_=SAY[tl()];
  if(g===500)return S_.halfKg;
  if(g<1000)return g+" "+S_.grams;
  if(g===1000)return S_.kgOne;
  return (g/1000).toString().replace(".",",")+" "+S_.kgs;
}
function speechText(){
  if(!R)return"";
  const r=R.r,S_=SAY[tl()],parts=[];
  if(r.kind==="pay"||R.step==="total"){
    const ls=r.lines.map(l=>{
      const p=PMAP[l.pid];
      if(l.mode==="kg")return `${sayWeight(l.grams)} ${S_.of(p.k[tl()])}. ${sayMoney(l.price)} ${S_.perKg}.`;
      const nm=p.n[tl()];
      return `${l.qty} ${nm[l.qty===1?0:1]}. ${S_.each} ${nm[0]} ${S_.costs} ${sayMoney(l.price)}.`;
    });
    parts.push(S_.buy+": "+ls.join(" "));
  }
  if(R.step==="total")parts.push(t("qTotal"));
  else if(R.step==="pay")parts.push(r.ask?t("qPay2",{n:sayMoney(r.total)}):t("qPay"));
  else{parts.push(`${S_.purchase} ${sayMoney(r.total)}. ${S_.custPays} ${sayMoney(r.given)}. ${S_.gives}`);}
  return parts.join(" ");
}
const autoReadOn=()=>settings.voice&&(settings.autoRead==="yes"||(settings.autoRead==="auto"&&curLang()==="ic"));

/* ───────── Rangs, avatars ───────── */
function rankIdx(xp){let i=0;RANKS.forEach((r,k)=>{if(xp>=r.xp)i=k;});return i;}
function rankName(p,i){const r=RANKS[i];const g=p.gender||"n";return tl()==="es"?r.es[g]:r[g];}
function applySkintone(base,mod){
  if(!mod)return base;
  const TONES=["","\u{1F3FB}","\u{1F3FC}","\u{1F3FD}","\u{1F3FE}","\u{1F3FF}"],skin=TONES[mod]||"";
  const z=base.indexOf("‍");
  return z!==-1?base.slice(0,z)+skin+base.slice(z):base+skin;
}
const avList=g=>g==="m"?AVATARS_MASC:g==="f"?AVATARS_FEM:AVATARS_NEUT;
function avatarOf(p){
  if(typeof p.avatar==="string")return p.avatar;
  const b=avList(p.gender)[p.avatar]||"🙂";
  return p.gender==="n"?b:applySkintone(b,p.skin);
}

/* ───────── Pantalles ───────── */
/* Ajust a la pantalla: la mida base (rem) s'adapta perquè el joc càpiga sense fer scroll */
let fitCap=1.6;
function fitScreen(){
  const root=document.documentElement,act=document.querySelector(".screen.active");if(!act)return;
  const vw=window.innerWidth,vh=window.innerHeight;
  if(act.id!=="scrGame"){root.style.fontSize=(16*Math.max(1,Math.min(1.35,vw/1000)))+"px";return;}
  const two=vw>=900||(vw>vh&&vw>=640),floor=vw<600?.9:.7;
  const top=Math.min(1.6,fitCap,two?vw/720:vw/390);
  for(let f=Math.max(top,floor);f>=floor-.001;f-=.05){
    root.style.fontSize=(16*f)+"px";
    if(root.scrollHeight<=vh+3&&root.scrollWidth<=vw+3){fitCap=f;return;}
  }
  fitCap=floor;root.style.fontSize=(16*floor)+"px";
}
window.addEventListener("resize",()=>{fitCap=1.6;fitScreen();});
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
  $("fabs").classList.toggle("hidden",id==="scrSplash"||id==="scrGame");
  window.scrollTo(0,0);
  if(id==="scrGame")fitCap=1.6;
  fitScreen();
}
function multiClick(elm,cb){
  let n=0,tm=null;
  elm.addEventListener("click",()=>{n++;clearTimeout(tm);tm=setTimeout(()=>n=0,3000);if(n>=5){n=0;cb();}});
}

/* Splash (4,1 s · barra 3,4 s · fade 0,48 s: estàndard fixat) */
function initSplash(){
  const ph=t("splash");
  $("splashPhrase").textContent=ph[Math.floor(Math.random()*ph.length)];
  $("splashSub").textContent=t("sub");
  const decos=["🍎","🥖","🥛","💶","🪙","🥚","🧃","🍬","🧀","🥕"];
  const pos=[{top:"9%",left:"7%",delay:"0s"},{top:"16%",right:"9%",delay:".5s"},{bottom:"24%",left:"11%",delay:"1s"},{top:"34%",right:"18%",delay:"1.5s"},
    {bottom:"14%",right:"8%",delay:".8s"},{top:"48%",left:"4%",delay:"1.2s"},{bottom:"36%",right:"30%",delay:".3s"},{top:"7%",left:"38%",delay:"1.7s"},
    {bottom:"8%",left:"40%",delay:".6s"},{top:"60%",right:"3%",delay:"1.1s"}];
  decos.forEach((d,i)=>{const n=el("div","deco-anim",d);const p=pos[i];for(const k in p){if(k==="delay")n.style.animationDelay=p[k];else n.style[k]=p[k];}$("splashDecos").appendChild(n);});
  setTimeout(()=>{
    const sp=$("scrSplash");sp.classList.add("fadeout");
    setTimeout(()=>{sp.classList.remove("active","fadeout");show("scrProfiles");renderProfiles();},480);
  },4100);
}

/* ───────── Perfils ───────── */
function renderLangbar(){
  const b=$("langbar");b.innerHTML="";
  [["ca","Català"],["es","Castellano"],["ic","🖼️🔊"]].forEach(([k,lbl])=>{
    const c=el("button","chip"+(settings.lastLang===k?" sel":""),lbl);
    c.onclick=()=>{settings.lastLang=k;save();applyI18n();renderProfiles();};
    b.appendChild(c);
  });
}
function renderProfiles(){
  cur=null;applyI18n();renderLangbar();
  $("verLine").textContent=`Al Mercat! v${VERSION} — ${VERSION_DATE.slice(0,4)}`;
  const g=$("slots");g.innerHTML="";
  profiles.forEach((p,i)=>{
    if(!p){
      const s=el("div","slot empty",`<div class="av">➕</div><div class="nm lbl">${t("newPlayer")}</div>`);
      s.onclick=()=>openCreate(i);g.appendChild(s);return;
    }
    const ri_=rankIdx(p.xp);
    const s=el("div","slot",`<div class="av">${avatarOf(p)}</div><div class="nm">${esc(p.name)}</div><div class="rk">${RANKS[ri_].e} <span class="lbl">${rankName(p,ri_)}</span></div><div class="xpv">${p.xp} XP</div>`);
    const d=el("button","del","✖");
    let armed=false,tm=null;
    d.onclick=e=>{
      e.stopPropagation();
      if(!armed){armed=true;d.classList.add("armed");d.textContent="🗑️ ?";tm=setTimeout(()=>{armed=false;d.classList.remove("armed");d.textContent="✖";},3000);}
      else{clearTimeout(tm);profiles[i]=null;save();renderProfiles();}
    };
    s.appendChild(d);
    s.onclick=()=>{cur=i;settings.lastLang=p.lang;save();applyI18n();showMenu();};
    g.appendChild(s);
  });
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let C=null;
function openCreate(slot){
  C={slot,name:"",gender:"n",skin:0,avatar:0,lang:settings.lastLang||"ca"};
  $("cName").value="";
  show("scrCreate");renderCreate();
}
function renderCreate(){
  applyI18n();
  const gs=$("cGender");gs.innerHTML="";
  [["m","👦","boy"],["f","👧","girl"],["n","🦊","neutral"]].forEach(([k,ic,lb])=>{
    const b=el("button","chip"+(C.gender===k?" sel":""),`${ic} <span class="lbl">${t(lb)}</span>`);
    b.onclick=()=>{C.gender=k;C.avatar=0;renderCreate();};gs.appendChild(b);
  });
  $("cSkinWrap").classList.toggle("hidden",C.gender==="n");
  const sk=$("cSkin");sk.innerHTML="";
  SKIN_SWATCHES.forEach((c,i)=>{const b=el("button","sw"+(C.skin===i?" sel":""));b.style.background=c;b.onclick=()=>{C.skin=i;renderCreate();};sk.appendChild(b);});
  const list=avList(C.gender);
  $("cPreview").textContent=C.gender==="n"?list[C.avatar]:applySkintone(list[C.avatar],C.skin);
  const ag=$("cAvatars");ag.innerHTML="";
  list.forEach((a,i)=>{const b=el("button","avb"+(C.avatar===i?" sel":""),C.gender==="n"?a:applySkintone(a,C.skin));b.onclick=()=>{C.avatar=i;renderCreate();};ag.appendChild(b);});
  const lg=$("cLang");lg.innerHTML="";
  [["ca","💬","#f59e0b","langCA","langCAd"],["es","🗨️","#ef4444","langES","langESd"],["ic","🖼️🔊","#22c55e","langIC","langICd"]].forEach(([k,ic,col,tt,dd])=>{
    const c=el("div","rich-card"+(C.lang===k?" sel":""),`<div class="rich-icon" style="font-size:1.2rem">${ic}</div><div class="rich-content"><div class="rich-title">${I18N[k==="es"?"es":"ca"][tt]}</div><div class="rich-desc">${I18N[k==="es"?"es":"ca"][dd]}</div></div>`);
    c.style.setProperty("--card-color",col);
    c.onclick=()=>{C.lang=k;settings.lastLang=k;renderCreate();};lg.appendChild(c);
  });
}
$("cBack").onclick=()=>{show("scrProfiles");renderProfiles();};
$("cGo").onclick=()=>{
  const name=$("cName").value.trim();
  if(!name){$("cName").focus();$("cName").style.borderColor="var(--bad)";return;}
  $("cName").style.borderColor="";
  const p={name,gender:C.gender,skin:C.skin,avatar:C.avatar,lang:C.lang,xp:0,trophies:[],lv:{},
    st:{sessions:0,rounds:0,ok1:0,ok2:0,fail:0,streak:0,best:0,changeOk:0,kgOk:0,coins:0,perfect:0},daily:{last:"",streak:0,total:0},created:Date.now()};
  profiles[C.slot]=p;cur=C.slot;settings.lastLang=C.lang;save();applyI18n();showMenu();
};

/* ───────── Menú ───────── */
function stars(n){return "⭐".repeat(n)+`<span class="off">${"⭐".repeat(3-n)}</span>`;}
function richCard(color,icon,title,desc,example,onClick,extra,cls,icx){
  const d=el("div","rich-card"+(cls?" "+cls:""),
    `<div class="rich-icon">${icon}${extra&&extra.num?`<span class="num">${extra.num}</span>`:""}</div><div class="rich-content"><div class="rich-title lbl">${title}</div>`+
    `<div class="rich-desc lbl">${desc}</div>${example?`<div class="rich-example lbl">${example}</div>`:""}${icx?`<div class="icx">${icx}</div>`:""}${extra&&extra.stars!=null?`<div class="stars">${stars(extra.stars)}</div>`:""}</div>`);
  d.style.setProperty("--card-color",color);d.onclick=onClick;return d;
}
const LEVEL_GROUPS=[["💶","grpEuros",1,3],["🪙","grpCents",4,5],["🔄","grpChange",6,7],["⚖️","grpKilos",8,10]];
const OPS={add:["➕","opAdd"],mul:["✖️","opMul"],sub:["➖","opSub"],dec:[",","opDec"],half:["½","opHalf"],quarter:["¼","opQuarter"]};
const ACTS={pay:["🛒","actPay"],total:["🧮","actTotal"],change:["🔄","actChange"],kg:["⚖️","actKg"]};
const tagsHTML=L=>L.acts.map(a=>`<span class="tag act">${ACTS[a][0]}<span class="lbl"> ${t(ACTS[a][1])}</span></span>`).join("")+L.ops.map(o=>`<span class="tag">${OPS[o][0]}<span class="lbl"> ${t(OPS[o][1])}</span></span>`).join("");
const miniHTML=(L,sc)=>L.denoms.map(v=>`<span class="mc" ${dBox(v,sc)}>${dSVG(v)}</span>`).join("");
const helpFor=lv=>settings.help==="always"||(settings.help==="auto"&&lv<=4);
function levelCard(L,p,cls){
  const tx=I18N[tl()].lv[L.id-1],x=LVX[tl()][L.id-1],lvd=p.lv[L.id]||{stars:0},n=settings.rounds||L.rounds;
  const d=el("div","rich-card lv"+(cls?" "+cls:""),
    `<div class="rich-icon">${L.icon}<span class="num">${L.id}</span></div><div class="rich-content">`+
    `<div class="rich-title lbl">${tx.t}</div><div class="tags">${tagsHTML(L)}</div>`+
    `<div class="dolearn lbl"><b>${t("doLbl")}:</b> ${x.do}<br><b>${t("learnLbl")}:</b> ${x.learn}</div>`+
    `<div class="icx">${L.ic}</div><div class="mini">${miniHTML(L,.5)}</div>`+
    `<div class="lvmeta"><span class="stars">${stars(lvd.stars||0)}</span><span>🛒 ${n}<span class="lbl"> ${t("nRounds")}</span></span>`+
    `<span>🧮<span class="lbl"> ${helpFor(L.id)?t("helpOn"):t("helpOff")}</span></span>${lvd.best?`<span>🏅 ${lvd.best}%</span>`:""}</div></div>`);
  d.style.setProperty("--card-color",L.color);d.onclick=()=>openBrief(L.id);return d;
}

/* Presentació del nivell amb exemple animat */
let briefTm=[];
function stopBrief(){briefTm.forEach(clearTimeout);briefTm=[];}
const later=(fn,ms)=>briefTm.push(setTimeout(fn,ms));
function openBrief(lv){
  const L=LEVELS[lv-1],tx=I18N[tl()].lv[lv-1],x=LVX[tl()][lv-1];
  openOv(`<div class="brief"><div class="bh"><div class="rich-icon" style="--card-color:${L.color}">${L.icon}</div><div><h2>${tx.t}</h2><div class="tags">${tagsHTML(L)}</div></div><button class="iconbtn" data-close style="margin-left:auto">✖</button></div>`+
    `<div class="dolearn lbl" style="margin-top:.6rem;font-size:.95rem"><b>${t("doLbl")}:</b> ${x.do}<br><b>${t("learnLbl")}:</b> ${x.learn}</div>`+
    `<div class="stage" id="bStage"></div>`+
    `<div class="zone-title"><span>🪙 <span class="lbl">${t("payWith")}</span></span></div><div class="mini">${miniHTML(L,.8)}</div>`+
    `<div class="btnrow"><button class="btn ghost" id="bReplay">🔁 <span class="lbl">${t("replay")}</span></button><button class="btn yellow big" id="bPlay">▶ <span class="lbl">${t("play")}</span></button></div></div>`,
    ()=>{
      $("bPlay").onclick=()=>{closeOv();startSession(lv,false);};
      $("bReplay").onclick=()=>runBrief(L);
      runBrief(L);
      if(autoReadOn())speak(tx.t+". "+x.do);
    },true);
}
function runBrief(L){
  stopBrief();
  const ex=L.ex,st=$("bStage");if(!st)return;
  const isCh=ex.kind==="change";
  const cust=isCh?`<div class="customer"><div class="cav">🧑</div><div style="width:calc((${DW[ex.given]})/16*1rem);height:calc((${DW[ex.given]*76/140})/16*1rem)">${billSVG(ex.given)}</div><div style="font-size:1.4rem;font-weight:900">${eur(ex.given)}</div></div>`:"";
  st.innerHTML=`<div class="lrows">${ex.lines.map(rowHTML).join("")}</div>${isCh?`<div class="totalline">🧾 ${t("purchase")}: ${eur(ex.total)}</div>`:""}${cust}`+
    `<div class="counter" id="bCounter"><div class="hintdrop">🪙💶</div></div><div class="sumline"><span>${isCh?"🪙 "+t("change"):"💶 "+t("total")}</span><b id="bSum">0 €</b></div><div class="eqline" id="bEq"></div>`;
  let sum=0,delay=1100;
  ex.coins.forEach(v=>{
    later(()=>{
      const c=$("bCounter");if(!c)return;
      const h=c.querySelector(".hintdrop");if(h)h.remove();
      const b=el("span","cItem"+(isBill(v)?" bill":""),dSVG(v));b.setAttribute("style",dBox(v,.8).slice(7,-1));c.appendChild(b);
      sum+=v;$("bSum").textContent=eur(sum);
      if(isBill(v))sfx.bill(v);else sfx.coin(v);
    },delay);
    delay+=800;
  });
  later(()=>{const e=$("bEq");if(e){e.innerHTML="✔ "+equation(ex,isCh?"change":"pay");sfx.register();}},delay+250);
  later(()=>runBrief(L),delay+4200);
}

function showMenu(){
  const p=P();applyI18n();show("scrMenu");
  const ri_=rankIdx(p.xp),nx=RANKS[ri_+1];
  const pct=nx?Math.round((p.xp-RANKS[ri_].xp)/(nx.xp-RANKS[ri_].xp)*100):100;
  $("pbar").innerHTML=`<div class="av">${avatarOf(p)}</div><div class="info"><div class="nm">${esc(p.name)}</div><div class="rk">${RANKS[ri_].e} <span class="lbl">${rankName(p,ri_)}</span></div>`+
    `<div class="xpbar"><i style="width:${pct}%"></i></div><div class="xplbl">${nx?`<span class="lbl">${t("xpMissing",{n:nx.xp-p.xp,r:nx.e+" "+rankName(p,ri_+1)})}</span><span class="icx">${nx.xp-p.xp} XP → ${nx.e}</span>`:`🏆 <span class="lbl">${t("xpMax")}</span>`} · ${p.xp} XP</div></div>`;
  // Repte del dia
  const db=$("dailyBox");db.innerHTML="";
  const done=p.daily.last===todayStr();
  db.appendChild(richCard("#8b5cf6","📅",t("dailyTitle"),done?t("dailyDone"):t("dailyDesc"),p.daily.streak>0?`🔥 ${p.daily.streak} ${t("dailyStreak")}`:"",()=>{if(!done)startSession(0,true);else{sfx.remove();}},{stars:null},done?"":"rec","📅 ×6"+(p.daily.streak>0?" 🔥"+p.daily.streak:"")));
  if(done)db.firstChild.style.opacity=.6;
  // Nivells (en 4 blocs)
  const lg=$("levelGrid");lg.innerHTML="";
  let recDone=false;
  LEVEL_GROUPS.forEach(([ic,key,a,b])=>{
    lg.appendChild(el("div","lvgroup",`<i>${ic}</i><span class="lbl">${t(key)}</span><small>${a}–${b}</small>`));
    const gr=el("div","rich-grid");
    for(let n=a;n<=b;n++){
      const L=LEVELS[n-1],st=(p.lv[L.id]&&p.lv[L.id].stars)||0;
      let cls="";if(!recDone&&st===0){cls="rec";recDone=true;}
      gr.appendChild(levelCard(L,p,cls));
    }
    lg.appendChild(gr);
  });
}
$("bSwitch").onclick=()=>{save();show("scrProfiles");renderProfiles();};
$("bTroph").onclick=openTrophies;
$("bStats").onclick=openStats;
$("bCredits").onclick=openCredits;
multiClick($("brandTitle"),openTeacher);
multiClick($("menuBrand"),openTeacher);
$("verLine").onclick=(()=>{let n=0,tm=null;return()=>{n++;clearTimeout(tm);tm=setTimeout(()=>n=0,3000);if(n>=5){n=0;openTeacher();}};})();

/* ───────── Generador de compres ───────── */
let lastKey="";
function productsFor(mode){
  return PRODUCTS.filter(p=>(mode==="kg"?!!p.k&&!!p.kp:!!p.n));
}
function genRound(lv){
  const L=LEVELS[lv-1];
  for(let tries=0;tries<300;tries++){
    const n=ri(L.lines[0],L.lines[1]),used=new Set(),lines=[];
    let ok=true;
    for(let k=0;k<n;k++){
      let pool=productsFor(L.mode).filter(p=>!used.has(p.id));
      if(L.cats)pool=pool.filter(p=>L.cats.includes(p.cat));
      if(L.mode==="kg")pool=pool.filter(p=>p.kp[0]<=L.kgcap);
      if(!pool.length){ok=false;break;}
      const p=pick(pool);used.add(p.id);
      if(L.mode==="kg"){
        const price=ri(p.kp[0],Math.min(p.kp[1],L.kgcap))*100,grams=pick(L.kgw);
        lines.push({pid:p.id,mode:"kg",price,grams,qty:1,total:price*grams/1000});
      }else{
        let cand=L.pool.filter(c=>c<=p.uMax&&c>=(p.uMin||0));if(!cand.length)cand=L.pool.filter(c=>c<=p.uMax);if(!cand.length)cand=[Math.min(...L.pool)];
        const price=pick(cand),qty=ri(L.qty[0],L.qty[1]);
        lines.push({pid:p.id,mode:"u",price,qty,total:price*qty});
      }
    }
    if(!ok)continue;
    const total=lines.reduce((a,l)=>a+l.total,0);
    if(total<=0||total>L.max)continue;
    const key=lines.map(l=>l.pid+l.qty+l.grams).join("|");
    if(key===lastKey&&tries<100)continue;
    lastKey=key;
    const r={lv,kind:L.kind,ask:L.ask,lines,total,denoms:L.denoms.slice(),given:0,change:0};
    if(L.kind==="change"){
      const cands=BILLS.filter(b=>b>total);
      if(!cands.length)continue;
      r.given=(cands[1]&&rnd()<.35)?cands[1]:cands[0];
      r.change=r.given-total;
      r.denoms=L.denoms.filter(d=>d<r.given);
    }
    return r;
  }
  return null;
}
function solve(amount,denoms){
  const out=[];let a=amount;
  denoms.slice().sort((x,y)=>y-x).forEach(d=>{while(a>=d){out.push(d);a-=d;}});
  return out;
}

/* ───────── Sessió ───────── */
let S=null,R=null;
function startSession(lv,daily){
  const p=P();
  S={lv,daily,rounds:[],i:0,ok1:0,ok2:0,fail:0,xp:0,streak:0,coins:0,res:[]};
  let n=daily?6:(settings.rounds||LEVELS[lv-1].rounds);
  if(daily){
    let maxL=1;for(const k in p.lv)if(p.lv[k].stars>0)maxL=Math.max(maxL,+k);
    maxL=Math.min(10,Math.max(2,maxL+1));
    rnd=mulberry(hashStr(todayStr()+"|"+maxL));
    lastKey="";
    for(let k=0;k<n;k++){const r=genRound(ri(1,maxL));if(r)S.rounds.push(r);}
    rnd=Math.random;
  }else{
    lastKey="";
    for(let k=0;k<n;k++){const r=genRound(lv);if(r)S.rounds.push(r);}
  }
  show("scrGame");
  renderRound();
}
const helperOn=()=>settings.help==="always"||(settings.help==="auto"&&R&&R.r.lv<=4);
const MAXATT=3;

function rowHTML(l){
  const p=PMAP[l.pid];
  if(l.mode==="kg"){
    const cells=l.grams/250,bars=Math.ceil(cells/4);let kb="";
    for(let b=0;b<bars;b++){let c="";for(let i=0;i<4;i++)c+=`<i class="${b*4+i<cells?"f":""}"></i>`;kb+=`<div class="kb">${c}</div>`;}
    return `<div class="lrow"><div class="lemo">⚖️${p.e}</div><div class="ltxt"><span class="qty">${kgTxt(l.grams)}<span class="lbl"> ${SAY[tl()].of(p.k[tl()])}</span></span>`+
      `<span class="ptag"><span class="pe">1 kg</span> = <b>${eur(l.price)}</b></span><div class="kbar">${kb}</div></div></div>`;
  }
  const nm=p.n[tl()];
  return `<div class="lrow"><div class="lemo">${p.e.repeat(Math.min(l.qty,10))}</div><div class="ltxt"><span class="qty">${l.qty}<span class="lbl"> ${nm[l.qty===1?0:1]}</span></span>`+
    `<span class="ptag"><span class="pe">${p.e}</span> = <b>${eur(l.price)}</b><span class="lbl"> (${t("each")} ${nm[0]})</span></span></div></div>`;
}
function renderRound(){
  const r=S.rounds[S.i];
  R={r,step:r.ask?"total":(r.kind==="change"?"change":"pay"),att:0,err:0,placed:[],num:"",done:false,revealed:false};
  const L=LEVELS[r.lv-1];
  $("gTitle").textContent=S.daily?`📅 ${t("dailyTitle")}`:`${L.icon} ${t("level")} ${r.lv}`;
  const dots=$("gDots");dots.innerHTML="";
  S.rounds.forEach((_,i)=>{dots.appendChild(el("div","dot"+(i<S.i?(" "+(S.res[i]||"ok")):(i===S.i?" cur":""))));});
  $("lrows").innerHTML=r.lines.map(rowHTML).join("");
  $("kAv").textContent=pick(["🧑‍🌾","👩‍🌾","🧑‍🍳","👨‍🌾","👩‍🍳"]);
  fitCap=1.6;setStepUI(true);fitScreen();
}
function setStepUI(speakNow){
  const r=R.r;
  R.num="";R.placed=[];R.done=false;R.att=0;
  $("stepPay").classList.remove("done");
  $("fb").innerHTML="";$("hintBox").classList.add("hidden");$("hintBox").innerHTML="";
  $("bHint").classList.remove("hidden");
  const known=r.ask?R.step!=="total":r.kind==="change";
  $("totalLine").innerHTML=known?`<div class="totalline">🧾 ${t("purchase")}: ${eur(r.total)}</div>`:"";
  const cb=$("custBox");
  if(r.kind==="change"){
    cb.innerHTML=(R.step==="change")?`<div class="customer"><div class="cav">🧑</div><div><div class="lbl" style="font-size:.85rem">${t("custPays")}</div><div style="width:calc(${(DW[r.given])/16}rem*var(--cs));height:calc(${(DW[r.given]*76/140)/16}rem*var(--cs))">${billSVG(r.given)}</div></div><div style="font-size:1.6rem;font-weight:900">${eur(r.given)}</div></div>`:"";
  }else cb.innerHTML="";
  let ico="",txt="";
  if(R.step==="total"){ico="🧮❓";txt=t("qTotal");}
  else if(R.step==="pay"){ico=r.ask?"💶✅":"🛒💶";txt=r.ask?t("qPay2",{n:eur(r.total)}):t("qPay");}
  else{ico="💶➡️🪙";txt=t("qChange");}
  $("bubble").innerHTML=`<span class="ico">${ico}</span><span class="lbl">${txt}</span>`;
  $("stepTotal").classList.toggle("hidden",R.step!=="total");
  $("stepPay").classList.toggle("hidden",R.step==="total");
  if(R.step==="total")buildNumpad();
  else{
    $("zoneName").textContent=R.step==="pay"?"💶 "+t("toPay"):"🪙 "+t("toGive");
    $("payLbl").textContent=R.step==="pay"?t("pay"):t("giveChange");
    buildTray();renderCounter();
  }
  if(speakNow&&autoReadOn())setTimeout(()=>speak(speechText()),350);
}

/* Teclat numèric */
function buildNumpad(){
  const np=$("numPad");np.innerHTML="";
  ["1","2","3","4","5","6","7","8","9",",","0","⌫"].forEach(k=>{
    const b=el("button","",k);b.onclick=()=>numKey(k);np.appendChild(b);
  });
  const ok=el("button","ok","✔ OK");ok.onclick=()=>numKey("OK");np.appendChild(ok);
  showNum();
}
function showNum(){$("numDisp").textContent=(R.num||"0")+NB+"€";}
function numKey(k){
  if(!R||R.done||R.step!=="total")return;
  sfx.key();
  if(k==="⌫")R.num=R.num.slice(0,-1);
  else if(k==="OK")return checkTotal();
  else if(k===","){if(!R.num.includes(",")){R.num=(R.num||"0")+",";}}
  else{
    const d=R.num.split(",")[1];
    if(d!=null&&d.length>=2)return;
    if(R.num.replace(",","").length>=6)return;
    R.num=(R.num==="0"?"":R.num)+k;
  }
  showNum();
}
window.addEventListener("keydown",e=>{
  if(!$("scrGame").classList.contains("active")||!R||R.step!=="total"||R.done||$("ov").classList.contains("open"))return;
  if(/^[0-9]$/.test(e.key))numKey(e.key);
  else if(e.key===","||e.key===".")numKey(",");
  else if(e.key==="Backspace")numKey("⌫");
  else if(e.key==="Enter")numKey("OK");
});
function checkTotal(){
  const v=Math.round(parseFloat((R.num||"0").replace(",","."))*100);
  if(v===R.r.total){
    sfx.ok();
    R.step=R.r.kind==="change"?"change":"pay";
    const err=R.err;setStepUI(false);R.err=err;fitScreen();
    $("fb").innerHTML=`<div class="fb ok">✔ ${t("correct")} ${eur(R.r.total)}</div>`;
    if(autoReadOn())speak(speechText());
  }else{
    R.att++;R.err++;sfx.bad();
    $("fb").innerHTML=`<div class="fb no">✖ ${t("wrongTotal")}</div>`;
    showHint();
    if(R.att>=MAXATT){
      R.revealed=true;
      R.step=R.r.kind==="change"?"change":"pay";
      const err=R.err;setStepUI(false);R.err=err;R.revealed=true;
      $("fb").innerHTML=`<div class="fb info">${t("answerIs")} <b>${eur(R.r.total)}</b><div class="eq">${equation(R.r,"total")}</div></div>`;
    }
  }
}

/* Safata i mostrador */
function buildTray(){
  const tr=$("tray");tr.innerHTML="";
  const ds=R.r.denoms.slice().sort((a,b)=>a-b);
  ds.forEach(v=>{
    const b=el("button","tItem",dSVG(v));b.setAttribute("style",dBox(v).slice(7,-1));b.setAttribute("aria-label",eur(v));
    bindDrag(b,v);tr.appendChild(b);
  });
}
function inCounter(x,y){const r=$("counter").getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;}
function bindDrag(btn,v){
  btn.addEventListener("pointerdown",e=>{
    if(!R||R.done||R.step==="total")return;
    e.preventDefault();
    const sx=e.clientX,sy=e.clientY;let ghost=null,moved=false;
    const move=ev=>{
      if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)>8){
        moved=true;ghost=el("div","dragghost",dSVG(v));ghost.setAttribute("style",dBox(v).slice(7,-1));document.body.appendChild(ghost);
      }
      if(ghost){ghost.style.left=ev.clientX+"px";ghost.style.top=ev.clientY+"px";$("counter").classList.toggle("over",inCounter(ev.clientX,ev.clientY));}
    };
    const up=ev=>{
      window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);
      if(ghost)ghost.remove();$("counter").classList.remove("over");
      if(!moved||inCounter(ev.clientX,ev.clientY))addMoney(v);
    };
    window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);
  });
}
function addMoney(v){
  if(!R||R.done||R.placed.length>=40)return;
  R.placed.push(v);if(isBill(v))sfx.bill(v);else sfx.coin(v);renderCounter();
}
function removeMoney(v){
  if(!R||R.done)return;
  const i=R.placed.indexOf(v);if(i>=0){R.placed.splice(i,1);sfx.remove();renderCounter();}
}
const sumPlaced=()=>R.placed.reduce((a,b)=>a+b,0);
function renderCounter(){
  const c=$("counter");c.innerHTML="";
  if(!R.placed.length)c.appendChild(el("div","hintdrop","👆 🪙💶"));
  R.placed.slice().sort((a,b)=>b-a).forEach(v=>{
    const b=el("button","cItem"+(isBill(v)?" bill":""),dSVG(v));b.setAttribute("style",dBox(v,.85).slice(7,-1));
    b.onclick=()=>removeMoney(v);c.appendChild(b);
  });
  $("sumBox").textContent=helperOn()?eur(sumPlaced()):"?";
}
$("bClear").onclick=()=>{if(!R||R.done)return;R.placed=[];sfx.remove();renderCounter();};
$("bPay").onclick=()=>{
  if(!R||R.done||R.step==="total")return;
  const sum=sumPlaced(),target=R.step==="pay"?R.r.total:R.r.change;
  if(!R.placed.length)return;
  if(sum===target){R.coins=R.placed.length;completeRound();return;}
  R.att++;R.err++;sfx.bad();
  $("fb").innerHTML=`<div class="fb no">✖ ${sum>target?t("tooMuch"):t("tooLittle")}</div>`;
  showHint();
  if(R.att>=MAXATT){
    R.revealed=true;R.placed=solve(target,R.r.denoms);R.coins=0;renderCounter();completeRound();
  }
};

/* Ajuda */
function hintHTML(){
  const r=R.r;
  if(R.step==="change")return `${eur(r.given)} − ${eur(r.total)} = ?<br><span class="lbl">${t("hUp")}</span>`;
  const knownTotal=r.ask?R.step!=="total":r.kind==="change";
  if(R.step==="pay"&&knownTotal){
    const rem=r.total-sumPlaced();
    return `${eur(r.total)} − ${eur(sumPlaced())} = ${rem>=0?eur(rem):"?"}`;
  }
  return r.lines.map(l=>{
    if(l.mode==="kg"){
      const full=Math.floor(l.grams/1000),rem=l.grams%1000,seg=[];
      const pr=eur(l.price);
      if(full>0)seg.push(Array(full).fill(pr).join(" + "));
      let extra="";
      if(rem===500)extra=`<br><span class="lbl">${t("hHalf",{p:pr})}</span>`;
      else if(rem===250)extra=`<br><span class="lbl">${t("hQuarter",{p:pr})}</span>`;
      else if(rem===750)extra=`<br><span class="lbl">${t("hQuarter",{p:pr})} × 3</span>`;
      if(rem>0)seg.push(rem===500?"½ kg":(rem/250)+" × ¼ kg");
      return `${kgTxt(l.grams)}: ${seg.join(" + ")} = ?${extra}`;
    }
    return (l.qty<=6?Array(l.qty).fill(eur(l.price)).join(" + "):`${l.qty} × ${eur(l.price)}`)+" = ?";
  }).join("<br>+ ");
}
function showHint(){const h=$("hintBox");h.innerHTML=hintHTML();h.classList.remove("hidden");}
$("bHint").onclick=()=>{if(!R)return;const h=$("hintBox");if(h.classList.contains("hidden"))showHint();else h.classList.add("hidden");};

/* Equació resum */
function equation(r,step){
  if(step==="change")return `${eur(r.given)} − ${eur(r.total)} = <b>${eur(r.change)}</b>`;
  const parts=r.lines.map(l=>l.mode==="kg"?`${kgDec(l.grams)} × ${eur(l.price)}`:`${l.qty} × ${eur(l.price)}`);
  return `${parts.join(" + ")} = <b>${eur(r.total)}</b>`;
}

/* Final de compra */
function completeRound(){
  R.done=true;$("stepPay").classList.add("done");
  const r=R.r,p=P(),L=LEVELS[r.lv-1];
  const failed=R.revealed;
  let base=failed?0:(R.err===0?6:R.err===1?3:1);
  const xp=Math.round(base*L.mult);
  S.xp+=xp;p.xp+=xp;
  p.st.rounds++;
  if(failed){p.st.fail++;S.fail++;S.streak=0;p.st.streak=0;}
  else{
    if(R.err===0){p.st.ok1++;S.ok1++;S.streak++;p.st.streak++;p.st.best=Math.max(p.st.best,p.st.streak);}
    else{p.st.ok2++;S.ok2++;S.streak=0;p.st.streak=0;}
    p.st.coins+=R.coins||0;
    if(r.kind==="change")p.st.changeOk++;
    if(r.lines[0].mode==="kg")p.st.kgOk++;
  }
  S.res=S.res||[];S.res[S.i]=failed?"bad":(R.err===0?"ok":"ok2");
  save();
  sfx.register();
  const eq=equation(r,r.kind==="change"?"change":"pay");
  const last=S.i>=S.rounds.length-1;
  $("fb").innerHTML=`<div class="fb ${failed?"info":"ok"}">${failed?`${t("answerIs")}`:"🎉 "+t("correct")}<div class="eq">${eq}</div>`+
    (xp?`<div class="xpg">+${xp} XP</div>`:"")+`<button class="btn yellow big full" id="bNext">➡️ <span class="lbl">${last?t("finish"):t("next")}</span></button></div>`;
  $("bNext").onclick=()=>{if(last)finishSession();else{S.i++;renderRound();}};
  if(!failed){confetti(R.err===0?14:6);floatXp(xp);}
  $("bHint").classList.add("hidden");
  checkTrophies();
}
function floatXp(xp){if(!xp)return;const f=el("div","xpfloat","+"+xp+" XP");f.style.left="50%";f.style.top="45%";document.body.appendChild(f);setTimeout(()=>f.remove(),1400);}
function confetti(n){
  const em=["💶","🪙","⭐","🎉","✨"];
  for(let i=0;i<n;i++){const c=el("div","conf",pick(em));c.style.left=Math.random()*100+"vw";c.style.animationDelay=Math.random()*.6+"s";document.body.appendChild(c);setTimeout(()=>c.remove(),3200);}
}

/* Final de partida */
function finishSession(){
  const p=P(),n=S.rounds.length;
  const ratio=S.ok1/n;
  const st=ratio>=.8?3:ratio>=.5?2:1;
  p.st.sessions++;
  const perfect=S.ok1===n;
  if(perfect)p.st.perfect++;
  let bonus=0,dailyMsg="";
  if(S.daily){
    bonus=20+(perfect?10:0);
    const y=yesterdayStr();
    p.daily.streak=(p.daily.last===y)?p.daily.streak+1:1;
    p.daily.last=todayStr();p.daily.total++;
    p.xp+=bonus;S.xp+=bonus;
  }else{
    const cur_=p.lv[S.lv]||{stars:0,plays:0};
    cur_.plays++;cur_.stars=Math.max(cur_.stars,st);cur_.best=Math.max(cur_.best||0,Math.round(ratio*100));p.lv[S.lv]=cur_;
  }
  const newT=checkTrophies(true);
  save();
  show("scrResult");
  const L=S.daily?null:LEVELS[S.lv-1];
  const starsHTML=Array.from({length:3},(_,i)=>`<span class="${i<st?"":"off"}">⭐</span>`).join("");
  let html=`<div class="res-emoji">${st>=2?"🎉":"👍"}</div><h2>${t("resultTitle")}</h2><div class="st">${starsHTML}</div>`+
    `<div class="line">✅ <span class="lbl">${t("resultAcc")}:</span> <b>${S.ok1}/${n}</b></div>`+
    `<div class="line">⭐ <span class="lbl">${t("xpGot")}:</span> <b>+${S.xp}</b>${bonus?` (📅 +${bonus})`:""}</div>`;
  if(S.daily&&p.daily.streak>1)html+=`<div class="line">🔥 ${p.daily.streak} ${t("dailyStreak")}</div>`;
  newT.forEach(id=>{const tr=TROPHIES.find(x=>x.id===id);html+=`<div class="newtr">${tr.i} ${t("newTrophy")} ${I18N[tl()].tr[id][0]}</div>`;});
  html+=`<button class="btn yellow big full" id="rAgain">🔁 <span class="lbl">${t("again")}</span></button>`;
  if(L&&S.lv<10)html+=`<button class="btn green big full" id="rNext">➡️ <span class="lbl">${t("nextLevel")}</span></button>`;
  html+=`<button class="btn ghost full" id="rMenu">🏠 <span class="lbl">${t("menu")}</span></button>`;
  $("resBox").innerHTML=html;
  const lv=S.lv,daily=S.daily;
  $("rAgain").onclick=()=>daily?showMenu():startSession(lv,false);
  if($("rNext"))$("rNext").onclick=()=>startSession(lv+1,false);
  $("rMenu").onclick=showMenu;
  sfx.chaching();if(st>=2)confetti(30);
  R=null;
}

/* Trofeus */
function checkTrophies(silent){
  const p=P();const got=[];
  TROPHIES.forEach(tr=>{
    if(!p.trophies.includes(tr.id)&&tr.t(p)){p.trophies.push(tr.id);got.push(tr.id);}
  });
  if(got.length){save();if(!silent){sfx.trophy();toast(got.map(id=>TROPHIES.find(x=>x.id===id).i+" "+I18N[tl()].tr[id][0]).join(" · "));}else{sfx.trophy();}}
  return got;
}
let toastTm=null;
function toast(msg,ic){const tt=$("toast");tt.textContent=(ic||"🏆")+" "+msg;tt.classList.add("show");clearTimeout(toastTm);toastTm=setTimeout(()=>tt.classList.remove("show"),3200);}

$("gExit").onclick=()=>{R=null;showMenu();};
$("gSay").onclick=()=>{if(R)speak(speechText());};

/* ───────── Overlays ───────── */
function openOv(html,after,wide){
  $("ovBox").className="ovbox"+(wide?" wide":"");$("ovBox").innerHTML=html;$("ov").classList.add("open");
  $("ovBox").querySelectorAll("[data-close]").forEach(b=>b.onclick=closeOv);
  if(after)after();
}
function closeOv(){stopBrief();$("ov").classList.remove("open");}
$("ov").addEventListener("pointerdown",e=>{if(e.target===$("ov"))closeOv();});
const ovHead=(title)=>`<div class="ovhead"><h2>${title}</h2><button class="iconbtn" data-close>✖</button></div>`;

function openTrophies(){
  const p=P();
  openOv(ovHead("🏆 "+t("trophies"))+`<div class="trgrid">`+TROPHIES.map(tr=>{
    const has=p.trophies.includes(tr.id),x=I18N[tl()].tr[tr.id];
    return `<div class="tr ${has?"":"lock"}"><div class="ti">${tr.i}</div><div class="tn">${x[0]}</div><div class="td">${x[1]}</div></div>`;
  }).join("")+`</div>`);
}
function openStats(){
  const p=P(),s=p.st,tot=s.ok1+s.ok2+s.fail,acc=tot?Math.round(s.ok1/tot*100):0,ri_=rankIdx(p.xp);
  const box=(v,l)=>`<div class="stbox"><b>${v}</b><span>${l}</span></div>`;
  openOv(ovHead("📊 "+t("stats"))+`<div class="center" style="font-size:3rem">${avatarOf(p)}</div><div class="center"><b>${esc(p.name)}</b> · ${RANKS[ri_].e} ${rankName(p,ri_)}</div><br>`+
   `<div class="stgrid">${box(p.xp,t("xpTotal"))}${box(s.sessions,t("sessions"))}${box(s.rounds,t("rounds"))}${box(acc+"%",t("precision"))}${box(s.best,t("bestStreak"))}${box(s.coins,t("coinsUsed"))}${box(p.trophies.length+"/"+TROPHIES.length,t("trophyCount"))}${box(p.daily.streak,"🔥 "+t("dailyStreak"))}</div>`);
}
function openCredits(){
  openOv(ovHead("ℹ️ "+t("credits"))+
   `<div class="credits-row"><div class="credits-icon">👨‍🏫</div><div class="credits-info"><strong>Robert Potau Nuñez</strong><span>${t("credRole")}</span></div></div>`+
   `<div class="credits-row"><div class="credits-icon">🤖</div><div class="credits-info"><strong>Claude Code · Anthropic</strong><span>${t("credClaude")}</span></div></div>`+
   `<div class="center" id="verClick" style="color:var(--text2);font-size:.85rem;margin-top:12px">Al Mercat! v${VERSION} — ${VERSION_DATE}</div>`,
   ()=>{multiClick($("verClick"),()=>{closeOv();openTeacher();});});
}
const PALS=[["mercat","🧺","Mercat"],["fruita","🍏","Fruita"],["mar","🌊","Mar"],["caramel","🍬","Caramel"],["nit","🌙","Nit"]];
$("fabPal").onclick=()=>{
  openOv(ovHead("🎨 "+t("palette"))+`<div class="seg" id="palSeg" style="flex-wrap:wrap"></div>`,()=>{
    const s=$("palSeg");PALS.forEach(([k,ic,n])=>{const b=el("button","chip"+(settings.palette===k?" sel":""),`${ic} ${n}`);b.onclick=()=>{setPalette(k);closeOv();};s.appendChild(b);});
  });
};
function setPalette(k){settings.palette=k;document.documentElement.dataset.palette=k;save();}
function chipRow(items,curVal,onPick){
  const d=el("div","seg");
  items.forEach(([v,l])=>{const c=el("button","chip"+(curVal===v?" sel":""),l);c.onclick=()=>onPick(v);d.appendChild(c);});
  return d;
}
function openSettings(teacher){
  const wrap=el("div");
  const row=(label,node)=>{const r=el("div","setrow");r.appendChild(el("span","sl",label));r.appendChild(node);wrap.appendChild(r);};
  const rerender=()=>{save();applyI18n();openSettings(teacher);};
  const yn=(key)=>chipRow([[true,t("on")],[false,t("off")]],settings[key],v=>{settings[key]=v;rerender();});
  const p=P();
  if(p)row("🌍 "+t("language"),chipRow([["ca","Català"],["es","Castellano"],["ic","🖼️🔊"]],p.lang,v=>{p.lang=v;settings.lastLang=v;rerender();if(cur!=null&&$("scrMenu").classList.contains("active"))showMenu();}));
  row("🔊 "+t("sound"),yn("sound"));
  row("🗣️ "+t("voice"),yn("voice"));
  row("📖 "+t("autoRead"),chipRow([["auto",t("auto")],["yes",t("on")],["no",t("off")]],settings.autoRead,v=>{settings.autoRead=v;rerender();}));
  row("🗣️ "+t("voiceLang"),chipRow([["ca","Català"],["es","Castellano"]],settings.voiceLang,v=>{settings.voiceLang=v;rerender();}));
  row("🧮 "+t("help"),chipRow([["auto",t("helpAuto")],["always",t("helpAlways")],["never",t("helpNever")]],settings.help,v=>{settings.help=v;rerender();}));
  const dr=el("div","datarow");
  const bE=el("button","btn blue","⬇️ "+t("dataExport"));bE.onclick=exportData;
  const bI=el("button","btn green","⬆️ "+t("dataImport"));bI.onclick=()=>$("impFile").click();
  dr.appendChild(bE);dr.appendChild(bI);row("💾 "+t("dataTitle"),dr);
  wrap.appendChild(el("div","xplbl",t("dataHint")));
  if(teacher){
    row("🛒 "+t("roundsPer"),chipRow([[0,t("auto")],[5,"5"],[8,"8"],[10,"10"],[12,"12"]],settings.rounds,v=>{settings.rounds=v;rerender();}));
    wrap.appendChild(dashTable());
    const ex=el("button","btn blue full","⬇️ "+t("export"));ex.onclick=exportCSV;wrap.appendChild(ex);
    const del=el("button","btn red full","🗑️ "+t("deleteAll"));let armed=false,tm=null;
    del.onclick=()=>{if(!armed){armed=true;del.textContent="⚠️ "+t("tapAgain");tm=setTimeout(()=>{armed=false;del.textContent="🗑️ "+t("deleteAll");},3500);}
      else{clearTimeout(tm);profiles=[null,null,null,null,null,null];cur=null;save();closeOv();show("scrProfiles");renderProfiles();}};
    wrap.appendChild(del);
  }
  openOv(ovHead((teacher?"👩‍🏫 "+t("teacher"):"⚙️ "+t("settings"))));
  $("ovBox").appendChild(wrap);
}
$("fabSet").onclick=()=>openSettings(false);

/* Exportar / importar dades (JSON) */
function downloadBlob(name,type,text){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;
  document.body.appendChild(a);a.click();a.remove();
}
function exportData(){
  const list=cur!=null?[profiles[cur]]:profiles.filter(Boolean);
  if(!list.length)return;
  const nm=cur!=null?profiles[cur].name.replace(/[^A-Za-z0-9À-ÿ-]+/g,"_"):"tots";
  downloadBlob(`al-mercat-${nm}-${todayStr()}.json`,"application/json",JSON.stringify({app:"al-mercat",v:1,exported:todayStr(),profiles:list},null,1));
  toast(t("dataExported"),"💾");
}
function cleanProfile(o){
  if(!o||typeof o!=="object")return null;
  const name=String(o.name||"").trim().slice(0,14);if(!name)return null;
  const num=v=>Number.isFinite(+v)&&+v>=0?Math.min(Math.floor(+v),1e9):0;
  const pick_=(v,arr,d)=>arr.includes(v)?v:d;
  const p={name,gender:pick_(o.gender,["m","f","n"],"n"),skin:Math.min(5,num(o.skin)),lang:pick_(o.lang,["ca","es","ic"],"ca"),xp:num(o.xp),created:(Number.isFinite(+o.created)&&+o.created>0&&+o.created<4e12)?Math.floor(+o.created):Date.now()};
  p.avatar=typeof o.avatar==="string"?o.avatar.slice(0,16):Math.min(31,num(o.avatar));
  p.trophies=(Array.isArray(o.trophies)?o.trophies:[]).filter(id=>TROPHIES.some(t=>t.id===id));
  p.lv={};LEVELS.forEach(L=>{const s=o.lv&&o.lv[L.id];if(s)p.lv[L.id]={stars:Math.min(3,num(s.stars)),plays:num(s.plays),best:Math.min(100,num(s.best))};});
  const st=o.st||{};p.st={};["sessions","rounds","ok1","ok2","fail","streak","best","changeOk","kgOk","coins","perfect"].forEach(k=>p.st[k]=num(st[k]));
  const d=o.daily||{};p.daily={last:/^\d{4}-\d\d-\d\d$/.test(d.last||"")?d.last:"",streak:num(d.streak),total:num(d.total)};
  return p;
}
$("impFile").addEventListener("change",e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(f.size>2e6){toast(t("dataBad"),"⚠️");return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      const arr=Array.isArray(d.profiles)?d.profiles:[];
      if(d.app!=="al-mercat"||!arr.length)throw new Error("bad");
      let n=0,full=false;
      arr.slice(0,6).forEach(o=>{
        const c=cleanProfile(o);if(!c)return;
        let idx=profiles.findIndex(x=>x&&x.name.toLowerCase()===c.name.toLowerCase());
        if(idx<0)idx=profiles.findIndex(x=>!x);
        if(idx<0){full=true;return;}
        profiles[idx]=c;n++;
      });
      save();
      if(n){
        closeOv();toast(t("dataImported",{n}),"💾");
        if($("scrProfiles").classList.contains("active"))renderProfiles();else if($("scrMenu").classList.contains("active")&&P())showMenu();
      }else toast(t(full?"dataNoSlot":"dataBad"),"⚠️");
    }catch(err){console.error("import",err);toast(t("dataBad"),"⚠️");}
  };
  r.readAsText(f);
});

/* Panell del professor: s'obre amb 5 clics al títol (sense PIN) */
function openTeacher(){openSettings(true);}
function profStats(p){
  const s=p.st,tot=s.ok1+s.ok2+s.fail,acc=tot?Math.round(s.ok1/tot*100):0;
  let maxL=0;for(const k in p.lv)if(p.lv[k].stars>0)maxL=Math.max(maxL,+k);
  return {acc,tot,maxL,rk:rankIdx(p.xp)};
}
function dashTable(){
  const ps=profiles.filter(Boolean);
  if(!ps.length)return el("div","center",t("noProfiles"));
  let h=`<table class="dash"><tr><th>${t("tName")}</th><th>${t("tRank")}</th><th>${t("tXp")}</th><th>${t("tRounds")}</th><th>${t("tAcc")}</th><th>${t("tLevel")}</th></tr>`;
  ps.forEach(p=>{const s=profStats(p);h+=`<tr><td>${avatarOf(p)} ${esc(p.name)}</td><td>${RANKS[s.rk].e}</td><td>${p.xp}</td><td>${p.st.rounds}</td><td>${s.acc}%</td><td>${s.maxL||"-"}</td></tr>`;});
  return el("div","",h+"</table>");
}
function exportCSV(){
  const rows=[["nom","idioma","xp","rang","compres","encerts_primera","encerts_segona","fallades","precisio","millor_ratxa","canvis_ok","quilos_ok","nivell_max","trofeus","repte_ratxa"]];
  profiles.filter(Boolean).forEach(p=>{const s=profStats(p);rows.push([p.name,p.lang,p.xp,RANKS[s.rk].n,p.st.rounds,p.st.ok1,p.st.ok2,p.st.fail,s.acc+"%",p.st.best,p.st.changeOk,p.st.kgOk,s.maxL,p.trophies.length,p.daily.streak]);});
  const csv="﻿"+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(";")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="al-mercat-"+todayStr()+".csv";
  document.body.appendChild(a);a.click();a.remove();
}

/* ───────── Inici ───────── */
document.documentElement.dataset.palette=settings.palette;
applyI18n();
initSplash();
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
