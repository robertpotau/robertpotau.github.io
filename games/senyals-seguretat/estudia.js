/* © 2026 Robert Potau Nuñez — Tots els drets reservats / All rights reserved. robertpotau@gmail.com
   Detectiu de Senyals — secció ESTUDIA: Catàleg (galeria + fitxa de cada senyal) i Flashcards amb caixes de repàs.
   Mateix plantejament que «Eines del taller»: primer s'estudia, després es practica. */
"use strict";

const TIPUS_CURT = {prohibicio: "Prohibició", advertencia: "Advertència", obligacio: "Obligació", salvament: "Salvament o socors", incendis: "Contra incendis"};
const TIPUS_COLOR = {prohibicio: "#ef4444", advertencia: "#f9c80e", obligacio: "#3b82f6", salvament: "#22c55e", incendis: "#f87171"};
const CTX_NOM = {T: "Taller", O: "Obra", F: "Fàbrica", Q: "Laboratori i productes químics", E: "Instal·lacions elèctriques", R: "Radiació", G: "Qualsevol lloc"};
/* Text que es llegeix en veu alta: nom, tipus, definició del tipus i, si n'hi ha, de què ens protegeix i el «Compte!» */
function signalSpeech(s) { const t = TIPUS[s.tipus]; return [s.nom + ".", TIPUS_CURT[s.tipus] + ".", t.frase, s.protegeix ? "Ens protegeix de " + s.protegeix + "." : "", s.nota || ""].filter(Boolean).join(" "); }
function sayBtn(id) {
  return hasVoice() ? `<button class="btn blue small say" onclick="speak(signalSpeech(SENYAL_BY_ID['${id}']))" aria-label="Escolta el senyal">🔊 Escolta</button>`
    : `<button class="btn ghost small say" disabled aria-label="Escolta el senyal (no disponible)">🔊 Escolta</button><small class="say-warn">Aquest dispositiu no té veu en català.</small>`;
}
const normT = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/* Progrés d'estudi del perfil: caixes de repàs (1-5) per senyal i senyals vistos (trofeu «Rata de biblioteca») */
function estudi() { if (!player.estudi) player.estudi = {box: {}, vistos: []}; return player.estudi; }
const boxOf = id => estudi().box[id] || 1;
function noteViewed(id) { const e = estudi(); if (!e.vistos.includes(id)) { e.vistos.push(id); savePlayer(); checkTrophies(); } }
function noteResult(id, ok) { const e = estudi(); e.box[id] = ok ? Math.min(5, boxOf(id) + 1) : 1; savePlayer(); }

/* ═══════════ CATÀLEG ═══════════ */
const CAT = {tipus: "all", q: ""};
function catList() {
  const q = normT(CAT.q.trim());
  return SENYALS.filter(s => (CAT.tipus === "all" || s.tipus === CAT.tipus) && (!q || normT(s.nom).includes(q) || normT(TIPUS[s.tipus].nom).includes(q)));
}
function showCatalog() {
  showScreen("scrEstudia");
  $("estBody").innerHTML = `<div class="est-head"><h2>📚 Catàleg de senyals</h2>
      <div class="est-tools"><input type="text" id="estSearch" placeholder="Cerca un senyal…" aria-label="Cerca" value="${esc(CAT.q)}" autocomplete="off">
      <button class="btn blue small" id="estFlash">📖 Flashcards</button><span class="muted" id="estCount"></span></div></div>
    <div class="est-chips" id="estChips"></div><div id="estBanner"></div><div class="cat-grid" id="estGrid"></div>`;
  $("estChips").innerHTML = `<button class="chip" data-t="all">🌍 Tots</button>` + TIPUS_KEYS.map(k => `<button class="chip" data-t="${k}" style="--tc:${TIPUS_COLOR[k]}"><span class="chip-sig">${tipusHTML(k, "rep")}</span>${TIPUS_CURT[k]}</button>`).join("");
  $("estChips").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; CAT.tipus = b.dataset.t; sfx.click(); catDraw(); };
  $("estSearch").oninput = e => { CAT.q = e.target.value; catDraw(); };
  $("estFlash").onclick = () => { if (!catList().length) return showToast("🔎", "No hi ha senyals en aquesta llista"); setupFlash(CAT.tipus === "all" ? null : [CAT.tipus]); };
  catDraw();
}
function catDraw() {
  const list = catList();
  $("estCount").textContent = list.length + (list.length === 1 ? " senyal" : " senyals");
  document.querySelectorAll("#estChips .chip").forEach(b => b.classList.toggle("on", b.dataset.t === CAT.tipus));
  const k = CAT.tipus === "all" ? null : CAT.tipus;
  $("estBanner").innerHTML = k ? `<div class="est-banner" style="--tc:${TIPUS_COLOR[k]}"><span class="chip-sig big">${tipusHTML(k, "blank")}</span><p><b>${TIPUS[k].nom}.</b> ${TIPUS[k].frase}<br><span class="muted">${descTipus(k)}.</span></p></div>` : "";
  $("estGrid").innerHTML = list.map(s => `<button class="tcard" style="--tc:${TIPUS_COLOR[s.tipus]}" onclick="showSig('${s.id}')"><div class="paper">${signalHTML(s.id, "color")}</div><b>${esc(s.nom)}</b><small>${TIPUS_CURT[s.tipus]}</small></button>`).join("") || `<p class="muted">No s'ha trobat cap senyal.</p>`;
}

/* ── fitxa d'un senyal (finestra) ── */
function showSig(id, view) {
  noteViewed(id);
  const list = catList(), s = SENYAL_BY_ID[id], t = TIPUS[s.tipus], idx = list.indexOf(s);
  const views = [["color", "Color"], ["bn", "Blanc i negre"], ["sil", "Pictograma"]];
  view = view || "color";
  const nav = d => showSig(list[(idx + d + list.length) % list.length].id);
  window._sigNav = nav; window._sigView = v => showSig(id, v);
  const row = (k, v) => v ? `<div class="sheet-row"><b>${k}</b><span>${v}</span></div>` : "";
  const ctx = [...s.ctx].map(c => CTX_NOM[c]).join(" · ");
  const epi = s.epi && s.epi.length ? s.epi.map(e => lc1(SENYAL_BY_ID[e].nom)).join("; ") : "";
  $("sigSheet").innerHTML = `<div class="sheet" style="--tc:${TIPUS_COLOR[s.tipus]}">
    <div class="sheet-vis"><div class="paper big">${signalHTML(id, view)}</div>
      <div class="sheet-views">${views.map(v => `<button class="chip${v[0] === view ? " on" : ""}" onclick="_sigView('${v[0]}')">${v[1]}</button>`).join("")}</div></div>
    <div class="sheet-info"><h3>${esc(s.nom)}</h3>${sayBtn(id)}
      <div class="sheet-tipus"><span class="chip-sig">${tipusHTML(s.tipus, "blank")}</span><b>${t.nom}</b></div>
      <p class="sheet-frase">${t.frase}</p>
      ${row("Com és", descTipus(s.tipus))}${row("Colors", `Color de seguretat: ${t.color} · color de contrast: ${t.contrast}`)}${row("On el trobem", ctx)}
      ${row("Ens protegeix de", s.protegeix)}${row("Per protegir-nos cal", epi)}${row("Compte!", s.nota)}${row("", s.extra ? "<em>Senyal addicional: no surt al full de la unitat.</em>" : "")}</div></div>
    <div class="sheet-actions"><button class="btn ghost" onclick="_sigNav(-1)" aria-label="Anterior">←</button><button class="btn yellow" onclick="closeModal('mdSig')">Tanca</button><button class="btn ghost" onclick="_sigNav(1)" aria-label="Següent">→</button></div>`;
  openModal("mdSig");
}

/* ═══════════ FLASHCARDS ═══════════ */
const FLASH_FACES = [{v: "sig", ic: "🪧", nom: "Senyal → nom i tipus", desc: "Veus el senyal i l'has de reconèixer."},
  {v: "nom", ic: "🔤", nom: "Nom → senyal", desc: "Veus el nom i recordes com és."}, {v: "mix", ic: "🔀", nom: "Barrejat", desc: "Una mica de cada."}];
const FL = {tipus: null, face: "sig", order: "random", live: false};
function setupFlash(pre) {
  showScreen("scrEstudia");
  const sv = player.flashCfg || {};
  FL.tipus = pre || (Array.isArray(sv.tipus) && sv.tipus.length ? sv.tipus.slice() : TIPUS_KEYS.slice());
  FL.face = FLASH_FACES.some(f => f.v === sv.face) ? sv.face : "sig"; FL.order = sv.order === "weak" ? "weak" : "random"; FL.live = false;
  $("estBody").innerHTML = `<div class="est-head"><h2>📖 Flashcards</h2><p class="muted">Estudia els senyals un a un. Els que falles tornen més sovint.</p></div>
    <div class="section-title">Quins tipus de senyal?</div><div class="est-chips" id="flChips"></div>
    <div class="fl-actions"><button class="btn ghost small" onclick="flAll(true)">Tots</button><button class="btn ghost small" onclick="flAll(false)">Cap</button><b id="flCount"></b></div>
    <div class="section-title">Què es veu primer?</div><div class="cfg-grid three" id="flFace"></div><div class="section-title">Ordre</div><div class="cfg-grid two" id="flOrder"></div>
    <button class="btn yellow cfg-play" id="flGo">▶ Comença</button>
    <div class="est-nav"><button class="back-btn" onclick="showCatalog()">← Catàleg</button></div>`;
  $("flChips").innerHTML = TIPUS_KEYS.map(k => `<button class="chip" data-t="${k}" style="--tc:${TIPUS_COLOR[k]}"><span class="chip-sig">${tipusHTML(k, "rep")}</span>${TIPUS_CURT[k]}</button>`).join("");
  $("flChips").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; const k = b.dataset.t; FL.tipus = FL.tipus.includes(k) ? FL.tipus.filter(x => x !== k) : FL.tipus.concat(k); sfx.click(); flDraw(); };
  $("flGo").onclick = flStart; flDraw();
}
function flAll(on) { FL.tipus = on ? TIPUS_KEYS.slice() : []; sfx.click(); flDraw(); }
const flDeckAll = () => SENYALS.filter(s => FL.tipus.includes(s.tipus));
function flDraw() {
  document.querySelectorAll("#flChips .chip").forEach(b => b.classList.toggle("on", FL.tipus.includes(b.dataset.t)));
  const n = flDeckAll().length; $("flCount").textContent = n + " targetes"; $("flGo").disabled = !n;
  const pickGrid = (host, items, key) => {
    host.innerHTML = "";
    items.forEach(it => { const c = richCard("#38bdf8", it.ic, it.nom, it.desc, "", () => { FL[key] = it.v; sfx.click(); flDraw(); }); c.classList.toggle("sel", FL[key] === it.v); if (FL[key] === it.v) c.insertAdjacentHTML("beforeend", '<span class="sel-badge">✔ Triat</span>'); host.appendChild(c); });
  };
  pickGrid($("flFace"), FLASH_FACES, "face");
  pickGrid($("flOrder"), [{v: "random", ic: "🔀", nom: "Barrejat", desc: "En ordre aleatori."}, {v: "weak", ic: "📦", nom: "Els que fallo primer", desc: "Segons les caixes de repàs del perfil."}], "order");
  player.flashCfg = {tipus: FL.tipus.slice(), face: FL.face, order: FL.order}; savePlayer();
}

let FS = null; // sessió de flashcards
function flStart() {
  let deck = shuffle(flDeckAll()); if (FL.order === "weak") deck.sort((a, b) => boxOf(a.id) - boxOf(b.id));
  FS = {deck, total: deck.length, known: 0, again: [], flipped: false}; FL.live = true; flNext();
}
function flNext() {
  const body = $("estBody");
  if (!FS.deck.length) {
    FL.live = false;
    if (FS.again.length) {
      body.innerHTML = `<div class="fl-end"><h2>Ronda acabada</h2><p>Has marcat ${FS.again.length} ${FS.again.length === 1 ? "targeta" : "targetes"} per repassar.</p>
        <div class="fl-again">${FS.again.map(s => `<div class="paper mini">${signalHTML(s.id, "color")}</div>`).join("")}</div>
        <button class="btn yellow" onclick="flRepass()">Repassa-les</button><button class="btn ghost" onclick="showCatalog()">Catàleg</button></div>`;
      return;
    }
    sfx.trophy(); confetti(40); if (FS.total >= 10) Game.bump("flashRondes");
    body.innerHTML = `<div class="fl-end"><h2>🎉 Totes les targetes fetes!</h2><p>${FS.total} ${FS.total === 1 ? "senyal repassat" : "senyals repassats"}.</p>
      <button class="btn yellow" onclick="setupFlash()">Una altra ronda</button><button class="btn ghost" onclick="showCatalog()">Catàleg</button></div>`;
    return;
  }
  const s = FS.deck[0], t = TIPUS[s.tipus]; FS.flipped = false; noteViewed(s.id);
  const face = FL.face === "mix" ? (Math.random() < .5 ? "nom" : "sig") : FL.face;
  const nameBlock = `<div class="fc-word${face === "nom" ? " big" : ""}">${esc(s.nom)}</div>`;
  const info = `<div class="fc-tipus"><span class="chip-sig">${tipusHTML(s.tipus, "blank")}</span><b>${tipusNom(s.tipus)}</b></div><small class="fc-def">${t.frase}</small>`;
  const front = face === "sig" ? `<div class="paper big">${signalHTML(s.id, "color")}</div><small>Toca per veure el nom i el tipus</small>` : `${nameBlock}<small>Toca per veure el senyal</small>`;
  const back = face === "sig" ? `${nameBlock}${info}<div class="fc-how">${descTipus(s.tipus)}</div>` : `<div class="paper big">${signalHTML(s.id, "color")}</div>${nameBlock}${info}`;
  const done = FS.known + FS.again.length;
  body.innerHTML = `<div class="flash"><div class="muted">Targeta ${done + 1} de ${FS.total} · caixa ${boxOf(s.id)}/5</div><div class="fc-prog"><i style="width:${100 * FS.known / FS.total}%"></i></div>
    <div class="fcard" id="fcard" role="button" tabindex="0" aria-label="Gira la targeta" style="--tc:${TIPUS_COLOR[s.tipus]}"><div class="fc-in"><div class="fc-face front">${front}</div><div class="fc-face back">${back}</div></div></div>
    <div class="fc-say">${sayBtn(s.id)}</div>
    <div class="fc-btns"><button class="btn red" onclick="flMark(false)">✗ Un altre cop</button><button class="btn green" onclick="flMark(true)">✓ Ja el sé</button></div>
    <div class="est-nav"><button class="back-btn" onclick="FL.live=false;showCatalog()">← Catàleg</button></div></div>`;
  $("fcard").onclick = flFlip;
}
function flFlip() { FS.flipped = !FS.flipped; $("fcard").classList.toggle("flipped", FS.flipped); sfx.flip(); if (FS.flipped && autoVoice()) speak(signalSpeech(FS.deck[0])); }
function flMark(ok) { const s = FS.deck.shift(); noteResult(s.id, ok); if (ok) FS.known++; else FS.again.push(s); ok ? sfx.ok() : sfx.err(); flNext(); }
function flRepass() { FS.deck = shuffle(FS.again); FS.again = []; FL.live = true; flNext(); }
document.addEventListener("keydown", e => {
  if (!FL.live || !FS || !$("scrEstudia").classList.contains("active") || !FS.deck.length || e.target.tagName === "INPUT") return;
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); flFlip(); } else if (e.key === "ArrowRight") flMark(true); else if (e.key === "ArrowLeft") flMark(false);
});

MODES_READY.catalog = showCatalog; MODES_READY.flash = () => setupFlash();
