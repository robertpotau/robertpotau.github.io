/* © 2026 Robert Potau Nuñez — Tots els drets reservats / All rights reserved. robertpotau@gmail.com
   Detectiu de Senyals — motor de partides i modes de preguntes (Colors, Forma, Siluetes, Perill→EPI). */
"use strict";
const TIPUS_KEYS = ["prohibicio", "incendis", "advertencia", "obligacio", "salvament"];
const DIFFS = [
  {id: 1, icon: "🌱", color: "#22c55e", nom: "Fàcil", mult: 1, desc: "Senyals habituals · pistes clares"},
  {id: 2, icon: "⚡", color: "#f59e0b", nom: "Mitjà", mult: 1.5, desc: "Més senyals i opcions semblants"},
  {id: 3, icon: "🔥", color: "#ef4444", nom: "Difícil", mult: 2, desc: "Tots els senyals i preguntes trampa"}
];
const FILTERS = [
  {id: "tots", icon: "🌍", color: "#a78bfa", nom: "Tots els senyals", desc: "Barreja de tot el catàleg", ex: "Extintor, risc elèctric, casc…"},
  {id: "taller", icon: "🛠️", color: "#f59e0b", nom: "Taller, obra i fàbrica", desc: "Els que trobaries al taller o en una construcció", ex: "Càrregues en suspensió, protecció del cap"},
  {id: "quimic", icon: "☢️", color: "#22d3ee", nom: "Químics, elèctric i radiació", desc: "Perills de laboratori i indústria", ex: "Matèries corrosives, matèries radioactives"}
];
const MODE_NAMES = {colors: "🎨 Colors i significat", forma: "🔷 Forma i característiques", siluetes: "⚫ Siluetes", construeix: "🛠️ Construeix el senyal", memoria: "🧠 Memòria", inspector: "🔍 Inspector del taller", epi: "🛡️ Perill → EPI"};
const COLOR_NAMES = {vermell: "Vermell", groc: "Groc", blau: "Blau", verd: "Verd", blanc: "Blanc", negre: "Negre"};
const CINFO = { // significats i indicacions del PDF
  vermell: {tipus: ["prohibicio", "incendis"], contrast: "blanc", sig: ["Senyal de prohibició", "Perill - Alarma", "Material i equips de lluita contra incendis", "Stop. Aturada", "Evacuació", "Dispositius de desconnexió d'emergència"]},
  groc: {tipus: ["advertencia"], contrast: "negre", sig: ["Senyal d'advertència", "Atenció, precaució, verificació"]},
  blau: {tipus: ["obligacio"], contrast: "blanc", sig: ["Senyal d'obligació", "Comportament o acció específica"]},
  verd: {tipus: ["salvament"], contrast: "blanc", sig: ["Senyal de salvament o auxili", "Situació de seguretat", "Retorn a la normalitat"]}
};
const COLOR_OF_TIPUS = {prohibicio: "vermell", incendis: "vermell", advertencia: "groc", obligacio: "blau", salvament: "verd"};
const SITUACIONS = [ // situació → tipus de senyal
  ["Un cartell que indica on hi ha l'extintor.", "incendis"], ["Un avís que diu que cal portar casc a l'obra.", "obligacio"],
  ["Un cartell que ens diu que aquí no es pot fumar.", "prohibicio"], ["Un avís que hi ha perill elèctric al quadre.", "advertencia"],
  ["El senyal que mostra la sortida d'emergència.", "salvament"], ["Un cartell que ens obliga a protegir-nos l'oïda amb protectors.", "obligacio"],
  ["Un senyal que avisa que hi ha matèries corrosives.", "advertencia"], ["El cartell on hi ha la farmaciola de primers auxilis.", "salvament"],
  ["Un cartell que prohibeix tocar una màquina en marxa.", "prohibicio"], ["El senyal que localitza la mànega contra incendis.", "incendis"],
  ["Un avís de càrregues en suspensió sobre la nostra cap.", "advertencia"], ["Un cartell que obliga a portar guants.", "obligacio"],
  ["El senyal que indica on hi ha la dutxa de seguretat.", "salvament"], ["Un senyal que ens diu que no podem entrar sense autorització.", "prohibicio"]
];
const AFIRMACIONS = [ // [text, cert?, tipus, explicació]
  ["Els senyals d'obligació tenen el pictograma blanc sobre fons blau.", true, "obligacio", "Són rodons, de fons blau i pictograma blanc."],
  ["El color de contrast del groc és el blanc.", false, "advertencia", "El color de contrast del groc (o groc ataronjat) és el negre."],
  ["Els senyals de salvament o socors porten vorell i banda transversal.", false, "salvament", "No en porten: són rectangulars o quadrats, pictograma blanc sobre fons verd."],
  ["El verd indica situació de seguretat i retorn a la normalitat.", true, "salvament", "A més de senyal de salvament o auxili."],
  ["El vermell s'usa en senyals de prohibició i en els d'equips de lluita contra incendis.", true, "prohibicio", "També vol dir perill-alarma, stop i evacuació."],
  ["Un senyal d'advertència és triangular, amb pictograma negre sobre fons groc.", true, "advertencia", "I amb vorell negre."],
  ["Els senyals de prohibició són rectangulars.", false, "prohibicio", "Són rodons, amb vorell i banda transversal vermells."],
  ["El blau serveix per indicar un comportament o acció específica: una obligació.", true, "obligacio", "Cert: és el color dels senyals d'obligació."],
  ["El color de contrast del vermell, del blau i del verd és el blanc.", true, "salvament", "El del groc és el negre."],
  ["Els senyals d'advertència no porten vorell.", false, "advertencia", "Porten vorell negre."],
  ["Els senyals d'equips de lluita contra incendis tenen pictograma blanc sobre fons vermell i cap vorell.", true, "incendis", "Són rectangulars o quadrats."],
  ["El groc significa senyal de salvament o auxili.", false, "advertencia", "El groc és el color dels senyals d'advertència (atenció, precaució)."],
  ["El senyal «Perill en general» serveix per advertir de qualsevol substància perillosa.", false, "advertencia", "Només s'usa per indicar-ne l'emmagatzematge."]
];

/* ═══ Utilitats ═══ */
const rnd = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const tipusNom = k => TIPUS[k].nom.replace(/^Senyal d(e |')/, "").replace(/^./, c => c.toUpperCase());
const lc1 = s => s.charAt(0).toLowerCase() + s.slice(1);
function descTipus(k) {
  const t = TIPUS[k];
  return `${t.forma} · pictograma ${t.picto} sobre fons ${t.fons} · ${t.vorell ? "vorell " + t.vorell : "sense vorell"} · ${t.banda ? "banda transversal vermella" : "sense banda transversal"}`;
}
const swatch = c => `<span class="sw" style="background:${COLORS[c]}"></span>${COLOR_NAMES[c]}`;
const sigPaper = (id, mode, extra) => `<div class="paper">${signalHTML(id, mode)}</div>`;

/* Pool de senyals segons filtre i dificultat */
function pool(filter, diff, pred) {
  const F = {tots: null, taller: "TOF", quimic: "QER"}[filter];
  const base = SENYALS.filter(s => (!pred || pred(s)) && (!F || [...s.ctx].some(c => F.includes(c) || c === "G")));
  let p = base.filter(s => s.dif <= diff);
  if (p.length < 12) p = base.filter(s => s.dif <= Math.min(3, diff + 1));
  if (p.length < 12) p = base;
  return p;
}
const sameTipus = (s, n = 3, filterPool) => sample((filterPool || SENYALS).filter(o => o.tipus === s.tipus && o.id !== s.id), n);

/* ═══ Estat de la partida ═══ */
const G = {mode: null, diff: 1, filter: "tots", qs: [], i: 0, ok: 0, err: 0, xp: 0, t0: 0, locked: false, streak: 0, exitArmed: false, custom: null};
const cfgMem = {};

function openConfig(mode) {
  G.mode = mode; const m = MODES.find(x => x.id === mode);
  if (cfgMem[mode]) { G.diff = cfgMem[mode].diff; G.filter = cfgMem[mode].filter; } else { G.diff = 1; G.filter = "tots"; }
  $("cfgTitle").textContent = `${m.icon} ${m.nom}`;
  const body = $("cfgBody"); body.innerHTML = `<p style="color:var(--text2);font-size:.9rem;margin-bottom:6px">${m.desc}</p><div class="section-title" style="margin-top:12px">Dificultat</div>`;
  const dg = document.createElement("div"); dg.className = "rich-grid"; dg.style.cssText = "display:flex;flex-direction:column;gap:10px";
  const drow = () => { dg.innerHTML = ""; DIFFS.forEach(d => dg.appendChild(richCard(d.color, d.icon, d.nom, d.desc, MODE_EX[mode][d.id - 1], () => { G.diff = d.id; drow(); frow && frow(); sfx.click(); }, ` <span class="soon">×${d.mult} XP</span>`))); [...dg.children].forEach((c, i) => c.classList.toggle("sel", DIFFS[i].id === G.diff)); };
  body.appendChild(dg);
  let frow = null;
  if (!["colors"].includes(mode)) {
    body.insertAdjacentHTML("beforeend", `<div class="section-title">Quins senyals?</div>`);
    const fg = document.createElement("div"); fg.style.cssText = "display:flex;flex-direction:column;gap:10px";
    frow = () => { fg.innerHTML = ""; FILTERS.forEach(f => fg.appendChild(richCard(f.color, f.icon, f.nom, f.desc, f.ex, () => { G.filter = f.id; frow(); sfx.click(); }))); [...fg.children].forEach((c, i) => c.classList.toggle("sel", FILTERS[i].id === G.filter)); };
    body.appendChild(fg); frow();
  }
  drow();
  const b = document.createElement("button"); b.className = "btn yellow"; b.style.marginTop = "18px"; b.textContent = "Jugar! 🚀"; b.onclick = startGame; body.appendChild(b);
  showScreen("scrConfig");
}
const MODE_EX = {
  colors: ["Blau → <strong>obligació</strong>", "«Atenció, precaució» → <strong>groc</strong>", "Cartell de l'extintor → <strong>incendis · vermell</strong>"],
  forma: ["Senyal complet → <strong>quin tipus és?</strong>", "Descripció → <strong>tipus</strong>", "<strong>Què hi falla?</strong> (fons, vorell, banda…)"],
  epi: ["Perill → <strong>EPI</strong> (una opció)", "Situació → <strong>una protecció</strong>", "Situació → <strong>el conjunt d'EPI</strong>"],
  siluetes: ["Senyal en blanc i negre → <strong>nom</strong>", "Blanc i negre → <strong>versió en color</strong>", "Només el pictograma → <strong>nom o tipus</strong>"]
};

const CUSTOM_START = {}; // modes amb pantalla pròpia (modes2.js)
function startGame() {
  cfgMem[G.mode] = {diff: G.diff, filter: G.filter}; G.exitArmed = false;
  if (CUSTOM_START[G.mode]) return CUSTOM_START[G.mode]();
  G.qs = buildQuestions(G.mode, G.diff, G.filter, 10); G.i = 0; G.ok = 0; G.err = 0; G.xp = 0; G.streak = 0; G.t0 = Date.now(); G.exitArmed = false;
  $("gMode").textContent = `${MODE_NAMES[G.mode]} · ${DIFFS[G.diff - 1].icon} ${DIFFS[G.diff - 1].nom}`;
  showScreen("scrGame"); renderQuestion();
}
const gameAgain = () => startGame();
function gameExit(b) {
  if (!G.exitArmed) { G.exitArmed = true; b.textContent = "Segur que surts?"; setTimeout(() => { G.exitArmed = false; b.textContent = "✕"; }, 3000); return; }
  G.exitArmed = false; b.textContent = "✕"; showScreen("scrMenu");
}

function renderQuestion() {
  const q = G.qs[G.i]; G.locked = false;
  $("gOk").textContent = G.ok; $("gErr").textContent = G.err; $("gProg").textContent = `${G.i + 1} / ${G.qs.length}`; $("gBar").style.width = (G.i / G.qs.length * 100) + "%";
  $("qVis").innerHTML = q.vis || ""; $("qText").innerHTML = q.text;
  const A = $("qAns"); A.innerHTML = ""; A.className = "answers" + (q.cols === 2 ? " two" : "");
  q.ans.forEach((a, i) => {
    const b = document.createElement("button"); b.className = "ans" + (a.vis ? " vis" + (a.paper ? " paper" : "") : ""); b.innerHTML = a.h;
    b.onclick = () => answer(i); A.appendChild(b);
  });
  $("qFb").style.display = "none"; $("qNext").style.display = "none";
}
function answer(i) {
  if (G.locked) return; G.locked = true;
  const q = G.qs[G.i], ok = !!q.ans[i].ok, btns = [...$("qAns").children];
  btns.forEach((b, k) => { b.disabled = true; if (q.ans[k].ok) b.classList.add("correct"); else if (k === i) b.classList.add("wrong"); });
  const mult = DIFFS[G.diff - 1].mult, gained = Game.answer(G.mode, q.tipus, ok, mult);
  if (ok) { G.ok++; G.xp += gained; G.streak++; } else { G.err++; G.streak = 0; }
  if (G.mode === "siluetes" && G.streak > (player.flags.siluetaRatxa || 0)) Game.flag("siluetaRatxa", G.streak);
  if (G.mode === "epi") { if (ok) { if (G.streak > (player.flags.epiRatxa || 0)) Game.flag("epiRatxa", G.streak); } }
  $("gOk").textContent = G.ok; $("gErr").textContent = G.err;
  const fb = $("qFb"); fb.className = "feedback " + (ok ? "ok" : "bad"); fb.innerHTML = (ok ? "✅ <strong>Correcte!</strong> " : "❌ <strong>Ho sento.</strong> ") + (q.exp || ""); fb.style.display = "block";
  const last = G.i === G.qs.length - 1, nx = $("qNext"); nx.textContent = last ? "Veure resultats 🏁" : "Següent →"; nx.style.display = "flex";
  if (ok && !last) { /* encert: l'alumne continua quan vulgui, però no cal esperar */ }
}
function gameNext() { if (G.i >= G.qs.length - 1) return finishGame(); G.i++; renderQuestion(); window.scrollTo(0, 0); }
function finishGame() {
  const total = G.qs.length; Game.endRound(G.mode, G.ok, total);
  if (G.ok === total) { Game.addXP(5); G.xp += 5; if (G.mode === "colors" && G.diff === 3) Game.flag("colors100", true); }
  showResults({ok: G.ok, err: G.err, total, xp: G.xp, perfect: G.ok === total});
}
/* Pantalla de resultats compartida per tots els modes. o: {ok, err, total, xp, perfect, score?} */
function showResults(o) {
  const secs = Math.round((Date.now() - G.t0) / 1000), p = Math.round(o.ok / Math.max(1, o.total) * 100);
  $("rEmoji").textContent = p === 100 ? "🏆" : p >= 80 ? "🎉" : p >= 50 ? "👍" : "💪";
  $("rScore").textContent = o.score || `${o.ok}/${o.total}`;
  $("rMsg").textContent = p === 100 ? "Perfecte! Ets un detectiu de primera!" : p >= 80 ? "Molt bé! Gairebé ho tens tot." : p >= 50 ? "Bon camí, segueix practicant." : "Repassa els senyals i torna-ho a provar!";
  $("rOk").textContent = o.ok; $("rErr").textContent = o.err; $("rTime").textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`; $("rXp").textContent = "+" + o.xp;
  $("rTips").textContent = o.perfect ? "Bonus de ronda perfecta: +5 XP" : "";
  if (p >= 80) { confetti(26); sfx.trophy(); }
  showScreen("scrResults");
}

/* ═══ Generadors de preguntes ═══ */
function buildQuestions(mode, diff, filter, n) {
  const gen = {colors: genColors, forma: genForma, siluetes: genSiluetes, epi: genEpi}[mode], out = [], seen = new Set();
  let guard = 0;
  while (out.length < n && guard++ < 300) { const q = gen(diff, filter, out.length); if (q && !seen.has(q.key)) { seen.add(q.key); out.push(q); } }
  return out;
}
const swAns = (c, ok) => ({h: swatch(c), ok, vis: false});
const txtAns = (t, ok) => ({h: t, ok});

function genColors(diff) {
  const kind = diff === 1 ? rnd(["tipus2color", "color2tipus"]) : diff === 2 ? rnd(["indic2color", "contrast", "significat"]) : rnd(["situacio", "certfals", "situacio", "certfals"]);
  if (kind === "color2tipus") {
    const c = rnd(["vermell", "groc", "blau", "verd"]), tipus = rnd(CINFO[c].tipus);
    let opts = TIPUS_KEYS.filter(k => k !== tipus && !(c === "vermell" && (k === "prohibicio" || k === "incendis")));
    opts = sample(opts, 3);
    return {key: "c2t" + c + tipus, tipus, vis: `<div class="sw-big" style="background:${COLORS[c]}"></div>`, text: "Aquest és un color de seguretat. A quin tipus de senyal correspon?",
      ans: shuffle([txtAns(tipusNom(tipus), true)].concat(opts.map(k => txtAns(tipusNom(k), false)))),
      exp: c === "vermell" ? "El vermell és el color dels senyals de prohibició i dels d'equips de lluita contra incendis (també vol dir perill-alarma, stop, aturada i evacuació)." : `El ${COLOR_NAMES[c].toLowerCase()} és el color de: ${CINFO[c].sig.slice(0, 2).join("; ").toLowerCase()}.`};
  }
  if (kind === "tipus2color") {
    const tipus = rnd(TIPUS_KEYS), c = COLOR_OF_TIPUS[tipus];
    return {key: "t2c" + tipus, tipus, cols: 2, text: `Quin és el color de seguretat del <strong>${lc1(TIPUS[tipus].nom)}</strong>?`,
      ans: shuffle(["vermell", "groc", "blau", "verd"].map(x => swAns(x, x === c))),
      exp: `${TIPUS[tipus].nom}: fons ${TIPUS[tipus].fons}${TIPUS[tipus].vorell ? ", vorell " + TIPUS[tipus].vorell : ""}. Color de seguretat: ${c}.`};
  }
  if (kind === "indic2color") {
    const c = rnd(["vermell", "groc", "blau", "verd"]), ind = rnd(CINFO[c].sig);
    return {key: "i2c" + ind, tipus: CINFO[c].tipus[0], cols: 2, vis: `<div class="quote">«${ind}»</div>`, text: "De quin color de seguretat és aquesta indicació?",
      ans: shuffle(["vermell", "groc", "blau", "verd"].map(x => swAns(x, x === c))), exp: `«${ind}» és una indicació del color ${c}.`};
  }
  if (kind === "contrast") {
    const c = rnd(["vermell", "groc", "blau", "verd"]), ct = CINFO[c].contrast;
    return {key: "ct" + c, tipus: CINFO[c].tipus[0], cols: 2, vis: `<div class="sw-big" style="background:${COLORS[c]}"></div>`, text: `Quin és el <strong>color de contrast</strong> del ${c}?`,
      ans: shuffle(["blanc", "negre"].concat(sample(["vermell", "groc", "blau", "verd"].filter(x => x !== c), 2)).map(x => txtAns(COLOR_NAMES[x], x === ct))),
      exp: "Colors de contrast: vermell → blanc · groc → negre · blau → blanc · verd → blanc."};
  }
  if (kind === "significat") {
    const c = rnd(["vermell", "groc", "blau", "verd"]), ok = rnd(CINFO[c].sig);
    const others = [].concat(...Object.keys(CINFO).filter(x => x !== c).map(x => CINFO[x].sig)).filter(s => !CINFO[c].sig.includes(s));
    return {key: "sg" + c + ok, tipus: CINFO[c].tipus[0], vis: `<div class="sw-big" style="background:${COLORS[c]}"></div>`, text: `Quin d'aquests és un significat o una indicació del color <strong>${c}</strong>?`,
      ans: shuffle([txtAns(ok, true)].concat(sample(others, 3).map(t => txtAns(t, false)))), exp: `El ${c} indica: ${CINFO[c].sig.join("; ").toLowerCase()}.`};
  }
  if (kind === "situacio") {
    const [txt, tipus] = rnd(SITUACIONS);
    const combo = k => `${tipusNom(k)} · ${COLOR_OF_TIPUS[k]}`;
    return {key: "sit" + txt, tipus, text: `<em>${txt}</em><br>Quin tipus de senyal és?`,
      ans: shuffle([txtAns(combo(tipus), true)].concat(sample(TIPUS_KEYS.filter(k => k !== tipus), 3).map(k => txtAns(combo(k), false)))), exp: TIPUS[tipus].frase};
  }
  const [txt, cert, tipus, exp] = rnd(AFIRMACIONS);
  return {key: "cf" + txt, tipus, cols: 2, text: `Cert o fals?<br><em>${txt}</em>`, ans: [txtAns("✅ Cert", cert), txtAns("❌ Fals", !cert)], exp};
}

/* Variants incorrectes d'un senyal (una sola característica errònia) */
const TRAP_NOM = {forma: "La forma", fons: "El color del fons", vorell: "El vorell", banda: "La banda transversal", picto: "El color del pictograma"};
function sigParams(s) { const t = TIPUS[s.tipus]; return {shape: t.shape, fill: t.fons, border: t.vorell, band: t.banda, ink: t.picto, picto: s.iso, title: s.nom}; }
function trapParams(s, kind) {
  const t = TIPUS[s.tipus], p = sigParams(s);
  if (kind === "forma") p.shape = rnd(["circle", "triangle", "rect"].filter(x => x !== t.shape));
  if (kind === "fons") p.fill = rnd(["vermell", "groc", "blau", "verd", "blanc"].filter(x => x !== t.fons && !(t.fons === "blanc" && false)));
  if (kind === "vorell") p.border = t.vorell ? null : rnd(["negre", "vermell"]);
  if (kind === "banda") p.band = !t.banda;
  if (kind === "picto") p.ink = t.picto === "blanc" ? "negre" : "blau";
  return p;
}
const trapsFor = s => ["forma", "fons", "vorell", "banda", "picto"].filter(k => !(k === "banda" && false));
const renderParams = (p, mode) => renderSignal(Object.assign({}, p));

function genForma(diff, filter) {
  const P = pool(filter, diff), s = rnd(P), t = TIPUS[s.tipus];
  const kind = diff === 1 ? rnd(["sig2tipus", "sig2tipus", "tipus2forma"]) : diff === 2 ? rnd(["sig2desc", "desc2tipus", "desc2tipus"]) : rnd(["trap", "trap", "bien"]);
  const tipusOpts = (k, n = 4) => [txtAns(tipusNom(k), true)].concat(sample(TIPUS_KEYS.filter(x => x !== k), n - 1).map(x => txtAns(tipusNom(x), false)));
  if (kind === "sig2tipus") return {key: "s2t" + s.id, tipus: s.tipus, vis: signalHTML(s.id, "color"), text: `<strong>${s.nom}</strong><br>De quin tipus de senyal és?`, ans: shuffle(tipusOpts(s.tipus)), exp: `${t.nom}: ${descTipus(s.tipus)}.`};
  if (kind === "tipus2forma") {
    const formes = ["rodona", "triangular", "rectangular o quadrada"], ok = t.forma;
    return {key: "t2f" + s.tipus, tipus: s.tipus, vis: signalHTML(s.id, "color"), text: `Quina és la <strong>forma</strong> d'aquest ${lc1(tipusNom(s.tipus))}?`, ans: formes.map(f => txtAns(f.replace(/^./, c => c.toUpperCase()), f === ok)),
      exp: `${t.nom}: forma ${t.forma}.`};
  }
  if (kind === "sig2desc") return {key: "s2d" + s.id, tipus: s.tipus, vis: signalHTML(s.id, "color"), text: "Quina descripció correspon a aquest senyal?",
    ans: shuffle([txtAns(descTipus(s.tipus), true)].concat(sample(TIPUS_KEYS.filter(x => x !== s.tipus), 3).map(x => txtAns(descTipus(x), false)))), exp: `Era un ${lc1(t.nom)}. ${t.frase}`};
  if (kind === "desc2tipus") return {key: "d2t" + s.tipus, tipus: s.tipus, text: `<em>${descTipus(s.tipus)}</em><br>De quin tipus de senyal parlem?`, ans: shuffle(tipusOpts(s.tipus)), exp: t.frase};
  const kinds = trapsFor(s);
  if (kind === "trap") {
    const bad = rnd(kinds), opts = [bad].concat(sample(kinds.filter(k => k !== bad), 3));
    return {key: "trap" + s.id + bad, tipus: s.tipus, vis: `<div class="paper">${renderParams(trapParams(s, bad))}</div>`, text: `Aquest senyal (${lc1(tipusNom(s.tipus))}) té un error: <strong>què hi falla?</strong>`,
      cols: 2, ans: shuffle(opts.map(k => txtAns(TRAP_NOM[k], k === bad))), exp: `Un ${lc1(t.nom)} és ${descTipus(s.tipus)}. Aquí fallava: ${lc1(TRAP_NOM[bad])}.`};
  }
  const bads = sample(kinds, 3); // «bien»: triar el senyal ben dibuixat
  return {key: "bien" + s.id, tipus: s.tipus, cols: 2, text: `Quin d'aquests senyals <strong>«${s.nom}»</strong> està ben dibuixat?`,
    ans: shuffle([{h: renderParams(sigParams(s)), ok: true, vis: true, paper: true}].concat(bads.map(k => ({h: renderParams(trapParams(s, k)), ok: false, vis: true, paper: true})))),
    exp: `Un ${lc1(t.nom)}: ${descTipus(s.tipus)}.`};
}

function genSiluetes(diff, filter) {
  const P = pool(filter, diff), s = rnd(P), t = TIPUS[s.tipus];
  const nameQ = mode => ({key: "nm" + mode + s.id, tipus: s.tipus, vis: `<div class="paper">${signalHTML(s.id, mode)}</div>`, text: "Quin senyal és aquest?",
    cols: 2, ans: shuffle([txtAns(s.nom, true)].concat(sameTipus(s, 3, diff === 1 ? P : SENYALS).map(o => txtAns(o.nom, false)))), exp: `Era <strong>${s.nom}</strong> (${lc1(t.nom)}).`});
  if (diff === 1) return nameQ("bn");
  if (diff === 2 && Math.random() < .5) return nameQ("bn");
  if (diff === 2) { // pinta'l: triar la versió en color correcta
    const others = sample(TIPUS_KEYS.filter(k => k !== s.tipus), 3);
    const colorOf = k => { const o = TIPUS[k]; return renderSignal({shape: o.shape, fill: o.fons, border: o.vorell, band: o.banda, ink: o.picto, picto: s.iso}); };
    return {key: "pn" + s.id, tipus: s.tipus, vis: `<div class="paper">${signalHTML(s.id, "bn")}</div>`, text: `Aquest ${lc1(t.nom)} està en blanc i negre. <strong>Quina és la versió en color correcta?</strong>`, cols: 2,
      ans: shuffle([{h: signalHTML(s.id, "color"), ok: true, vis: true, paper: true}].concat(others.map(k => ({h: colorOf(k), ok: false, vis: true, paper: true})))), exp: `${t.nom}: ${descTipus(s.tipus)}.`};
  }
  if (Math.random() < .5) return nameQ("sil");
  return {key: "st" + s.id, tipus: s.tipus, vis: `<div class="paper">${signalHTML(s.id, "sil")}</div>`, text: `Aquest pictograma és de <strong>${s.nom}</strong>. A quin tipus de senyal pertany?`,
    ans: shuffle(TIPUS_KEYS.map(k => txtAns(tipusNom(k), k === s.tipus))), exp: t.frase};
}

/* Perill → EPI */
const EPI_NOM = {"obl-cap": "Cap", "obl-vista": "Vista", "obl-oida": "Oïda", "obl-respiratories": "Vies respiratòries", "obl-peus": "Peus", "obl-mans": "Mans", "obl-cos": "Cos", "obl-cara": "Cara", "obl-caigudes": "Caigudes", "obl-vianants": "Via per a vianants"};
const EPI_IDS = Object.keys(EPI_NOM);
const EPI_SIT = [ // [situació, [senyals d'obligació necessaris]]
  ["Hi ha una grua movent càrregues sobre la teva zona de treball a l'obra.", ["obl-cap", "obl-peus"]],
  ["Has de manipular àcids al laboratori.", ["obl-mans", "obl-vista", "obl-cos"]],
  ["Treballes amb una màquina molt sorollosa al taller.", ["obl-oida"]],
  ["Has de fer una soldadura.", ["obl-cara", "obl-mans"]],
  ["Pintes amb pistola un moble al taller.", ["obl-respiratories", "obl-vista"]],
  ["Treballes pujat a una bastida a molta alçada.", ["obl-caigudes", "obl-cap"]],
  ["Has de creuar una zona on circulen carretons elevadors.", ["obl-vianants"]],
  ["Descarregues caixes molt pesades al magatzem.", ["obl-peus", "obl-mans"]],
  ["Talles fusta amb una serra circular.", ["obl-vista", "obl-oida"]],
  ["Treballes amb productes químics que desprenen vapors.", ["obl-respiratories", "obl-mans"]]
];
const epiOpt = (id, extra) => ({h: `<div class="paper">${signalHTML(id, "color")}</div><span style="font-size:.78rem">${EPI_NOM[id]}</span>`, vis: true, ok: !!extra});
function genEpi(diff, filter) {
  if (diff === 1) {
    const s = rnd(SENYALS.filter(x => x.epi && x.epi.length && (filter === "tots" || pool(filter, 3).includes(x)))); if (!s) return null;
    const right = rnd(s.epi), wrong = sample(EPI_IDS.filter(x => !s.epi.includes(x)), 3);
    return {key: "e1" + s.id + right, tipus: "obligacio", cols: 2, vis: signalHTML(s.id, "color"), text: `<strong>${s.nom}</strong><br>Quina protecció obligatòria et protegeix d'aquest perill?`,
      ans: shuffle([epiOpt(right, true)].concat(wrong.map(w => epiOpt(w)))), exp: `Davant de «${s.nom}», s'usa: ${s.epi.map(e => lc1(SENYAL_BY_ID[e].nom)).join(" i ")}.`};
  }
  const [txt, set] = rnd(EPI_SIT);
  if (diff === 2) {
    const right = rnd(set), wrong = sample(EPI_IDS.filter(x => !set.includes(x)), 3);
    return {key: "e2" + txt + right, tipus: "obligacio", cols: 2, text: `<em>${txt}</em><br>Quina protecció obligatòria és necessària?`, ans: shuffle([epiOpt(right, true)].concat(wrong.map(w => epiOpt(w)))),
      exp: `En aquesta situació cal: ${set.map(e => lc1(SENYAL_BY_ID[e].nom)).join("; ")}.`};
  }
  const comboH = ids => `<div style="display:flex;gap:4px;justify-content:center">${ids.map(i => `<div class="paper" style="padding:3px;flex:1">${signalHTML(i, "color")}</div>`).join("")}</div><span style="font-size:.74rem">${ids.map(i => EPI_NOM[i]).join(" + ")}</span>`;
  const n = set.length, mk = () => sample(EPI_IDS, n).sort();
  const key = a => a.slice().sort().join(), good = key(set), opts = [{h: comboH(set), ok: true, vis: true}], seen = new Set([good]);
  let g = 0; while (opts.length < 4 && g++ < 50) { const c = mk(); if (!seen.has(key(c)) && c.filter(x => set.includes(x)).length < n) { seen.add(key(c)); opts.push({h: comboH(c), ok: false, vis: true}); } }
  return {key: "e3" + txt, tipus: "obligacio", cols: 2, text: `<em>${txt}</em><br>Quin <strong>conjunt</strong> de proteccions necessites?`, ans: shuffle(opts), exp: `Cal: ${set.map(e => lc1(SENYAL_BY_ID[e].nom)).join("; ")}.`};
}


/* Activació dels modes de preguntes */
["colors", "forma", "siluetes", "epi"].forEach(m => { MODES_READY[m] = () => openConfig(m); });
