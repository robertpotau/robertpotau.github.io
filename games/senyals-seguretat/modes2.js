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
const FORMES = [["circle", "Rodona", "⚪"], ["triangle", "Triangular", "🔺"], ["rect", "Rectangular o quadrada", "⬛"]];
const NOM_FORMA = {circle: "la forma", triangle: "la forma", rect: "la forma"};
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
  $("playBody").innerHTML = `<div class="q-card"><div class="q-text">Munta el senyal: <strong>${s.nom}</strong></div>${hint}<div class="q-vis" id="cPrev" style="margin-top:8px"></div></div>
    <div class="cons-panel" id="cPanel"></div><div class="feedback" id="cFb" style="display:none"></div><button class="btn yellow" id="cCheck" onclick="consCheck()">Comprovar ✔</button><button class="btn yellow" id="cNext" style="display:none" onclick="consNext()">Següent →</button>`;
  consDraw();
}
function consDraw() {
  const c = CONS.sel;
  $("cPrev").innerHTML = `<div class="paper">${renderSignal({shape: c.shape, fill: c.fill, border: c.border, band: c.band, ink: c.ink, picto: c.picto ? SENYAL_BY_ID[c.picto].iso : null})}</div>`;
  const opt = (label, on, js, extra) => `<button class="chip${on ? " on" : ""}" onclick="${js}"${CONS.done ? " disabled" : ""}>${extra || ""}${label}</button>`;
  const sw = col => `<span class="dot" style="background:${COLORS[col]}"></span>`;
  $("cPanel").innerHTML =
    `<div class="cons-row"><b>1. Forma</b><div>${FORMES.map(f => opt(f[1], c.shape === f[0], `consSet('shape','${f[0]}')`, f[2] + " ")).join("")}</div></div>
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
  fb.innerHTML = ok ? `✅ <strong>Molt bé!</strong> ${t.nom}: ${descTipus(s.tipus)}.` : `❌ Hi ha errors en: <strong>${bad.join(", ")}</strong>.<br>Un ${lc1(t.nom)} és: ${descTipus(s.tipus)}.<br><div class="paper" style="display:inline-block;margin-top:6px;width:120px">${signalHTML(s.id, "color")}</div>`;
  $("cCheck").style.display = "none"; $("cNext").style.display = "flex"; $("cNext").textContent = CONS.i === CONS.n - 1 ? "Veure resultats 🏁" : "Següent →";
  playHeader(`${CONS.i + 1} / ${CONS.n}`); consDraw();
}
function consNext() {
  if (CONS.i >= CONS.n - 1) { Game.endRound("construeix", G.ok, CONS.n); const perf = G.ok === CONS.n; if (perf) { Game.addXP(5); G.xp += 5; } return showResults({ok: G.ok, err: G.err, total: CONS.n, xp: G.xp, perfect: perf}); }
  CONS.i++; consRound(); window.scrollTo(0, 0);
}
CUSTOM_START.construeix = consStart;

/* ════════════ 🧠 MEMÒRIA ════════════ */
const MEM = {cards: [], open: [], lock: false, pairs: 0, found: 0, moves: 0};
function memStart() {
  const cfg = {1: {pairs: 6, cols: 3}, 2: {pairs: 8, cols: 4}, 3: {pairs: 10, cols: 4}}[G.diff];
  const P = pool(G.filter, G.diff); let sigs = sample(P, cfg.pairs);
  if (G.diff === 3) { // parelles senyal ↔ tipus: es reparteixen entre els tipus
    sigs = []; const per = Math.ceil(cfg.pairs / 5); TIPUS_KEYS.forEach(k => sigs.push(...sample(P.filter(s => s.tipus === k), per))); sigs = sample(sigs, cfg.pairs);
  }
  let cards = [];
  sigs.forEach(s => {
    if (G.diff === 1) cards.push({g: s.id, k: "a", t: s.tipus, h: signalHTML(s.id, "color"), sig: true}, {g: s.id, k: "b", t: s.tipus, h: `<span class="mname">${esc(s.nom)}</span>`});
    else if (G.diff === 2) cards.push({g: s.id, k: "a", t: s.tipus, h: signalHTML(s.id, "sil"), sig: true}, {g: s.id, k: "b", t: s.tipus, h: signalHTML(s.id, "color"), sig: true});
    else cards.push({g: s.tipus, k: "a" + s.id, t: s.tipus, h: signalHTML(s.id, "color"), sig: true, kind: "a"}, {g: s.tipus, k: "b" + s.id, t: s.tipus, h: `<span class="mname">${esc(tipusNom(s.tipus))}</span>`, kind: "b"});
  });
  MEM.cards = shuffle(cards).map((c, i) => Object.assign(c, {i, up: false, gone: false, kind: c.kind || c.k})); MEM.open = []; MEM.lock = false; MEM.pairs = sigs.length; MEM.found = 0; MEM.moves = 0; MEM.cols = cfg.cols;
  beginPlay(); memDraw();
}
function memDraw() {
  playHeader(`${MEM.found} / ${MEM.pairs} parelles`);
  $("playBody").innerHTML = `<div class="q-card"><div class="q-text">${G.diff === 1 ? "Troba cada senyal amb el seu nom" : G.diff === 2 ? "Troba la silueta i el senyal en color" : "Uneix cada senyal amb el seu tipus"}</div></div>
    <div class="mem-grid" style="grid-template-columns:repeat(${MEM.cols},1fr)">${MEM.cards.map(c => `<button class="mcard${c.up || c.gone ? " up" : ""}${c.gone ? " gone" : ""}${c.sig ? " sigc" : ""}" onclick="memFlip(${c.i})" aria-label="Carta"><span class="mf">${c.h}</span><span class="mb">❓</span></button>`).join("")}</div>`;
}
function memFlip(i) {
  const c = MEM.cards[i]; if (MEM.lock || c.up || c.gone) return; sfx.click(); c.up = true; MEM.open.push(c); memDraw();
  if (MEM.open.length < 2) return;
  const [a, b] = MEM.open; MEM.moves++;
  const match = a.g === b.g && a.kind !== b.kind && (G.diff === 3 ? true : a.k !== b.k);
  if (match) { a.gone = b.gone = true; MEM.found++; MEM.open = []; award(a.t, true); setTimeout(memDraw, 250); if (MEM.found === MEM.pairs) setTimeout(memEnd, 700); }
  else { MEM.lock = true; award(a.t, false); setTimeout(() => { a.up = b.up = false; MEM.open = []; MEM.lock = false; memDraw(); }, 900); }
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
const INS = {sc: null, z: [], bank: [], sel: null, flag: new Set(), done: false, active: -1};
function insStart() {
  const L = ESCENES.filter(e => G.filter === "tots" || e.ctx === G.filter || e.ctx === "tots");
  INS.sc = rnd(L); INS.sel = null; INS.flag = new Set(); INS.done = false; INS.active = -1;
  INS.z = INS.sc.zones.map(z => Object.assign({}, z, {placed: null, wrongTried: false}));
  if (G.diff === 3) { // senyals ja col·locats; algunes zones tenen el senyal equivocat
    const bad = sample(INS.z.map((_, i) => i), 3);
    INS.z.forEach((z, i) => { z.placed = z.s; });
    bad.forEach(i => { const other = INS.z.filter((z, j) => j !== i && !bad.includes(j) && z.s !== INS.z[i].s); const o = rnd(other); INS.z[i].placed = o.s; INS.z[i].isBad = true; });
  }
  if (G.diff === 2) INS.bank = shuffle(INS.z.map(z => z.s).concat(sample(SENYALS.filter(s => !INS.z.some(z => z.s === s.id)), 1).map(s => s.id)));
  beginPlay(); insDraw();
}
function insDraw() {
  const d = G.diff, left = INS.z.filter(z => !z.placed || (d === 3 && false)).length;
  playHeader(d === 3 ? `${INS.flag.size} marcats` : `${INS.z.filter(z => z.placed).length} / ${INS.z.length}`);
  const intro = d === 1 ? "Toca una zona i tria el senyal que hi posaries." : d === 2 ? "Toca un senyal de la caixa i després la zona on l'has de col·locar." : "Hi ha senyals mal col·locats! Marca'ls i prem «Comprovar».";
  let h = `<div class="q-card" style="background:${INS.sc.bg}55"><div class="q-text">${INS.sc.nom}</div><div style="font-size:.85rem;color:var(--text2);margin-top:4px">${intro}</div></div>
   <div class="ins-grid">${INS.z.map((z, i) => {
    const cls = ["zone", z.placed && d !== 3 ? "filled" : "", INS.active === i ? "active" : "", d === 3 && INS.flag.has(i) ? "flag" : "", INS.done && d === 3 ? (z.isBad ? (INS.flag.has(i) ? "good" : "miss") : INS.flag.has(i) ? "bad" : "") : ""].join(" ");
    const sg = z.placed ? `<div class="zsig">${signalHTML(z.placed, "color")}</div>` : `<div class="zsig empty">?</div>`;
    return `<button class="${cls}" onclick="insZone(${i})"${INS.done ? " disabled" : ""}><div class="ze">${z.e}</div><div class="zl">${esc(z.l)}</div>${sg}</button>`;
  }).join("")}</div>`;
  if (d === 1 && INS.active >= 0 && !INS.z[INS.active].placed) {
    const z = INS.z[INS.active], opts = shuffle([z.s].concat(sample(SENYALS.filter(s => s.id !== z.s), 3).map(s => s.id)));
    h += `<div class="card" style="margin-top:12px"><div class="q-text" style="font-size:1rem;margin-bottom:8px">Què hi poses a: <strong>${esc(z.l)}</strong>?</div><div class="answers two">${opts.map(id => `<button class="ans vis" onclick="insPick('${id}')"><div class="paper">${signalHTML(id, "color")}</div><span style="font-size:.74rem">${esc(SENYAL_BY_ID[id].nom)}</span></button>`).join("")}</div></div>`;
  }
  if (d === 2) h += `<div class="card" style="margin-top:12px"><div class="section-title" style="margin:0 0 8px">Caixa de senyals</div><div class="bank">${INS.bank.filter(id => !INS.z.some(z => z.placed === id)).map(id => `<button class="bsig${INS.sel === id ? " on" : ""}" onclick="insBank('${id}')"><div class="paper">${signalHTML(id, "color")}</div><span>${esc(SENYAL_BY_ID[id].nom)}</span></button>`).join("")}</div></div>`;
  if (d === 3 && !INS.done) h += `<button class="btn yellow" style="margin-top:12px" onclick="insCheck()">Comprovar ✔</button>`;
  $("playBody").innerHTML = h;
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
  insDraw(); const wrong = INS.z.filter(z => z.isBad);
  const b = document.createElement("div"); b.className = "feedback " + (G.err === 0 ? "ok" : "bad");
  b.innerHTML = `Els senyals mal col·locats eren: ${wrong.map(z => `<strong>${esc(z.l)}</strong> (hi va «${esc(SENYAL_BY_ID[z.s].nom)}»)`).join("; ")}.`;
  $("playBody").appendChild(b); const n = document.createElement("button"); n.className = "btn yellow"; n.style.marginTop = "10px"; n.textContent = "Veure resultats 🏁"; n.onclick = insEnd; $("playBody").appendChild(n);
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
