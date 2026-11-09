/* © 2026 Robert Potau Nuñez — Tots els drets reservats / All rights reserved. robertpotau@gmail.com
   Detectiu de Senyals — modes amb pantalla pròpia: Construeix el senyal, Memòria i Inspector del taller. */
"use strict";

/* Capçalera comuna de la pantalla scrPlay */
function playHeader(prog) {
  $("pMode").textContent = `${MODE_NAMES[G.mode]} · ${DIFFS[G.diff - 1].icon} ${DIFFS[G.diff - 1].nom}`;
  $("pOk").textContent = G.ok; $("pErr").textContent = G.err; $("pProg").textContent = prog || "";
}
function beginPlay() { G.ok = 0; G.err = 0; G.xp = 0; G.streak = 0; G.t0 = Date.now(); G.exitArmed = false; showScreen("scrPlay"); }
function award(tipus, ok) { const g = Game.answer(G.mode, tipus, ok, DIFFS[G.diff - 1].mult); if (ok) { G.ok++; G.xp += g; } else G.err++; return g; }

/* ════════════ 🛠️ CONSTRUEIX EL SENYAL ════════════ */
const CONS = {n: 8, i: 0, list: [], s: null, sel: null, done: false};
const FORMES = [["circle", "Circular"], ["triangle", "Triangular"], ["rect", "Rectangular o quadrada"]];
function consStart() {
  const P = pool(G.filter, G.diff); CONS.list = sample(P, CONS.n); CONS.i = 0; beginPlay(); consRound();
}
function consRound() {
  const s = CONS.list[CONS.i], t = TIPUS[s.tipus];
  const distract = sample(SENYALS.filter(o => o.id !== s.id && (G.diff === 3 ? o.tipus === s.tipus : true)), 5);
  CONS.s = s; CONS.done = false;
  CONS.sel = {shape: "circle", fill: "blanc", border: null, band: false, ink: "negre", picto: null};
  CONS.pictos = shuffle([s].concat(distract));
  playHeader(`${CONS.i + 1} / ${CONS.n}`);
  const hint = G.diff === 1 ? `<div class="hint">💡 ${t.nom}: ${descTipus(s.tipus)}.</div>` : G.diff === 2 ? `<div class="hint">És un <strong>${lc1(t.nom)}</strong>.</div>` : `<div class="hint">Tu has de deduir de quin tipus és!</div>`;
  $("playBody").innerHTML = `<div class="cons-layout">
    <div class="cons-left"><div class="q-card"><div class="q-text">Construeix el senyal que signifiqui: <strong>«${esc(s.nom)}»</strong>.</div>${hint}<div class="q-vis" id="cPrev" style="margin-top:8px"></div></div></div>
    <div class="cons-right"><div class="cons-panel" id="cPanel"></div></div>
    <div class="cons-actions"><div class="feedback" id="cFb" style="display:none"></div><button class="btn yellow" id="cCheck" onclick="consCheck()">Comprovar ✔</button><button class="btn yellow" id="cNext" style="display:none" onclick="consNext()">Següent →</button></div></div>`;
  consDraw();
}
function consDraw() {
  const c = CONS.sel;
  $("cPrev").innerHTML = `<div class="paper">${renderSignal({shape: c.shape, fill: c.fill, border: c.border, band: c.band, ink: c.ink, picto: c.picto ? SENYAL_BY_ID[c.picto].iso : null})}</div>`;
  const opt = (label, on, js, extra) => `<button class="chip${on ? " on" : ""}" onclick="${js}"${CONS.done ? " disabled" : ""}>${extra || ""}${label}</button>`;
  const sw = col => `<span class="dot" style="background:${COLORS[col]}"></span>`;
  $("cPanel").innerHTML =
    `<div class="cons-row"><b>1. Forma</b><div>${FORMES.map(f => opt(f[1], c.shape === f[0], `consSet('shape','${f[0]}')`, `<span class="chip-shape">${shapeHTML(f[0])}</span>`)).join("")}</div></div>
     <div class="cons-row"><b>2. Color del fons</b><div>${["vermell", "groc", "blau", "verd", "blanc"].map(k => opt(COLOR_NAMES[k], c.fill === k, `consSet('fill','${k}')`, sw(k))).join("")}</div></div>
     <div class="cons-row"><b>3. Vorell</b><div>${[[null, "Sense vorell"], ["vermell", "Vermell"], ["negre", "Negre"]].map(o => opt(o[1], c.border === o[0], `consSet('border',${o[0] ? "'" + o[0] + "'" : "null"})`, o[0] ? sw(o[0]) : "")).join("")}</div></div>
     <div class="cons-row"><b>4. Banda transversal</b><div>${opt("Sí", c.band, "consSet('band',true)")}${opt("No", !c.band, "consSet('band',false)")}</div></div>
     <div class="cons-row"><b>5. Color del pictograma</b><div>${["blanc", "negre"].map(k => opt(COLOR_NAMES[k], c.ink === k, `consSet('ink','${k}')`, sw(k))).join("")}</div></div>
     <div class="cons-row"><b>6. Pictograma</b><div class="picto-grid">${CONS.pictos.map(p => `<button class="pbtn${c.picto === p.id ? " on" : ""}" onclick="consSet('picto','${p.id}')" title="${esc(p.nom)}"${CONS.done ? " disabled" : ""}>${signalHTML(p.id, "sil")}<span>${esc(p.nom)}</span></button>`).join("")}</div></div>`;
}
function consSet(k, v) { if (CONS.done) return; CONS.sel[k] = v; sfx.click(); consDraw(); }
function consCheck() {
  const s = CONS.s, t = TIPUS[s.tipus], c = CONS.sel, bad = [];
  if (c.shape !== t.shape) bad.push("la forma");
  if (c.fill !== t.fons) bad.push("el color del fons");
  if ((c.border || null) !== (t.vorell || null)) bad.push("el vorell");
  if (!!c.band !== !!t.banda) bad.push("la banda transversal");
  if (c.ink !== t.picto) bad.push("el color del pictograma");
  if (c.picto !== s.id) bad.push("el pictograma");
  const ok = bad.length === 0; CONS.done = true;
  award(s.tipus, ok); if (ok) Game.bump("construits");
  const fb = $("cFb"); fb.style.display = "block"; fb.className = "feedback " + (ok ? "ok" : "bad");
  fb.innerHTML = ok ? `✅ <strong>Molt bé!</strong> ${t.nom}: ${descTipus(s.tipus)}.` : `❌ Hi ha errors en: <strong>${bad.join(", ")}</strong>.<br>Un ${lc1(t.nom)} és: ${descTipus(s.tipus)}.<br><div class="paper fixsig">${signalHTML(s.id, "color")}</div>`;
  $("cCheck").style.display = "none"; $("cNext").style.display = "flex"; $("cNext").textContent = CONS.i === CONS.n - 1 ? "Veure resultats 🏁" : "Següent →";
  playHeader(`${CONS.i + 1} / ${CONS.n}`); consDraw();
}
function consNext() {
  if (CONS.i >= CONS.n - 1) { Game.endRound("construeix", G.ok, CONS.n); const perf = G.ok === CONS.n; if (perf) { Game.addXP(5); G.xp += 5; } return showResults({ok: G.ok, err: G.err, total: CONS.n, xp: G.xp, perfect: perf}); }
  CONS.i++; consRound(); window.scrollTo(0, 0);
}
CUSTOM_START.construeix = consStart;

/* ════════════ 🧠 MEMÒRIA ════════════ */
const MEM = {cards: [], open: [], lock: false, pairs: 0, found: 0, moves: 0, cols: 4};
function memStart() {
  const pairs = {1: 6, 2: 8, 3: 10}[G.diff];
  const P = pool(G.filter, G.diff); let sigs = sample(P, pairs);
  if (G.diff === 3) { // parelles senyal ↔ tipus: es reparteixen entre els tipus
    sigs = []; const per = Math.ceil(pairs / 5); TIPUS_KEYS.forEach(k => sigs.push(...sample(P.filter(s => s.tipus === k), per))); sigs = sample(sigs, pairs);
  }
  let cards = [];
  sigs.forEach(s => {
    if (G.diff === 1) cards.push({g: s.id, k: "a", t: s.tipus, h: signalHTML(s.id, "color"), sig: true}, {g: s.id, k: "b", t: s.tipus, h: `<span class="mname">${esc(s.nom)}</span>`});
    else if (G.diff === 2) cards.push({g: s.id, k: "a", t: s.tipus, h: signalHTML(s.id, "sil"), sig: true}, {g: s.id, k: "b", t: s.tipus, h: signalHTML(s.id, "color"), sig: true});
    else cards.push({g: s.tipus, k: "a" + s.id, t: s.tipus, h: signalHTML(s.id, "color"), sig: true, kind: "a"}, {g: s.tipus, k: "b" + s.id, t: s.tipus, h: `<span class="mname">${esc(tipusNom(s.tipus))}</span>`, kind: "b"});
  });
  MEM.cards = shuffle(cards).map((c, i) => Object.assign(c, {i, up: false, gone: false, kind: c.kind || c.k})); MEM.open = []; MEM.lock = false; MEM.pairs = sigs.length; MEM.found = 0; MEM.moves = 0;
  beginPlay(); memBuild();
}
/* Es construeix una sola vegada i després només es canvien les classes: així la carta gira (animació) en lloc de redibuixar-se. */
function memBuild() {
  $("playBody").innerHTML = `<div class="q-card mem-top"><div class="q-text">${G.diff === 1 ? "Troba cada senyal amb el seu nom" : G.diff === 2 ? "Troba la silueta i el senyal en color" : "Uneix cada senyal amb el seu tipus"}</div></div>
    <div class="mem-grid" id="memGrid">${MEM.cards.map(c => `<button class="mcard${c.sig ? " sigc" : ""}" id="mc${c.i}" onclick="memFlip(${c.i})" aria-label="Carta"><span class="mi"><span class="mb">❓</span><span class="mf">${c.h}</span></span></button>`).join("")}</div>`;
  memSync(); memLayout();
}
function memSync() {
  playHeader(`${MEM.found} / ${MEM.pairs} parelles`);
  MEM.cards.forEach(c => { const el = $("mc" + c.i); if (el) { el.classList.toggle("up", c.up || c.gone); el.classList.toggle("gone", c.gone); } });
}
/* Reparteix les cartes per tota la pantalla (sense scroll): tria el nombre de columnes que dóna cartes més quadrades. */
function memLayout() {
  const g = $("memGrid"); if (!g || !$("scrPlay").classList.contains("active")) return;
  g.style.height = "auto"; const top = g.getBoundingClientRect().top + window.scrollY, W = g.clientWidth, H = Math.max(240, window.innerHeight - top - 16), n = MEM.cards.length;
  let best = 3, bs = 1e9;
  for (let c = 2; c <= 10; c++) { if (n % c) continue; const rows = n / c, gap = 8, cw = (W - gap * (c - 1)) / c, ch = (H - gap * (rows - 1)) / rows, sc = Math.abs(Math.log(cw / ch / .9)); if (sc < bs) { bs = sc; best = c; } }
  g.style.height = H + "px"; g.style.gridTemplateColumns = `repeat(${best},minmax(0,1fr))`; g.style.gridTemplateRows = `repeat(${n / best},minmax(0,1fr))`;
}
window.addEventListener("resize", () => { if (G.mode === "memoria") memLayout(); });
function memFlip(i) {
  const c = MEM.cards[i]; if (MEM.lock || c.up || c.gone) return;
  sfx.flip(); c.up = true; MEM.open.push(c); memSync();
  const el = $("mc" + i); el.classList.remove("tap"); void el.offsetWidth; el.classList.add("tap");
  if (MEM.open.length < 2) return;
  const [a, b] = MEM.open; MEM.moves++; MEM.lock = true;
  const match = a.g === b.g && a.kind !== b.kind && (G.diff === 3 ? true : a.k !== b.k);
  setTimeout(() => { // espera que acabi el gir de la 2a carta
    const ea = $("mc" + a.i), eb = $("mc" + b.i);
    if (match) {
      a.gone = b.gone = true; MEM.found++; MEM.open = []; award(a.t, true); memSync();
      [ea, eb].forEach(e => { e.classList.remove("tap"); void e.offsetWidth; e.classList.add("match"); });
      MEM.lock = false; if (MEM.found === MEM.pairs) setTimeout(memEnd, 900);
    } else {
      award(a.t, false); playHeader(`${MEM.found} / ${MEM.pairs} parelles`);
      [ea, eb].forEach(e => { e.classList.remove("tap"); void e.offsetWidth; e.classList.add("nope"); });
      setTimeout(() => { a.up = b.up = false; MEM.open = []; MEM.lock = false; [ea, eb].forEach(e => e.classList.remove("nope")); memSync(); }, 750);
    }
  }, 480);
}
function memEnd() {
  const perfect = G.err === 0; if (perfect) Game.flag("memoriaPerfecta", true);
  Game.endRound("memoria", G.ok, MEM.pairs); if (perfect) { Game.addXP(5); G.xp += 5; }
  showResults({ok: G.ok, err: G.err, total: MEM.pairs, xp: G.xp, perfect, score: `${MEM.pairs} parelles · ${MEM.moves} intents`});
}
CUSTOM_START.memoria = memStart;

/* ════════════ 🔍 INSPECTOR DEL TALLER ════════════ */
const ESCENES = [
  {id: "taller", ctx: "taller", nom: "Taller de tecnologia", bg: "#3b4a63", zones: [
    {e: "🔌", l: "Quadre elèctric", s: "adv-electric"}, {e: "🪚", l: "Serra que fa molt soroll", s: "obl-oida"}, {e: "🗄️", l: "Armari de pintures i dissolvents", s: "adv-inflamables"},
    {e: "👩‍🏭", l: "Banc de soldadura", s: "obl-cara"}, {e: "🚪", l: "Porta de sortida", s: "soc-sortida"}, {e: "🔥", l: "Racó de l'extintor", s: "inc-extintor"}]},
  {id: "obra", ctx: "taller", nom: "Obra de construcció", bg: "#6b5a3a", zones: [
    {e: "🏗️", l: "Grua que mou càrregues", s: "adv-carregues"}, {e: "🪜", l: "Bastida molt alta", s: "obl-caigudes"}, {e: "🚧", l: "Entrada de l'obra", s: "pro-entrada"},
    {e: "🚜", l: "Zona de carretons elevadors", s: "adv-vehicles"}, {e: "🕳️", l: "Excavació amb un gran desnivell", s: "adv-caiguda"}, {e: "🚶", l: "Passadís segur per a vianants", s: "obl-vianants"}]},
  {id: "lab", ctx: "quimic", nom: "Laboratori i magatzem de químics", bg: "#2f5a5a", zones: [
    {e: "🧪", l: "Ampolles d'àcid", s: "adv-corrosives"}, {e: "☠️", l: "Armari de verins", s: "adv-toxiques"}, {e: "🔦", l: "Equip làser", s: "adv-laser"},
    {e: "🚿", l: "Dutxa de seguretat", s: "soc-dutxa"}, {e: "👁️", l: "Fontana de rentada d'ulls", s: "soc-rentada-ulls"}, {e: "☢️", l: "Contenidor de material radioactiu", s: "adv-radioactives"}]},
  {id: "escola", ctx: "tots", nom: "Escola", bg: "#4a4a7a", zones: [
    {e: "🩹", l: "Farmaciola", s: "soc-primers-auxilis"}, {e: "🚭", l: "Pati: ningú no pot fumar", s: "pro-fumar"}, {e: "🧯", l: "Passadís: lloc de l'extintor", s: "inc-extintor"},
    {e: "🚰", l: "Aixeta del taller d'on no es pot beure", s: "pro-no-potable"}, {e: "📞", l: "Telèfon d'emergències", s: "soc-telefon"}, {e: "🚪", l: "Sortida d'emergència", s: "soc-sortida"}]}
];
const INS = {sc: null, z: [], bank: [], sel: null, flag: new Set(), done: false, active: -1, nBad: 3};
function insStart() {
  const L = ESCENES.filter(e => G.filter === "tots" || e.ctx === G.filter || e.ctx === "tots");
  INS.sc = rnd(L); INS.sel = null; INS.flag = new Set(); INS.done = false; INS.active = -1;
  INS.z = INS.sc.zones.map(z => Object.assign({}, z, {placed: null, wrongTried: false}));
  if (G.diff === 3) { // senyals ja col·locats; algunes zones tenen el senyal equivocat
    const bad = sample(INS.z.map((_, i) => i), INS.nBad);
    INS.z.forEach((z, i) => { z.placed = z.s; });
    bad.forEach(i => { const other = INS.z.filter((z, j) => j !== i && !bad.includes(j) && z.s !== INS.z[i].s); const o = rnd(other); INS.z[i].placed = o.s; INS.z[i].isBad = true; });
  }
  if (G.diff === 2) INS.bank = shuffle(INS.z.map(z => z.s).concat(sample(SENYALS.filter(s => !INS.z.some(z => z.s === s.id)), 1).map(s => s.id)));
  beginPlay(); insDraw();
}
/* Explicació del mode, pensada per a alumnes de 1r-2n d'ESO: cada nivell diu què s'ha de fer, pas a pas. */
function insExplain(d) {
  const ex = (e, lloc, sid, ok) => `<div class="ex-zone ${ok ? "ok" : "bad"}"><div class="ex-e">${e}</div><div class="ex-l">${lloc}</div><div class="ex-s">${signalHTML(sid, "color")}</div><div class="ex-v">${ok ? "✅ Ben col·locat" : "❌ Mal col·locat"}</div></div>`;
  if (d === 3) return `<div class="explain"><h3>🎯 Què has de fer?</h3>
    <p>Aquest lloc té <strong>${INS.z.length} zones</strong> i a cada zona hi ha un senyal penjat. <strong>Alguns senyals estan ben col·locats i uns altres no</strong>: s'han posat en una zona que no els correspon. Hi ha <strong>${INS.nBad} senyals mal col·locats</strong>.</p>
    <ol><li>Llegeix el nom de la zona (per exemple, «Quadre elèctric»).</li><li>Mira el senyal que hi ha i pensa: <em>té sentit en aquest lloc?</em></li><li>Si el senyal <strong>no hi pinta res</strong>, toca la zona per marcar-la amb 🚩. Si està bé, deixa-la com està.</li><li>Quan hagis acabat, prem <strong>«Comprovar»</strong>.</li></ol>
    <div class="ex-row">${ex("🔌", "Quadre elèctric", "adv-electric", true)}${ex("🔌", "Quadre elèctric", "inc-extintor", false)}</div>
    <p class="ex-note">A l'exemple, el «Risc elèctric» va bé al quadre elèctric, però l'«Extintor» no: aquesta zona s'hauria de marcar.</p></div>`;
  if (d === 2) return `<div class="explain"><h3>🎯 Què has de fer?</h3><p>Cada zona del lloc necessita un senyal. A la <strong>caixa de senyals</strong> hi ha els senyals que es poden usar (en sobra un!).</p><ol><li>Toca un senyal de la caixa.</li><li>Toca la zona on creus que va.</li><li>Si és correcte es quedarà col·locat; si no, el senyal torna a la caixa.</li></ol></div>`;
  return `<div class="explain"><h3>🎯 Què has de fer?</h3><p>Cada zona del lloc necessita un senyal que avisi del perill o digui què cal fer.</p><ol><li>Toca una zona.</li><li>Tria, entre 4 senyals, el que hi posaries.</li></ol></div>`;
}
function insDraw() {
  const d = G.diff;
  playHeader(d === 3 ? `${INS.flag.size} marcats` : `${INS.z.filter(z => z.placed).length} / ${INS.z.length}`);
  let info = `<div class="q-card ins-title" style="background:${INS.sc.bg}55"><div class="q-text">${INS.sc.nom}</div></div>${insExplain(d)}`;
  const zones = `<div class="ins-grid">${INS.z.map((z, i) => {
    const flagged = d === 3 && INS.flag.has(i);
    const res = INS.done && d === 3 ? (z.isBad ? (flagged ? "good" : "miss") : flagged ? "bad" : "") : "";
    const cls = ["zone", z.placed && d !== 3 ? "filled" : "", INS.active === i ? "active" : "", flagged ? "flag" : "", res].join(" ");
    const sg = z.placed ? `<div class="zsig">${signalHTML(z.placed, "color")}</div>` : `<div class="zsig empty">?</div>`;
    const mark = d === 3 ? (INS.done ? (res === "good" ? '<div class="zbadge ok">✅ Ben detectat</div>' : res === "miss" ? '<div class="zbadge no">❌ No l\'has marcat</div>' : res === "bad" ? '<div class="zbadge no">❌ Estava bé</div>' : '<div class="zbadge ok">✅ Estava bé</div>') : (flagged ? '<div class="zbadge flag">🚩 Marcat com a error</div>' : '<div class="zbadge">Toca si és un error</div>')) : "";
    const fix = INS.done && d === 3 && z.isBad ? `<div class="zfix">Hi anava: <strong>${esc(SENYAL_BY_ID[z.s].nom)}</strong></div>` : "";
    return `<button class="${cls}" onclick="insZone(${i})"${INS.done ? " disabled" : ""}><div class="ze">${z.e}</div><div class="zl">${esc(z.l)}</div>${sg}${mark}${fix}</button>`;
  }).join("")}</div>`;
  let side = "";
  if (d === 1) {
    if (INS.active >= 0 && !INS.z[INS.active].placed) {
      const z = INS.z[INS.active], opts = INS.opts && INS.optsFor === INS.active ? INS.opts : (INS.opts = shuffle([z.s].concat(sample(SENYALS.filter(s => s.id !== z.s), 3).map(s => s.id))), INS.optsFor = INS.active, INS.opts);
      side = `<div class="card side-card"><div class="q-text" style="font-size:1rem;margin-bottom:8px">Què hi poses a: <strong>${esc(z.l)}</strong>?</div><div class="answers two">${opts.map(id => `<button class="ans vis" onclick="insPick('${id}')"><div class="paper">${signalHTML(id, "color")}</div><span class="aname">${esc(SENYAL_BY_ID[id].nom)}</span></button>`).join("")}</div></div>`;
    } else side = `<div class="card side-card side-hint">👆 Toca una zona per triar-hi el senyal.</div>`;
  }
  if (d === 2) side = `<div class="card side-card"><div class="section-title" style="margin:0 0 8px">Caixa de senyals</div><div class="bank">${INS.bank.filter(id => !INS.z.some(z => z.placed === id)).map(id => `<button class="bsig${INS.sel === id ? " on" : ""}" onclick="insBank('${id}')"><div class="paper">${signalHTML(id, "color")}</div><span>${esc(SENYAL_BY_ID[id].nom)}</span></button>`).join("")}</div></div>`;
  if (d === 3 && !INS.done) side = `<button class="btn yellow" onclick="insCheck()">Comprovar ✔ <span class="soon">${INS.flag.size} marcats</span></button>`;
  if (d === 3 && INS.done) side = INS.fbHTML + `<button class="btn yellow" style="margin-top:10px" onclick="insEnd()">Veure resultats 🏁</button>`;
  $("playBody").innerHTML = `<div class="ins-layout"><div class="ins-info">${info}</div><div class="ins-main">${zones}</div><div class="ins-side">${side}</div></div>`;
}
function insZone(i) {
  const z = INS.z[i], d = G.diff; if (INS.done) return; sfx.click();
  if (d === 1) { if (!z.placed) { INS.active = i; insDraw(); } return; }
  if (d === 3) { INS.flag.has(i) ? INS.flag.delete(i) : INS.flag.add(i); return insDraw(); }
  if (!INS.sel || z.placed) return;
  const ok = INS.sel === z.s; const tip = SENYAL_BY_ID[z.s].tipus;
  award(tip, ok);
  if (ok) { z.placed = INS.sel; INS.sel = null; if (INS.z.every(q => q.placed)) return insEnd(); } else { showToast("❌", "Aquí no va aquest senyal", `${SENYAL_BY_ID[INS.sel].nom}`); INS.sel = null; }
  insDraw();
}
function insBank(id) { INS.sel = INS.sel === id ? null : id; sfx.click(); insDraw(); }
function insPick(id) {
  const z = INS.z[INS.active], ok = id === z.s; award(SENYAL_BY_ID[z.s].tipus, ok);
  if (ok) { z.placed = id; showToast("✅", "Ben col·locat!", SENYAL_BY_ID[id].nom); } else { showToast("❌", "Aquest no és el senyal adequat", `Aquí va: ${SENYAL_BY_ID[z.s].nom}`); z.wrongTried = true; }
  INS.active = ok ? -1 : INS.active;
  if (!ok) { z.placed = z.s; z.wrongTried = true; INS.active = -1; } // es mostra la solució i es continua
  if (INS.z.every(q => q.placed)) return insEnd(); insDraw();
}
function insCheck() {
  INS.done = true;
  INS.z.forEach((z, i) => { const f = INS.flag.has(i); const ok = f === !!z.isBad; award(SENYAL_BY_ID[z.s].tipus, ok); });
  const wrong = INS.z.filter(z => z.isBad);
  INS.fbHTML = `<div class="feedback ${G.err === 0 ? "ok" : "bad"}">${G.err === 0 ? "🎉 <strong>Perfecte!</strong> " : "<strong>Resultat:</strong> "}Els senyals mal col·locats eren: ${wrong.map(z => `<strong>${esc(z.l)}</strong> (hi va «${esc(SENYAL_BY_ID[z.s].nom)}»)`).join("; ")}.</div>`;
  insDraw();
}
function insEnd() {
  const perfect = G.err === 0; if (perfect) { Game.flag("inspector100", true); Game.addXP(5); G.xp += 5; }
  Game.endRound("inspector", G.ok, G.ok + G.err); showResults({ok: G.ok, err: G.err, total: Math.max(1, G.ok + G.err), xp: G.xp, perfect});
}
CUSTOM_START.inspector = insStart;

["construeix", "memoria", "inspector"].forEach(m => { MODES_READY[m] = () => openConfig(m); });
MODE_EX.construeix = ["Guiat: et diu <strong>com és</strong> el tipus", "Només et diu <strong>el tipus</strong>", "Només el <strong>nom</strong> del senyal"];
MODE_EX.memoria = ["Senyal ↔ <strong>nom</strong> (6 parelles)", "Silueta ↔ <strong>color</strong> (8 parelles)", "Senyal ↔ <strong>tipus</strong> (10 parelles)"];
MODE_EX.inspector = ["Tria el senyal per a <strong>cada zona</strong>", "Col·loca els senyals de <strong>la caixa</strong>", "Troba els senyals <strong>mal col·locats</strong>"];
