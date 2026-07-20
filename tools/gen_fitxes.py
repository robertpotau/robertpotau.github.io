# -*- coding: utf-8 -*-
"""Generate the static per-game "fitxa" pages (jocs/<slug>.html) + hub (jocs/index.html).

SEO purpose: playable game HTML has almost no indexable text, so these pages
are what can rank for queries like "joc de fraccions online gratis".
Re-run after changing GAMES data below; output is committed to the repo.
Kept OUTSIDE games/ so sync-game.ps1's robocopy /MIR never touches it.
"""
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "jocs")
BASE = "https://robertpotau.github.io"

GAMES = [
    dict(
        slug="calcuherois", entry="CalcuHerois.html", shot="calcuherois",
        name="CalcuHerois", emoji="🧮",
        seo_title="CalcuHerois — Joc de càlcul mental gratuït per a Primària",
        meta="Joc gratuït de càlcul mental per a Primària: 17 missions, herois i rangs per practicar sumes, restes, multiplicacions i divisions. Sense registre ni anuncis.",
        subject="Càlcul mental", grade="Primària 3r-6è",
        lead="Un joc on cada operació ben resolta et fa una mica més heroi.",
        paragraphs=[
            "CalcuHerois converteix la pràctica del càlcul mental en una aventura: l'alumne supera missions progressives de sumes, restes, multiplicacions, divisions i altres reptes numèrics, i a mesura que encerta va pujant de rang i desbloquejant herois.",
            "La dificultat creix missió a missió — 17 en total — de manera que cada alumne pot avançar al seu ritme: els primers nivells reforcen el càlcul bàsic i els últims ja demanen agilitat mental de debò. L'autocorrecció és immediata, sense esperes ni castics: si t'equivoques, tornes a provar.",
            "Per al docent hi ha un espai del professor protegit amb PIN des d'on es pot seguir el progrés del grup. El joc funciona directament al navegador — ordinador, tauleta, mòbil o pissarra digital — i el progrés es desa al dispositiu de l'alumne.",
        ],
        features=[
            "17 missions progressives de càlcul mental",
            "Sumes, restes, multiplicacions, divisions i més",
            "Sistema de rangs i herois per mantenir la motivació",
            "Espai del professor amb seguiment del grup",
            "Funciona a navegador, tauleta i pissarra digital",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["fraccions", "geometria", "vistes"],
        teaches="càlcul mental, matemàtiques", level="Primària 3r-6è", lang="ca",
    ),
    dict(
        slug="fraccions", entry="fraccions.html", shot="fraccions",
        name="Fraccions", emoji="🍕",
        seo_title="Joc de Fraccions online gratuït per a Primària i ESO",
        meta="Joc online gratuït per aprendre fraccions: representació gràfica, equivalències, comparació i operacions, amb mode barreja per repassar-ho tot. Primària i 1r ESO.",
        subject="Fraccions", grade="Primària 4t-6è · 1r ESO",
        lead="Del tros de pizza a les operacions: les fraccions, jugant.",
        paragraphs=[
            "Les fraccions són un dels esculls clàssics de les matemàtiques a Primària i primer d'ESO. Aquest joc les treballa des de diverses portes d'entrada: la representació gràfica, les fraccions equivalents, la comparació i les operacions, cadascuna amb el seu propi mode de joc.",
            "El mode barreja combina preguntes de tots els temes, ideal per repassar abans d'un control o com a repte final. Cada resposta té correcció immediata, i el sistema d'avatars i progressió fa que l'alumnat tingui ganes de tornar-hi.",
            "Com tots els jocs d'aquesta col·lecció, funciona directament al navegador sense instal·lar res ni registrar-se, i el progrés de cada alumne queda desat al seu dispositiu.",
        ],
        features=[
            "Diversos modes per entendre el concepte de fracció",
            "Representació gràfica, equivalències i comparació",
            "Pràctica d'operacions amb fraccions",
            "Mode barreja per repassar-ho tot",
            "Avatars i progressió per a cada alumne",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["calcuherois", "geometria", "ortografia"],
        teaches="fraccions, matemàtiques", level="Primària 4t-6è i 1r ESO", lang="ca",
    ),
    dict(
        slug="geometria", entry="index.html", shot="geometria",
        name="Geometria", emoji="🔺",
        seo_title="Joc de Geometria online gratuït (Primària i ESO)",
        meta="Joc online gratuït de geometria: figures planes i les seves propietats amb autocorrecció immediata. Per a Primària (5è-6è) i primer cicle d'ESO.",
        subject="Geometria", grade="Primària 5è - ESO 2n",
        lead="Figures, costats, angles i propietats — apresos jugant, no memoritzant.",
        paragraphs=[
            "Aquest joc repassa la geometria plana de manera interactiva: reconèixer figures, comptar costats i vèrtexs, i relacionar cada forma amb les seves propietats. Pensat per al final de Primària i el primer cicle d'ESO, on aquests continguts s'han de consolidar.",
            "Tot és autocorrectiu: l'alumne rep la resposta a l'instant i pot repetir tantes vegades com calgui. El sistema d'avatars personalitzables fa que cadascú tingui el seu personatge i el seu progrés.",
            "Funciona al navegador de qualsevol dispositiu — també a la pissarra digital de l'aula — sense instal·lació ni registre.",
        ],
        features=[
            "Figures geomètriques planes i les seves propietats",
            "Autocorrecció immediata",
            "Avatars personalitzables",
            "Dificultat adequada de 5è de Primària a 2n d'ESO",
            "Funciona a navegador, tauleta i pissarra digital",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["vistes", "fraccions", "calcuherois"],
        teaches="geometria, figures planes", level="Primària 5è - 2n ESO", lang="ca",
    ),
    dict(
        slug="quina-hora-es", entry="index.html", shot="quina-hora-es",
        name="Quina hora és?", emoji="🕐",
        seo_title="Quina hora és? — Joc per aprendre les hores en català",
        meta="Joc gratuït per aprendre a llegir l'hora en català amb el sistema de quarts: rellotge analògic interactiu, 2 modes i 5 estils de rellotge. Primària 1r-3r.",
        subject="Mesura del temps", grade="Primària 1r-3r",
        lead="Un quart de dues, dos quarts de tres… el sistema català de quarts, dominat jugant.",
        paragraphs=[
            "Llegir l'hora en català té la seva pròpia gramàtica: el sistema de quarts (\"un quart de dues\", \"dos quarts i mig de cinc\") no s'assembla a com es diu en castellà ni en anglès, i costa de consolidar. Aquest joc el treballa específicament, amb un rellotge analògic interactiu.",
            "Hi ha dos modes de joc — per aprendre'n i per posar-se a prova — i cinc estils de rellotge diferents perquè l'alumnat s'acostumi a llegir l'hora en qualsevol esfera. La pantalla del professor permet fer dictats d'hores a tota la classe.",
            "Ideal per a cicle inicial i mitjà de Primària, i també per a l'aula d'acollida, on el sistema de quarts és una de les particularitats del català que més sorprèn.",
        ],
        features=[
            "El sistema tradicional català de quarts",
            "Rellotge analògic interactiu i manipulable",
            "2 modes: aprendre i practicar",
            "5 estils de rellotge diferents",
            "Pantalla del professor per a dictats d'hores",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["what-time-is-it", "lletra-a-lletra", "aula-acollida"],
        teaches="lectura de l'hora, sistema de quarts català", level="Primària 1r-3r", lang="ca",
    ),
    dict(
        slug="lletra-a-lletra", entry="index.html", shot="lletra-a-lletra",
        name="Lletra a Lletra", emoji="📖",
        seo_title="Lletra a Lletra — Joc de lectoescriptura en català gratuït",
        meta="Joc gratuït de lectoescriptura en català: escoltar, completar, separar síl·labes, associar i llegir paraules, amb veu sintetitzada. Per a infants, adults i aula d'acollida.",
        subject="Lectoescriptura", grade="Infantil P5 - Primària 2n · Adults",
        lead="Aprendre a llegir i escriure en català, paraula a paraula i amb veu pròpia.",
        paragraphs=[
            "Lletra a Lletra és un joc de lectoescriptura en català amb sis maneres de treballar cada paraula: escoltar-la, completar-ne les lletres que falten, separar-la en síl·labes, associar-la amb la seva imatge i llegir-la. Cada activitat sona: el joc llegeix en veu alta amb síntesi de veu en català.",
            "Està pensat per a dos públics que sovint queden desatesos alhora: els infants que comencen (P5 fins a 2n de Primària) i les persones adultes que aprenen a llegir i escriure en català, per exemple a l'aula d'acollida o a l'escola d'adults. Els sis perfils permeten que diverses persones comparteixin el mateix dispositiu sense barrejar progressos.",
            "Com sempre, funciona directament al navegador, sense registre, i és completament gratuït.",
        ],
        features=[
            "6 modes: escoltar, completar, síl·labes, associar, llegir…",
            "Veu sintetitzada en català a totes les activitats",
            "6 perfils per compartir dispositiu",
            "Pensat per a infants i per a persones adultes",
            "Ideal per a aula d'acollida i escola d'adults",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["aula-acollida", "ortografia", "quina-hora-es"],
        teaches="lectoescriptura en català", level="Infantil P5 - Primària 2n, i persones adultes", lang="ca",
    ),
    dict(
        slug="ortografia", entry="index.html", shot="ortografia",
        name="Ortografia", emoji="✍️",
        seo_title="Joc d'Ortografia Catalana online gratuït",
        meta="Joc online gratuït d'ortografia catalana: accentuació, apòstrof, essa sorda i sonora, ce trencada, comes i més — 10 blocs temàtics autocorrectius.",
        subject="Ortografia", grade="Primària 3r-6è",
        lead="L'ortografia catalana, bloc a bloc i sense por del bolígraf vermell.",
        paragraphs=[
            "Deu blocs temàtics cobreixen els punts on l'ortografia catalana fa més mal: l'accentuació, l'apòstrof, la essa sorda i la sonora, la ce trencada, les comes i més. Cada bloc es pot treballar per separat, de manera que el joc s'adapta al tema que s'estigui fent a classe.",
            "Totes les activitats són autocorrectives i es poden repetir tantes vegades com calgui: l'error no penalitza, ensenya. La progressió queda desada al dispositiu de cada alumne.",
            "És una eina de repàs perfecta per als últims cursos de Primària, i també funciona molt bé com a reforç a l'ESO i a l'aula d'acollida.",
        ],
        features=[
            "10 blocs temàtics d'ortografia catalana",
            "Accentuació, apòstrof, s/ss/ç, comes i més",
            "Activitats autocorrectives i repetibles",
            "Progressió desada per alumne",
            "Útil de Primària fins a reforç d'ESO",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["lletra-a-lletra", "aula-acollida", "fraccions"],
        teaches="ortografia catalana", level="Primària 3r-6è", lang="ca",
    ),
    dict(
        slug="aula-acollida", entry="index.html", shot="aula-acollida",
        name="Jocs Aula d'Acollida", emoji="🌍",
        seo_title="Jocs Aula d'Acollida — Català per a alumnat nouvingut",
        meta="Jocs gratuïts de vocabulari català per a alumnat nouvingut: 12 unitats temàtiques, 16 modes de joc, més de 400 paraules amb imatge i àudio, i repàs intel·ligent.",
        subject="Acollida · Llengua", grade="Tots els nivells",
        lead="Les primeres 400 paraules en català, apreses jugant des del primer dia.",
        paragraphs=[
            "Quan un alumne acaba d'arribar i ho ha d'aprendre tot, el vocabulari bàsic és la primera porta. Aquest conjunt de jocs el treballa amb 12 unitats temàtiques — el cos, la casa, el menjar, l'escola… — i més de 400 paraules, cadascuna amb la seva imatge i el seu àudio.",
            "Els 16 modes de joc ataquen cada paraula des d'angles diferents: reconèixer-la, escriure-la, escoltar-la, relacionar-la. El repàs intel·ligent recupera automàticament les paraules que més costen a cada alumne, i el mode de lectura fàcil acompanya qui encara llegeix amb dificultat.",
            "El sistema d'experiència i progressió fa visible l'avenç — cosa que, per a un alumne nouvingut, val or. Tot funciona al navegador, gratuïtament i sense registre.",
        ],
        features=[
            "12 unitats temàtiques de vocabulari essencial",
            "Més de 400 paraules amb imatge i àudio",
            "16 modes de joc diferents",
            "Repàs intel·ligent de les paraules que costen més",
            "Mode de lectura fàcil",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["lletra-a-lletra", "ortografia", "quina-hora-es"],
        teaches="vocabulari català, català per a nouvinguts", level="Tots els nivells — aula d'acollida", lang="ca",
    ),
    dict(
        slug="vistes", entry="index.html", shot="vistes",
        name="Vistes: Planta, Alçat i Perfil", emoji="📐",
        seo_title="Vistes: planta, alçat i perfil — Joc de dibuix tècnic",
        meta="Joc gratuït de dibuix tècnic per practicar el sistema dièdric: peces 3D interactives per deduir planta, alçat i perfil. Per a ESO i Batxillerat.",
        subject="Dibuix tècnic", grade="ESO 3r-4t · Batxillerat",
        lead="Mirar una peça en 3D i veure-hi les tres vistes: l'ull tècnic s'entrena jugant.",
        paragraphs=[
            "El sistema dièdric — deduir la planta, l'alçat i el perfil d'una peça — és un dels continguts de Tecnologia i dibuix tècnic que més costa de visualitzar. Aquest joc el converteix en una pràctica directa: peces 3D que es poden girar amb el dit o el ratolí, i quatre modes de joc per posar l'ull a prova.",
            "El motor 3D és propi i lleuger, així que funciona fluid a qualsevol navegador sense instal·lar res. El sistema de perfils amb experiència i trofeus permet que cada alumne segueixi el seu propi progrés.",
            "Pensat per a segon cicle d'ESO i Batxillerat, i útil també com a preparació per a les PAU de dibuix tècnic.",
        ],
        features=[
            "Peces 3D interactives que es poden girar",
            "4 modes de joc sobre el sistema dièdric",
            "Planta, alçat i perfil amb autocorrecció",
            "Perfils amb experiència i trofeus",
            "Motor 3D propi, lleuger, sense instal·lació",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["geometria", "calcuherois", "fraccions"],
        teaches="sistema dièdric, vistes, dibuix tècnic", level="ESO 3r-4t i Batxillerat", lang="ca",
    ),
    dict(
        slug="what-time-is-it", entry="index.html", shot="what-time-is-it",
        name="What's the Time?", emoji="🕒",
        seo_title="What's the Time? — Joc per aprendre les hores en anglès",
        meta="Free classroom game / joc gratuït per aprendre les hores en anglès: rellotge analògic interactiu, o'clock, half past i quarter, amb pantalla per al professor.",
        subject="English", grade="Primària 2n-4t",
        lead="O'clock, half past, quarter to… telling the time, jugant a classe d'anglès.",
        paragraphs=[
            "Dir l'hora en anglès — \"it's half past three\", \"it's quarter to nine\" — és un contingut clàssic de la classe d'anglès de Primària, i aquest joc el treballa amb un rellotge analògic interactiu que l'alumne pot manipular.",
            "Té dos modes de joc, per aprendre i per posar-se a prova, i cinc estils de rellotge perquè l'alumnat llegeixi l'hora en qualsevol esfera. La pantalla del professor permet dictar hores a tota la classe des de la pissarra digital.",
            "És la parella anglesa del joc «Quina hora és?»: els dos junts permeten comparar com es diu l'hora en català i en anglès — dos sistemes ben diferents.",
        ],
        features=[
            "Rellotge analògic interactiu",
            "O'clock, half past, quarter past, quarter to",
            "2 modes: learn i practice",
            "5 estils de rellotge",
            "Pantalla del professor per a dictats d'hores",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["verbs-english", "quina-hora-es", "calcuherois"],
        teaches="telling the time in English", level="Primària 2n-4t", lang="ca",
    ),
    dict(
        slug="verbs-english", entry="index.html", shot="verbquest",
        name="VerbQuest", emoji="🗡️",
        seo_title="VerbQuest — Joc dels verbs irregulars en anglès",
        meta="Joc gratuït per dominar els verbs regulars i irregulars en anglès: 8 modes de joc, pronunciació britànica amb àudio i transcripció IPA. Per a ESO.",
        subject="English", grade="ESO",
        lead="Go, went, gone: els verbs irregulars en anglès, derrotats un a un.",
        paragraphs=[
            "La llista de verbs irregulars és el drac que tot estudiant d'anglès ha de vèncer tard o d'hora. VerbQuest la converteix en una missió: vuit modes de joc diferents per treballar els verbs regulars i irregulars des de totes les direccions — reconèixer-los, escriure'ls, escoltar-los i encadenar-los.",
            "Cada verb es pot escoltar amb pronunciació britànica sintetitzada i inclou la seva transcripció fonètica IPA, de manera que l'alumne no només l'escriu bé: també el diu bé. La interfície es pot posar en català o en anglès.",
            "Els sis perfils permeten compartir dispositiu a l'aula, i el progrés de cadascú queda desat al navegador. Gratuït i sense registre, com tota la col·lecció.",
        ],
        features=[
            "Verbs regulars i irregulars en anglès",
            "8 modes de joc diferents",
            "Àudio amb pronunciació britànica",
            "Transcripció fonètica IPA de cada verb",
            "Interfície en català o en anglès · 6 perfils",
            "Gratuït, sense registre i sense anuncis",
        ],
        related=["what-time-is-it", "ortografia", "aula-acollida"],
        teaches="English regular and irregular verbs", level="ESO", lang="ca",
    ),
]

BY_SLUG = {g["slug"]: g for g in GAMES}

CSS = """
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@font-face{font-family:'Nunito';font-style:normal;font-weight:400 900;font-display:swap;src:url('../fonts/nunito-400.woff2') format('woff2')}
:root{--ink:#f5edff;--ink-dim:rgba(245,237,255,0.66);--accent:#c792ff;--accent-hot:#9a32ef;--kofi:#29d2ff;--glass:rgba(255,255,255,0.06);--glass-border:rgba(255,255,255,0.14);--radius:22px}
html{scroll-behavior:smooth;background:linear-gradient(180deg,#14082a 0%,#2a0a54 55%,#180a33 100%)}
html,body{color:var(--ink);font-family:'Nunito','Segoe UI',system-ui,sans-serif;line-height:1.6}
body{min-height:100vh}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:820px;margin:0 auto;padding:24px 20px 60px}
.topbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:34px}
.topbar a{font-weight:900;font-size:14px;letter-spacing:0.05em;background:var(--glass);border:1px solid var(--glass-border);padding:8px 16px;border-radius:99px;color:var(--ink)}
.topbar a:hover{text-decoration:none;border-color:var(--accent)}
.crumb{font-size:13px;color:var(--ink-dim);margin-bottom:14px}
.crumb a{color:var(--ink-dim)}
h1{font-size:clamp(1.7rem,5vw,2.5rem);font-weight:900;line-height:1.15;margin-bottom:10px}
.lead{font-size:1.12rem;color:var(--ink-dim);margin-bottom:18px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.chip{font-size:12.5px;font-weight:800;padding:5px 13px;border-radius:99px;background:var(--glass);border:1px solid var(--glass-border)}
.chip.grade{color:var(--kofi)}
.shot{width:100%;border-radius:var(--radius);border:1px solid var(--glass-border);display:block;margin-bottom:8px}
figure figcaption{font-size:12.5px;color:var(--ink-dim);text-align:center;margin-bottom:22px}
.cta{display:inline-block;font-size:1.15rem;font-weight:900;background:linear-gradient(90deg,var(--accent-hot),var(--accent));color:#fff;padding:14px 38px;border-radius:99px;margin:6px 0 30px;box-shadow:0 6px 24px rgba(154,50,239,0.45)}
.cta:hover{text-decoration:none;filter:brightness(1.1)}
h2{font-size:1.25rem;font-weight:900;margin:26px 0 10px;color:var(--accent)}
p{margin-bottom:14px}
ul.features{list-style:none;margin-bottom:14px}
ul.features li{padding:7px 0 7px 30px;position:relative}
ul.features li::before{content:'✔';position:absolute;left:4px;color:var(--kofi);font-weight:900}
.note{font-size:0.9rem;color:var(--ink-dim);background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:14px 18px;margin:18px 0}
.related{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:10px 0 26px}
.related a{display:block;background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;padding:14px 16px;color:var(--ink);font-weight:800}
.related a:hover{text-decoration:none;border-color:var(--accent)}
.related a span{display:block;font-size:12px;font-weight:600;color:var(--ink-dim);margin-top:3px}
footer{margin-top:40px;padding-top:20px;border-top:1px solid var(--glass-border);font-size:14px;color:var(--ink-dim);display:flex;flex-wrap:wrap;gap:8px 22px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;margin-top:26px}
.gcard{background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column}
.gcard img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.gcard .in{padding:14px 16px 16px;display:flex;flex-direction:column;gap:6px;flex:1}
.gcard h3{font-size:1.05rem;font-weight:900}
.gcard .g{font-size:11.5px;font-weight:800;color:var(--kofi)}
.gcard p{font-size:13.5px;color:var(--ink-dim);margin:0;flex:1}
.gcard .links{display:flex;gap:10px;margin-top:8px}
.gcard .links a{font-weight:800;font-size:13.5px}
"""

GOAT = '<script data-goatcounter="https://robertpotau.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

def head(title, meta, canonical, ogimg, jsonld_blocks):
    ld = "\n".join(
        '<script type="application/ld+json">\n' + json.dumps(b, ensure_ascii=False, indent=2) + "\n</script>"
        for b in jsonld_blocks
    )
    return f"""<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta}">
<link rel="canonical" href="{canonical}">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<meta name="theme-color" content="#9a32ef">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta}">
<meta property="og:image" content="{ogimg}">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="summary_large_image">
{ld}
{GOAT}
<style>{CSS}</style>
</head>
<body>
<div class="wrap">"""

FOOT = """<footer>
  <a href="../index.html">🏫 Robert Potau — inici</a>
  <a href="index.html">🎮 Tots els jocs</a>
  <a href="https://ko-fi.com/robertpotau" data-goatcounter-click="kofi-fitxa">☕ Suporta el projecte</a>
</footer>
</div>
</body>
</html>
"""

def fitxa_page(g):
    url = f"{BASE}/jocs/{g['slug']}.html"
    play = f"../games/{g['slug']}/{g['entry']}"
    ogimg = f"{BASE}/screenshots/{g['shot']}.jpg"
    lr = {
        "@context": "https://schema.org",
        "@type": ["WebApplication", "LearningResource"],
        "name": g["name"],
        "url": f"{BASE}/games/{g['slug']}/{g['entry']}",
        "mainEntityOfPage": url,
        "description": g["meta"],
        "image": ogimg,
        "inLanguage": g["lang"],
        "applicationCategory": "EducationalApplication",
        "learningResourceType": "Game",
        "educationalUse": "practice",
        "educationalLevel": g["level"],
        "teaches": g["teaches"],
        "audience": {"@type": "EducationalAudience", "educationalRole": "student"},
        "isAccessibleForFree": True,
        "author": {"@type": "Person", "name": "Robert Potau", "url": BASE + "/"},
    }
    bc = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Inici", "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Jocs", "item": BASE + "/jocs/index.html"},
            {"@type": "ListItem", "position": 3, "name": g["name"], "item": url},
        ],
    }
    paras = "\n".join(f"<p>{p}</p>" for p in g["paragraphs"])
    feats = "\n".join(f"  <li>{f}</li>" for f in g["features"])
    rel = "\n".join(
        f'  <a href="{BY_SLUG[r]["slug"]}.html">{BY_SLUG[r]["emoji"]} {BY_SLUG[r]["name"]}<span>{BY_SLUG[r]["grade"]}</span></a>'
        for r in g["related"]
    )
    return head(g["seo_title"], g["meta"], url, ogimg, [lr, bc]) + f"""
<nav class="topbar">
  <a href="../index.html">← Robert Potau</a>
  <a href="index.html">🎮 Tots els jocs</a>
</nav>
<p class="crumb"><a href="../index.html">Inici</a> › <a href="index.html">Jocs</a> › {g["name"]}</p>
<h1>{g["emoji"]} {g["name"]}</h1>
<p class="lead">{g["lead"]}</p>
<div class="chips">
  <span class="chip">{g["subject"]}</span>
  <span class="chip grade">{g["grade"]}</span>
  <span class="chip">Gratuït</span>
</div>
<figure>
  <a href="{play}" data-goatcounter-click="fitxa-{g['slug']}-shot"><img class="shot" src="../screenshots/{g['shot']}.jpg" alt="Captura de pantalla del joc {g['name']}" loading="lazy"></a>
  <figcaption>Captura del joc — clica-la per jugar-hi</figcaption>
</figure>
<a class="cta" href="{play}" data-goatcounter-click="fitxa-{g['slug']}-play">Jugar-hi ara ▶</a>
<h2>Què s'hi treballa</h2>
{paras}
<h2>Característiques</h2>
<ul class="features">
{feats}
</ul>
<div class="note">🔒 Cap dada surt del dispositiu de l'alumne: el progrés es desa al navegador. 📱 Hi ha versió APK per a Android disponible sota petició. Fet per <a href="../index.html">Robert Potau</a>, professor de secundària de Tecnologia i Digitalització.</div>
<h2>També et pot interessar</h2>
<div class="related">
{rel}
</div>
""" + FOOT

def hub_page():
    url = f"{BASE}/jocs/index.html"
    ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Jocs educatius gratuïts en català",
        "url": url,
        "description": "Col·lecció de jocs educatius online gratuïts en català: matemàtiques, llengua, acollida, dibuix tècnic i anglès. Sense registre i sense anuncis.",
        "inLanguage": "ca",
        "author": {"@type": "Person", "name": "Robert Potau", "url": BASE + "/"},
    }
    cards = "\n".join(
        f'''  <div class="gcard">
    <a href="{g['slug']}.html"><img src="../screenshots/{g['shot']}.jpg" alt="Captura del joc {g['name']}" loading="lazy"></a>
    <div class="in">
      <span class="g">{g['grade']}</span>
      <h3>{g['emoji']} {g['name']}</h3>
      <p>{g['lead']}</p>
      <div class="links">
        <a href="{g['slug']}.html" data-goatcounter-click="hub-fitxa-{g['slug']}">ℹ️ Fitxa</a>
        <a href="../games/{g['slug']}/{g['entry']}" data-goatcounter-click="hub-play-{g['slug']}">Jugar ▶</a>
      </div>
    </div>
  </div>'''
        for g in GAMES
    )
    title = "Jocs educatius gratuïts en català — Primària i ESO"
    meta = "10 jocs educatius online gratuïts en català: matemàtiques, ortografia, lectoescriptura, acollida, dibuix tècnic i anglès. Sense registre, sense anuncis, fets per un professor."
    return head(title, meta, url, f"{BASE}/og-image.png", [ld]) + f"""
<nav class="topbar">
  <a href="../index.html">← Robert Potau</a>
</nav>
<h1>🎮 Jocs educatius gratuïts en català</h1>
<p class="lead">Deu jocs per a Primària, ESO i aula d'acollida, fets als vespres per un professor de secundària. Tots funcionen directament al navegador — ordinador, tauleta, mòbil o pissarra digital — sense instal·lar res, sense registre i sense anuncis.</p>
<p>Cada joc té la seva fitxa amb tota la informació per al docent: què s'hi treballa, per a quins cursos és adequat i quins modes de joc inclou. Les demos són gratuïtes per sempre; si un joc t'estalvia una tarda de feina, pots <a href="https://ko-fi.com/robertpotau" data-goatcounter-click="kofi-hub">convidar-me a un cafè</a>.</p>
<div class="grid">
{cards}
</div>
<div class="note" style="margin-top:26px">🏫 Vols un joc fet a mida per al teu centre o editorial? <a href="../index.html">Escriu-me</a> — el procés és senzill: definim l'abast, et faig un prototip i l'iterem junts.</div>
""" + FOOT

os.makedirs(OUT, exist_ok=True)
for g in GAMES:
    p = os.path.join(OUT, g["slug"] + ".html")
    with io.open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(fitxa_page(g))
    print("ok", p)
with io.open(os.path.join(OUT, "index.html"), "w", encoding="utf-8", newline="\n") as f:
    f.write(hub_page())
print("ok hub")
print("done: 11 pages")
