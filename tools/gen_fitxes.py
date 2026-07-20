# -*- coding: utf-8 -*-
"""Generate the static per-game "fitxa" pages in CA + ES + EN, plus the 3 hubs.

Output (all committed, regenerate after editing GAMES/UI below):
  jocs/<slug>.html + jocs/index.html          (Catalan, canonical/x-default)
  es/jocs/<slug>.html + es/jocs/index.html    (Spanish)
  en/jocs/<slug>.html + en/jocs/index.html    (English)

Every page: self-canonical + hreflang cluster + LearningResource/Breadcrumb
JSON-LD + language-switcher links. URLs are root-absolute (pages live at
different depths). Kept OUTSIDE games/ so robocopy /MIR never touches it.
SEO Tier C1/C2 — see SEO-UPGRADES.md.
"""
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://robertpotau.github.io"
LANGS = ("ca", "es", "en")

UI = {
    "ca": dict(
        home="← Robert Potau", all_games="🎮 Tots els jocs", crumb_home="Inici", crumb_games="Jocs",
        figcap="Captura del joc — clica-la per jugar-hi", play="Jugar-hi ara ▶",
        what="Què s'hi treballa", feats="Característiques", related="També et pot interessar",
        free="Gratuït", fitxa="ℹ️ Fitxa", jugar="Jugar ▶",
        game_in={"ca": "🗣 Joc en català", "en": "🗣 Joc en anglès"},
        note='🔒 Cap joc envia dades a cap servidor: el progrés es desa al navegador. 📱 Hi ha versió APK per a Android disponible sota petició. Fet per <a href="/index.html">Robert Potau</a>, professor de secundària de Tecnologia i Digitalització.',
        foot_home="🏫 Robert Potau — inici", foot_kofi="☕ Suporta el projecte",
    ),
    "es": dict(
        home="← Robert Potau", all_games="🎮 Todos los juegos", crumb_home="Inicio", crumb_games="Juegos",
        figcap="Captura del juego — haz clic para jugar", play="Jugar ahora ▶",
        what="Qué se trabaja", feats="Características", related="También te puede interesar",
        free="Gratis", fitxa="ℹ️ Ficha", jugar="Jugar ▶",
        game_in={"ca": "🗣 Juego en catalán", "en": "🗣 Juego en inglés"},
        note='🔒 Ningún juego envía datos a ningún servidor: el progreso se guarda en el navegador. 📱 Hay versión APK para Android disponible bajo petición. Hecho por <a href="/es/index.html">Robert Potau</a>, profesor de secundaria de Tecnología y Digitalización.',
        foot_home="🏫 Robert Potau — inicio", foot_kofi="☕ Apoya el proyecto",
    ),
    "en": dict(
        home="← Robert Potau", all_games="🎮 All games", crumb_home="Home", crumb_games="Games",
        figcap="Screenshot — click it to play", play="Play now ▶",
        what="What it teaches", feats="Features", related="You may also like",
        free="Free", fitxa="ℹ️ Info", jugar="Play ▶",
        game_in={"ca": "🗣 Game in Catalan", "en": "🗣 Game in English"},
        note='🔒 No game sends data anywhere: progress is stored in the browser. 📱 An Android APK is available on request. Made by <a href="/en/index.html">Robert Potau</a>, secondary school teacher of Technology.',
        foot_home="🏫 Robert Potau — home", foot_kofi="☕ Support the project",
    ),
}

HUB = {
    "ca": dict(
        title="Jocs educatius gratuïts en català — Primària i ESO",
        meta="10 jocs educatius online gratuïts en català: matemàtiques, ortografia, lectoescriptura, acollida, dibuix tècnic i anglès. Sense registre, sense anuncis, fets per un professor.",
        h1="🎮 Jocs educatius gratuïts en català",
        lead="Deu jocs per a Primària, ESO i aula d'acollida, fets als vespres per un professor de secundària. Tots funcionen directament al navegador — ordinador, tauleta, mòbil o pissarra digital — sense instal·lar res, sense registre i sense anuncis.",
        p2='Cada joc té la seva fitxa amb tota la informació per al docent: què s\'hi treballa, per a quins cursos és adequat i quins modes de joc inclou. Les demos són gratuïtes per sempre; si un joc t\'estalvia una tarda de feina, pots <a href="https://ko-fi.com/robertpotau" data-goatcounter-click="kofi-hub">convidar-me a un cafè</a>.',
        note='🏫 Vols un joc fet a mida per al teu centre o editorial? <a href="/index.html">Escriu-me</a> — el procés és senzill: definim l\'abast, et faig un prototip i l\'iterem junts.',
        coll_name="Jocs educatius gratuïts en català",
        coll_desc="Col·lecció de jocs educatius online gratuïts en català: matemàtiques, llengua, acollida, dibuix tècnic i anglès. Sense registre i sense anuncis.",
    ),
    "es": dict(
        title="Juegos educativos gratuitos para Primaria y ESO",
        meta="10 juegos educativos online gratuitos: matemáticas, ortografía catalana, lectoescritura, aula de acogida, dibujo técnico e inglés. Sin registro, sin anuncios, hechos por un profesor.",
        h1="🎮 Juegos educativos gratuitos",
        lead="Diez juegos para Primaria, ESO y aula de acogida, hechos por las tardes por un profesor de secundaria de Cataluña. Todos funcionan directamente en el navegador — ordenador, tableta, móvil o pizarra digital — sin instalar nada, sin registro y sin anuncios. La mayoría están en catalán (son para la escuela catalana); los de inglés, en inglés.",
        p2='Cada juego tiene su ficha con toda la información para el docente: qué se trabaja, para qué cursos es adecuado y qué modos de juego incluye. Las demos son gratuitas para siempre; si un juego te ahorra una tarde de trabajo, puedes <a href="https://ko-fi.com/robertpotau" data-goatcounter-click="kofi-hub">invitarme a un café</a>.',
        note='🏫 ¿Quieres un juego a medida para tu centro o editorial? <a href="/es/index.html">Escríbeme</a> — el proceso es sencillo: definimos el alcance, te hago un prototipo y lo iteramos juntos.',
        coll_name="Juegos educativos gratuitos",
        coll_desc="Colección de juegos educativos online gratuitos: matemáticas, lengua, acogida, dibujo técnico e inglés. Sin registro y sin anuncios.",
    ),
    "en": dict(
        title="Free educational games for primary and secondary school",
        meta="10 free online educational games: maths, Catalan spelling, literacy, newcomer classes, technical drawing and English. No sign-up, no ads, made by a teacher.",
        h1="🎮 Free educational games",
        lead="Ten games for primary school, lower secondary (ESO) and newcomer classes, made in the evenings by a secondary school teacher in Catalonia. They all run right in the browser — computer, tablet, phone or interactive whiteboard — nothing to install, no sign-up, no ads. Most are in Catalan (they were built for Catalan schools); the English-learning ones are in English.",
        p2='Every game has an info page with everything a teacher needs: what it teaches, which ages it suits and which game modes it includes. The demos are free forever; if a game saves you an afternoon of work, you can <a href="https://ko-fi.com/robertpotau" data-goatcounter-click="kofi-hub">buy me a coffee</a>.',
        note='🏫 Want a custom game for your school or publisher? <a href="/en/index.html">Write to me</a> — the process is simple: we define the scope, I build a prototype and we iterate together.',
        coll_name="Free educational games",
        coll_desc="Collection of free online educational games: maths, language, newcomer classes, technical drawing and English. No sign-up and no ads.",
    ),
}

# game_lang = language of the GAME itself (ca or en) — shown as a chip and used as JSON-LD inLanguage
GAMES = [
    dict(
        slug="calcuherois", entry="CalcuHerois.html", shot="calcuherois", emoji="🧮",
        name="CalcuHerois", game_lang="ca", related=["fraccions", "geometria", "vistes"],
        teaches={"ca": "càlcul mental, matemàtiques", "es": "cálculo mental, matemáticas", "en": "mental arithmetic, mathematics"},
        level={"ca": "Primària 3r-6è", "es": "Primaria 3.º-6.º", "en": "Primary, ages 8-12"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="CalcuHerois — Juego de cálculo mental gratuito para Primaria",
                meta="Juego gratuito de cálculo mental para Primaria: 17 misiones, héroes y rangos para practicar sumas, restas, multiplicaciones y divisiones. Sin registro ni anuncios.",
                subject="Cálculo mental", grade="Primaria 3.º-6.º",
                lead="Un juego donde cada operación bien resuelta te hace un poco más héroe.",
                paragraphs=[
                    "CalcuHerois convierte la práctica del cálculo mental en una aventura: el alumno supera misiones progresivas de sumas, restas, multiplicaciones, divisiones y otros retos numéricos, y a medida que acierta va subiendo de rango y desbloqueando héroes.",
                    "La dificultad crece misión a misión — 17 en total — de manera que cada alumno puede avanzar a su ritmo: los primeros niveles refuerzan el cálculo básico y los últimos ya exigen verdadera agilidad mental. La autocorrección es inmediata: si te equivocas, vuelves a intentarlo.",
                    "Para el docente hay un espacio del profesor protegido con PIN desde donde se puede seguir el progreso del grupo. El juego funciona directamente en el navegador — ordenador, tableta, móvil o pizarra digital — y el progreso se guarda en el dispositivo del alumno. La interfaz del juego está en catalán.",
                ],
                features=[
                    "17 misiones progresivas de cálculo mental",
                    "Sumas, restas, multiplicaciones, divisiones y más",
                    "Sistema de rangos y héroes para mantener la motivación",
                    "Espacio del profesor con seguimiento del grupo",
                    "Funciona en navegador, tableta y pizarra digital",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="CalcuHerois — Free mental arithmetic game for primary school",
                meta="Free mental arithmetic game for primary school: 17 missions, heroes and ranks to practise addition, subtraction, multiplication and division. No sign-up, no ads.",
                subject="Mental arithmetic", grade="Primary, ages 8-12",
                lead="A game where every operation you get right makes you a little more of a hero.",
                paragraphs=[
                    "CalcuHerois turns mental arithmetic practice into an adventure: students work through progressive missions of addition, subtraction, multiplication, division and other number challenges, climbing ranks and unlocking heroes as they go.",
                    "Difficulty grows mission by mission — 17 in total — so every student can advance at their own pace: the first levels reinforce basic arithmetic and the last ones demand real mental agility. Correction is instant: get it wrong, try again.",
                    "Teachers get a PIN-protected teacher area to follow the group's progress. The game runs right in the browser — computer, tablet, phone or interactive whiteboard — and progress is stored on the student's device. The game interface is in Catalan.",
                ],
                features=[
                    "17 progressive mental arithmetic missions",
                    "Addition, subtraction, multiplication, division and more",
                    "Ranks and heroes to keep motivation up",
                    "Teacher area with group progress",
                    "Works in browser, tablet and interactive whiteboard",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="fraccions", entry="fraccions.html", shot="fraccions", emoji="🍕",
        name="Fraccions", game_lang="ca", related=["calcuherois", "geometria", "ortografia"],
        teaches={"ca": "fraccions, matemàtiques", "es": "fracciones, matemáticas", "en": "fractions, mathematics"},
        level={"ca": "Primària 4t-6è i 1r ESO", "es": "Primaria 4.º-6.º y 1.º ESO", "en": "Ages 9-13"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Juego de Fracciones online gratuito para Primaria y ESO",
                meta="Juego online gratuito para aprender fracciones: representación gráfica, equivalencias, comparación y operaciones, con modo mezcla para repasarlo todo. Primaria y 1.º ESO.",
                subject="Fracciones", grade="Primaria 4.º-6.º · 1.º ESO",
                lead="Del trozo de pizza a las operaciones: las fracciones, jugando.",
                paragraphs=[
                    "Las fracciones son uno de los escollos clásicos de las matemáticas en Primaria y primero de ESO. Este juego las trabaja desde varias puertas de entrada: la representación gráfica, las fracciones equivalentes, la comparación y las operaciones, cada una con su propio modo de juego.",
                    "El modo mezcla combina preguntas de todos los temas, ideal para repasar antes de un examen o como reto final. Cada respuesta tiene corrección inmediata, y el sistema de avatares y progresión hace que el alumnado tenga ganas de volver.",
                    "Como todos los juegos de esta colección, funciona directamente en el navegador sin instalar nada ni registrarse, y el progreso de cada alumno queda guardado en su dispositivo. La interfaz del juego está en catalán.",
                ],
                features=[
                    "Varios modos para entender el concepto de fracción",
                    "Representación gráfica, equivalencias y comparación",
                    "Práctica de operaciones con fracciones",
                    "Modo mezcla para repasarlo todo",
                    "Avatares y progresión para cada alumno",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Free online Fractions game for primary school",
                meta="Free online game to learn fractions: visual representation, equivalent fractions, comparison and operations, plus a mix mode to revise everything. Ages 9-13.",
                subject="Fractions", grade="Ages 9-13",
                lead="From pizza slices to operations: fractions, through play.",
                paragraphs=[
                    "Fractions are one of the classic stumbling blocks of primary school maths. This game approaches them from several angles: visual representation, equivalent fractions, comparison and operations, each with its own game mode.",
                    "The mix mode combines questions from every topic — perfect for revising before a test or as a final challenge. Every answer is corrected instantly, and the avatar and progression system keeps students coming back.",
                    "Like every game in this collection, it runs right in the browser with nothing to install and no sign-up, and each student's progress is stored on their device. The game interface is in Catalan.",
                ],
                features=[
                    "Several modes to understand what a fraction is",
                    "Visual representation, equivalences and comparison",
                    "Practice of operations with fractions",
                    "Mix mode to revise everything",
                    "Avatars and progression for every student",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="geometria", entry="index.html", shot="geometria", emoji="🔺",
        name="Geometria", game_lang="ca", related=["vistes", "fraccions", "calcuherois"],
        teaches={"ca": "geometria, figures planes", "es": "geometría, figuras planas", "en": "geometry, plane shapes"},
        level={"ca": "Primària 5è - 2n ESO", "es": "Primaria 5.º - 2.º ESO", "en": "Ages 10-14"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Juego de Geometría online gratuito (Primaria y ESO)",
                meta="Juego online gratuito de geometría: figuras planas y sus propiedades con autocorrección inmediata. Para Primaria (5.º-6.º) y primer ciclo de ESO.",
                subject="Geometría", grade="Primaria 5.º - ESO 2.º",
                lead="Figuras, lados, ángulos y propiedades — aprendidos jugando, no memorizando.",
                paragraphs=[
                    "Este juego repasa la geometría plana de manera interactiva: reconocer figuras, contar lados y vértices, y relacionar cada forma con sus propiedades. Pensado para el final de Primaria y el primer ciclo de ESO, donde estos contenidos deben consolidarse.",
                    "Todo es autocorrectivo: el alumno recibe la respuesta al instante y puede repetir tantas veces como haga falta. El sistema de avatares personalizables hace que cada uno tenga su personaje y su progreso.",
                    "Funciona en el navegador de cualquier dispositivo — también en la pizarra digital del aula — sin instalación ni registro. La interfaz del juego está en catalán.",
                ],
                features=[
                    "Figuras geométricas planas y sus propiedades",
                    "Autocorrección inmediata",
                    "Avatares personalizables",
                    "Dificultad adecuada de 5.º de Primaria a 2.º de ESO",
                    "Funciona en navegador, tableta y pizarra digital",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Free online Geometry game (primary and lower secondary)",
                meta="Free online geometry game: plane shapes and their properties with instant correction. For ages 10 to 14.",
                subject="Geometry", grade="Ages 10-14",
                lead="Shapes, sides, angles and properties — learned by playing, not memorising.",
                paragraphs=[
                    "This game reviews plane geometry interactively: recognising shapes, counting sides and vertices, and matching each shape with its properties. Designed for the end of primary school and the first years of secondary, where these contents need consolidating.",
                    "Everything is self-correcting: students get the answer instantly and can repeat as many times as needed. The customisable avatar system gives everyone their own character and their own progress.",
                    "It works in the browser of any device — including the classroom's interactive whiteboard — with no installation and no sign-up. The game interface is in Catalan.",
                ],
                features=[
                    "Plane geometric shapes and their properties",
                    "Instant self-correction",
                    "Customisable avatars",
                    "Difficulty suited to ages 10-14",
                    "Works in browser, tablet and interactive whiteboard",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="quina-hora-es", entry="index.html", shot="quina-hora-es", emoji="🕐",
        name="Quina hora és?", game_lang="ca", related=["what-time-is-it", "lletra-a-lletra", "aula-acollida"],
        teaches={"ca": "lectura de l'hora, sistema de quarts català", "es": "lectura de la hora, sistema catalán de cuartos", "en": "telling the time in Catalan, the quarters system"},
        level={"ca": "Primària 1r-3r", "es": "Primaria 1.º-3.º", "en": "Ages 6-9"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Quina hora és? — Juego para aprender las horas en catalán",
                meta="Juego gratuito para aprender a leer la hora en catalán con el sistema de cuartos: reloj analógico interactivo, 2 modos y 5 estilos de reloj. Primaria 1.º-3.º.",
                subject="Medida del tiempo", grade="Primaria 1.º-3.º",
                lead="Un quart de dues, dos quarts de tres… el sistema catalán de cuartos, dominado jugando.",
                paragraphs=[
                    "Leer la hora en catalán tiene su propia gramática: el sistema de cuartos (\"un quart de dues\", \"dos quarts i mig de cinc\") no se parece a cómo se dice en castellano ni en inglés, y cuesta de consolidar. Este juego lo trabaja específicamente, con un reloj analógico interactivo.",
                    "Hay dos modos de juego — para aprender y para ponerse a prueba — y cinco estilos de reloj distintos para que el alumnado se acostumbre a leer la hora en cualquier esfera. La pantalla del profesor permite hacer dictados de horas a toda la clase.",
                    "Ideal para ciclo inicial y medio de Primaria, y también para el aula de acogida, donde el sistema de cuartos es una de las particularidades del catalán que más sorprende. El juego está en catalán — es precisamente su propósito.",
                ],
                features=[
                    "El sistema tradicional catalán de cuartos",
                    "Reloj analógico interactivo y manipulable",
                    "2 modos: aprender y practicar",
                    "5 estilos de reloj diferentes",
                    "Pantalla del profesor para dictados de horas",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Quina hora és? — Game to learn telling the time in Catalan",
                meta="Free game to learn telling the time in Catalan with the traditional quarters system: interactive analogue clock, 2 modes and 5 clock styles. Ages 6-9.",
                subject="Telling the time", grade="Ages 6-9",
                lead="Un quart de dues, dos quarts de tres… the Catalan quarters system, mastered through play.",
                paragraphs=[
                    "Telling the time in Catalan has a grammar of its own: the quarters system (\"un quart de dues\", \"dos quarts i mig de cinc\") is unlike Spanish or English, and takes real practice to stick. This game targets it specifically, with an interactive analogue clock.",
                    "There are two game modes — one to learn, one to test yourself — and five different clock styles so learners get used to reading any clock face. The teacher screen lets you dictate times to the whole class.",
                    "Ideal for the first years of primary school, and also for newcomer classes, where the quarters system is one of the most surprising quirks of Catalan. The game is in Catalan — that is precisely its point.",
                ],
                features=[
                    "The traditional Catalan quarters system",
                    "Interactive, draggable analogue clock",
                    "2 modes: learn and practise",
                    "5 different clock styles",
                    "Teacher screen for time dictations",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="lletra-a-lletra", entry="index.html", shot="lletra-a-lletra", emoji="📖",
        name="Lletra a Lletra", game_lang="ca", related=["aula-acollida", "ortografia", "quina-hora-es"],
        teaches={"ca": "lectoescriptura en català", "es": "lectoescritura en catalán", "en": "literacy in Catalan"},
        level={"ca": "Infantil P5 - Primària 2n, i persones adultes", "es": "Infantil P5 - Primaria 2.º, y personas adultas", "en": "Ages 5-8, and adult learners"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Lletra a Lletra — Juego de lectoescritura en catalán gratuito",
                meta="Juego gratuito de lectoescritura en catalán: escuchar, completar, separar sílabas, asociar y leer palabras, con voz sintetizada. Para niños, adultos y aula de acogida.",
                subject="Lectoescritura", grade="Infantil P5 - Primaria 2.º · Adultos",
                lead="Aprender a leer y escribir en catalán, palabra a palabra y con voz propia.",
                paragraphs=[
                    "Lletra a Lletra es un juego de lectoescritura en catalán con seis maneras de trabajar cada palabra: escucharla, completar las letras que faltan, separarla en sílabas, asociarla con su imagen y leerla. Cada actividad suena: el juego lee en voz alta con síntesis de voz en catalán.",
                    "Está pensado para dos públicos que a menudo quedan desatendidos a la vez: los niños que empiezan (P5 hasta 2.º de Primaria) y las personas adultas que aprenden a leer y escribir en catalán, por ejemplo en el aula de acogida o la escuela de adultos. Los seis perfiles permiten que varias personas compartan el mismo dispositivo sin mezclar progresos.",
                    "Como siempre, funciona directamente en el navegador, sin registro, y es completamente gratuito.",
                ],
                features=[
                    "6 modos: escuchar, completar, sílabas, asociar, leer…",
                    "Voz sintetizada en catalán en todas las actividades",
                    "6 perfiles para compartir dispositivo",
                    "Pensado para niños y para personas adultas",
                    "Ideal para aula de acogida y escuela de adultos",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Lletra a Lletra — Free Catalan literacy game",
                meta="Free Catalan literacy game: listen, complete, split into syllables, match and read words, with synthesised speech. For children, adults and newcomer classes.",
                subject="Literacy", grade="Ages 5-8 · Adults",
                lead="Learning to read and write in Catalan, word by word and out loud.",
                paragraphs=[
                    "Lletra a Lletra is a Catalan literacy game with six ways to work on each word: listen to it, fill in the missing letters, split it into syllables, match it with its picture and read it. Every activity has sound: the game reads aloud with Catalan speech synthesis.",
                    "It is designed for two audiences that are often overlooked at the same time: children who are just starting (ages 5 to 8) and adults learning to read and write in Catalan, for instance in newcomer classes or adult schools. Six profiles let several people share the same device without mixing up progress.",
                    "As always, it runs right in the browser, with no sign-up, and it is completely free.",
                ],
                features=[
                    "6 modes: listen, complete, syllables, match, read…",
                    "Catalan synthesised speech in every activity",
                    "6 profiles to share a device",
                    "Designed for children and for adult learners",
                    "Ideal for newcomer classes and adult schools",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="ortografia", entry="index.html", shot="ortografia", emoji="✍️",
        name="Ortografia", game_lang="ca", related=["lletra-a-lletra", "aula-acollida", "fraccions"],
        teaches={"ca": "ortografia catalana", "es": "ortografía catalana", "en": "Catalan spelling"},
        level={"ca": "Primària 3r-6è", "es": "Primaria 3.º-6.º", "en": "Ages 8-12"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Juego de Ortografía Catalana online gratuito",
                meta="Juego online gratuito de ortografía catalana: acentuación, apóstrofo, ese sorda y sonora, ce trencada, comas y más — 10 bloques temáticos autocorrectivos.",
                subject="Ortografía", grade="Primaria 3.º-6.º",
                lead="La ortografía catalana, bloque a bloque y sin miedo al bolígrafo rojo.",
                paragraphs=[
                    "Diez bloques temáticos cubren los puntos donde la ortografía catalana duele más: la acentuación, el apóstrofo, la ese sorda y la sonora, la ce trencada, las comas y más. Cada bloque se puede trabajar por separado, de manera que el juego se adapta al tema que se esté haciendo en clase.",
                    "Todas las actividades son autocorrectivas y se pueden repetir tantas veces como haga falta: el error no penaliza, enseña. La progresión queda guardada en el dispositivo de cada alumno.",
                    "Es una herramienta de repaso perfecta para los últimos cursos de Primaria, y también funciona muy bien como refuerzo en la ESO y en el aula de acogida. El juego está en catalán, naturalmente.",
                ],
                features=[
                    "10 bloques temáticos de ortografía catalana",
                    "Acentuación, apóstrofo, s/ss/ç, comas y más",
                    "Actividades autocorrectivas y repetibles",
                    "Progresión guardada por alumno",
                    "Útil desde Primaria hasta refuerzo de ESO",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Free online Catalan Spelling game",
                meta="Free online Catalan spelling game: accents, apostrophes, s/ss/ç, commas and more — 10 self-correcting topic blocks.",
                subject="Spelling", grade="Ages 8-12",
                lead="Catalan spelling, block by block and with no fear of the red pen.",
                paragraphs=[
                    "Ten topic blocks cover the points where Catalan spelling hurts most: accents, the apostrophe, voiced and voiceless s, ç, commas and more. Each block can be practised separately, so the game adapts to whatever is being covered in class.",
                    "Every activity is self-correcting and can be repeated as many times as needed: mistakes don't punish, they teach. Progression is stored on each student's device.",
                    "It is a perfect revision tool for the last years of primary school, and also works well as reinforcement in secondary and in newcomer classes. The game is in Catalan, naturally.",
                ],
                features=[
                    "10 topic blocks of Catalan spelling",
                    "Accents, apostrophe, s/ss/ç, commas and more",
                    "Self-correcting, repeatable activities",
                    "Per-student saved progression",
                    "Useful from primary through secondary reinforcement",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="aula-acollida", entry="index.html", shot="aula-acollida", emoji="🌍",
        name="Jocs Aula d'Acollida", game_lang="ca", related=["lletra-a-lletra", "ortografia", "quina-hora-es"],
        teaches={"ca": "vocabulari català, català per a nouvinguts", "es": "vocabulario catalán, catalán para recién llegados", "en": "Catalan vocabulary, Catalan for newcomers"},
        level={"ca": "Tots els nivells — aula d'acollida", "es": "Todos los niveles — aula de acogida", "en": "All levels — newcomer classes"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Jocs Aula d'Acollida — Catalán para alumnado recién llegado",
                meta="Juegos gratuitos de vocabulario catalán para alumnado recién llegado: 12 unidades temáticas, 16 modos de juego, más de 400 palabras con imagen y audio, y repaso inteligente.",
                subject="Acogida · Lengua", grade="Todos los niveles",
                lead="Las primeras 400 palabras en catalán, aprendidas jugando desde el primer día.",
                paragraphs=[
                    "Cuando un alumno acaba de llegar y tiene que aprenderlo todo, el vocabulario básico es la primera puerta. Este conjunto de juegos lo trabaja con 12 unidades temáticas — el cuerpo, la casa, la comida, la escuela… — y más de 400 palabras, cada una con su imagen y su audio.",
                    "Los 16 modos de juego atacan cada palabra desde ángulos distintos: reconocerla, escribirla, escucharla, relacionarla. El repaso inteligente recupera automáticamente las palabras que más cuestan a cada alumno, y el modo de lectura fácil acompaña a quien todavía lee con dificultad.",
                    "El sistema de experiencia y progresión hace visible el avance — algo que, para un alumno recién llegado, vale oro. Todo funciona en el navegador, gratis y sin registro.",
                ],
                features=[
                    "12 unidades temáticas de vocabulario esencial",
                    "Más de 400 palabras con imagen y audio",
                    "16 modos de juego diferentes",
                    "Repaso inteligente de las palabras que más cuestan",
                    "Modo de lectura fácil",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Jocs Aula d'Acollida — Catalan for newcomer students",
                meta="Free Catalan vocabulary games for newcomer students: 12 thematic units, 16 game modes, over 400 words with picture and audio, and smart revision.",
                subject="Newcomers · Language", grade="All levels",
                lead="Your first 400 words in Catalan, learned through play from day one.",
                paragraphs=[
                    "When a student has just arrived and has to learn everything, basic vocabulary is the first door. This set of games works on it through 12 thematic units — the body, the house, food, school… — and over 400 words, each with its picture and its audio.",
                    "The 16 game modes attack each word from different angles: recognise it, write it, listen to it, relate it. Smart revision automatically brings back the words each student struggles with most, and the easy-reading mode supports those who still read with difficulty.",
                    "The experience and progression system makes progress visible — which, for a newcomer student, is worth gold. Everything runs in the browser, free and with no sign-up.",
                ],
                features=[
                    "12 thematic units of essential vocabulary",
                    "Over 400 words with picture and audio",
                    "16 different game modes",
                    "Smart revision of the hardest words",
                    "Easy-reading mode",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="vistes", entry="index.html", shot="vistes", emoji="📐",
        name="Vistes: Planta, Alçat i Perfil", game_lang="ca", related=["geometria", "calcuherois", "fraccions"],
        teaches={"ca": "sistema dièdric, vistes, dibuix tècnic", "es": "sistema diédrico, vistas, dibujo técnico", "en": "orthographic projection, technical drawing"},
        level={"ca": "ESO 3r-4t i Batxillerat", "es": "ESO 3.º-4.º y Bachillerato", "en": "Ages 14-18"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="Vistas: planta, alzado y perfil — Juego de dibujo técnico",
                meta="Juego gratuito de dibujo técnico para practicar el sistema diédrico: piezas 3D interactivas para deducir planta, alzado y perfil. Para ESO y Bachillerato.",
                subject="Dibujo técnico", grade="ESO 3.º-4.º · Bachillerato",
                lead="Mirar una pieza en 3D y ver sus tres vistas: el ojo técnico se entrena jugando.",
                paragraphs=[
                    "El sistema diédrico — deducir la planta, el alzado y el perfil de una pieza — es uno de los contenidos de Tecnología y dibujo técnico que más cuesta visualizar. Este juego lo convierte en una práctica directa: piezas 3D que se pueden girar con el dedo o el ratón, y cuatro modos de juego para poner el ojo a prueba.",
                    "El motor 3D es propio y ligero, así que funciona fluido en cualquier navegador sin instalar nada. El sistema de perfiles con experiencia y trofeos permite que cada alumno siga su propio progreso.",
                    "Pensado para segundo ciclo de ESO y Bachillerato, y útil también como preparación para el dibujo técnico de Selectividad. La interfaz del juego está en catalán.",
                ],
                features=[
                    "Piezas 3D interactivas que se pueden girar",
                    "4 modos de juego sobre el sistema diédrico",
                    "Planta, alzado y perfil con autocorrección",
                    "Perfiles con experiencia y trofeos",
                    "Motor 3D propio, ligero, sin instalación",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="Views: top, front and side — Technical drawing game",
                meta="Free technical drawing game to practise orthographic projection: interactive 3D pieces to deduce top, front and side views. For secondary school.",
                subject="Technical drawing", grade="Ages 14-18",
                lead="Look at a 3D piece and see its three views: the technical eye is trained by playing.",
                paragraphs=[
                    "Orthographic projection — deducing the top, front and side views of a piece — is one of the hardest technical drawing contents to visualise. This game turns it into direct practice: 3D pieces you can rotate with a finger or the mouse, and four game modes to put your eye to the test.",
                    "The 3D engine is custom-built and lightweight, so it runs smoothly in any browser with nothing to install. The profile system with experience points and trophies lets every student track their own progress.",
                    "Designed for upper secondary, and also useful as preparation for university-entrance technical drawing exams. The game interface is in Catalan.",
                ],
                features=[
                    "Interactive 3D pieces you can rotate",
                    "4 game modes on orthographic projection",
                    "Top, front and side views with self-correction",
                    "Profiles with experience points and trophies",
                    "Custom lightweight 3D engine, no installation",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="what-time-is-it", entry="index.html", shot="what-time-is-it", emoji="🕒",
        name="What's the Time?", game_lang="en", related=["verbs-english", "quina-hora-es", "calcuherois"],
        teaches={"ca": "les hores en anglès", "es": "las horas en inglés", "en": "telling the time in English"},
        level={"ca": "Primària 2n-4t", "es": "Primaria 2.º-4.º", "en": "Ages 7-10"},
        c=dict(
            ca=dict(
                seo_title="What's the Time? — Joc per aprendre les hores en anglès",
                meta="Joc gratuït per aprendre les hores en anglès: rellotge analògic interactiu, o'clock, half past i quarter, amb pantalla per al professor. Primària 2n-4t.",
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
            ),
            es=dict(
                seo_title="What's the Time? — Juego para aprender las horas en inglés",
                meta="Juego gratuito para aprender las horas en inglés: reloj analógico interactivo, o'clock, half past y quarter, con pantalla para el profesor. Primaria 2.º-4.º.",
                subject="English", grade="Primaria 2.º-4.º",
                lead="O'clock, half past, quarter to… telling the time, jugando en clase de inglés.",
                paragraphs=[
                    "Decir la hora en inglés — \"it's half past three\", \"it's quarter to nine\" — es un contenido clásico de la clase de inglés de Primaria, y este juego lo trabaja con un reloj analógico interactivo que el alumno puede manipular.",
                    "Tiene dos modos de juego, para aprender y para ponerse a prueba, y cinco estilos de reloj para que el alumnado lea la hora en cualquier esfera. La pantalla del profesor permite dictar horas a toda la clase desde la pizarra digital.",
                    "Es la pareja inglesa del juego «Quina hora és?»: los dos juntos permiten comparar cómo se dice la hora en catalán y en inglés — dos sistemas bien distintos. El juego está en inglés.",
                ],
                features=[
                    "Reloj analógico interactivo",
                    "O'clock, half past, quarter past, quarter to",
                    "2 modos: learn y practice",
                    "5 estilos de reloj",
                    "Pantalla del profesor para dictados de horas",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="What's the Time? — Free clock game for English learners",
                meta="Free game to practise telling the time in English: interactive analogue clock, o'clock, half past and quarter, with a teacher screen for whole-class dictation. Ages 7-10.",
                subject="English", grade="Ages 7-10",
                lead="O'clock, half past, quarter to… telling the time, through play.",
                paragraphs=[
                    "Telling the time in English — \"it's half past three\", \"it's quarter to nine\" — is a classic of the primary English classroom, and this game practises it with an interactive analogue clock students can drag and set themselves.",
                    "It has two game modes, one to learn and one to test yourself, and five clock styles so learners can read the time on any face. The teacher screen lets you dictate times to the whole class from the interactive whiteboard.",
                    "It is the English twin of «Quina hora és?»: together they let students compare how the time is told in Catalan and in English — two very different systems.",
                ],
                features=[
                    "Interactive analogue clock",
                    "O'clock, half past, quarter past, quarter to",
                    "2 modes: learn and practice",
                    "5 clock styles",
                    "Teacher screen for time dictations",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
    dict(
        slug="verbs-english", entry="index.html", shot="verbquest", emoji="🗡️",
        name="VerbQuest", game_lang="en", related=["what-time-is-it", "ortografia", "aula-acollida"],
        teaches={"ca": "verbs regulars i irregulars en anglès", "es": "verbos regulares e irregulares en inglés", "en": "English regular and irregular verbs"},
        level={"ca": "ESO", "es": "ESO", "en": "Ages 12-16"},
        c=dict(
            ca=dict(
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
            ),
            es=dict(
                seo_title="VerbQuest — Juego de los verbos irregulares en inglés",
                meta="Juego gratuito para dominar los verbos regulares e irregulares en inglés: 8 modos de juego, pronunciación británica con audio y transcripción IPA. Para ESO.",
                subject="English", grade="ESO",
                lead="Go, went, gone: los verbos irregulares en inglés, derrotados uno a uno.",
                paragraphs=[
                    "La lista de verbos irregulares es el dragón que todo estudiante de inglés debe vencer tarde o temprano. VerbQuest la convierte en una misión: ocho modos de juego distintos para trabajar los verbos regulares e irregulares desde todas las direcciones — reconocerlos, escribirlos, escucharlos y encadenarlos.",
                    "Cada verbo se puede escuchar con pronunciación británica sintetizada e incluye su transcripción fonética IPA, de manera que el alumno no solo lo escribe bien: también lo dice bien. La interfaz se puede poner en catalán o en inglés.",
                    "Los seis perfiles permiten compartir dispositivo en el aula, y el progreso de cada uno queda guardado en el navegador. Gratuito y sin registro, como toda la colección.",
                ],
                features=[
                    "Verbos regulares e irregulares en inglés",
                    "8 modos de juego diferentes",
                    "Audio con pronunciación británica",
                    "Transcripción fonética IPA de cada verbo",
                    "Interfaz en catalán o en inglés · 6 perfiles",
                    "Gratuito, sin registro y sin anuncios",
                ],
            ),
            en=dict(
                seo_title="VerbQuest — Free English irregular verbs game",
                meta="Free game to master English regular and irregular verbs: 8 game modes, British pronunciation audio and IPA transcription. For secondary students.",
                subject="English", grade="Ages 12-16",
                lead="Go, went, gone: English irregular verbs, defeated one by one.",
                paragraphs=[
                    "The irregular verbs list is the dragon every English learner must slay sooner or later. VerbQuest turns it into a quest: eight different game modes to work on regular and irregular verbs from every direction — recognise them, write them, listen to them and chain them.",
                    "Every verb can be heard with synthesised British pronunciation and includes its IPA phonetic transcription, so students don't just write it right: they say it right. The interface can be set to Catalan or English.",
                    "Six profiles allow device sharing in the classroom, and everyone's progress is stored in the browser. Free and sign-up-free, like the whole collection.",
                ],
                features=[
                    "English regular and irregular verbs",
                    "8 different game modes",
                    "British pronunciation audio",
                    "IPA phonetic transcription of every verb",
                    "Interface in Catalan or English · 6 profiles",
                    "Free, no sign-up, no ads",
                ],
            ),
        ),
    ),
]

BY_SLUG = {g["slug"]: g for g in GAMES}

CSS = """
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@font-face{font-family:'Nunito';font-style:normal;font-weight:400 900;font-display:swap;src:url('/fonts/nunito-400.woff2') format('woff2')}
:root{--ink:#f5edff;--ink-dim:rgba(245,237,255,0.66);--accent:#c792ff;--accent-hot:#9a32ef;--kofi:#29d2ff;--glass:rgba(255,255,255,0.06);--glass-border:rgba(255,255,255,0.14);--radius:22px}
html{scroll-behavior:smooth;background:linear-gradient(180deg,#14082a 0%,#2a0a54 55%,#180a33 100%)}
html,body{color:var(--ink);font-family:'Nunito','Segoe UI',system-ui,sans-serif;line-height:1.6}
body{min-height:100vh}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:820px;margin:0 auto;padding:24px 20px 60px}
.topbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:34px;flex-wrap:wrap}
.topbar .nav{display:flex;gap:10px;flex-wrap:wrap}
.topbar a{font-weight:900;font-size:14px;letter-spacing:0.05em;background:var(--glass);border:1px solid var(--glass-border);padding:8px 16px;border-radius:99px;color:var(--ink)}
.topbar a:hover{text-decoration:none;border-color:var(--accent)}
.lang-links{display:flex;gap:6px}
.lang-links a{font-size:12px;font-weight:800;padding:6px 12px;color:var(--ink-dim)}
.lang-links a.active{color:#fff;background:var(--accent-hot);border-color:var(--accent-hot)}
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

def page_url(lang, page):  # page like "jocs/fraccions.html"
    return f"{BASE}/{page}" if lang == "ca" else f"{BASE}/{lang}/{page}"

def hreflang_block(page):
    lines = [f'<link rel="alternate" hreflang="{l}" href="{page_url(l, page)}">' for l in LANGS]
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{page_url("ca", page)}">')
    return "\n".join(lines)

def home_href(lang):
    return "/index.html" if lang == "ca" else f"/{lang}/index.html"

def hub_href(lang):
    return "/jocs/index.html" if lang == "ca" else f"/{lang}/jocs/index.html"

def lang_links(lang, page):
    out = []
    for l in LANGS:
        url = "/" + page if l == "ca" else f"/{l}/" + page
        cls = ' class="active"' if l == lang else ""
        out.append(f'<a href="{url}"{cls}>{l.upper()}</a>')
    return '<div class="lang-links">' + "".join(out) + "</div>"

def head(lang, title, meta, page, ogimg, jsonld_blocks):
    ld = "\n".join(
        '<script type="application/ld+json">\n' + json.dumps(b, ensure_ascii=False, indent=2) + "\n</script>"
        for b in jsonld_blocks
    )
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta}">
<link rel="canonical" href="{page_url(lang, page)}">
{hreflang_block(page)}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#9a32ef">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta}">
<meta property="og:image" content="{ogimg}">
<meta property="og:url" content="{page_url(lang, page)}">
<meta name="twitter:card" content="summary_large_image">
{ld}
{GOAT}
<style>{CSS}</style>
</head>
<body>
<div class="wrap">"""

def foot(lang):
    ui = UI[lang]
    return f"""<footer>
  <a href="{home_href(lang)}">{ui["foot_home"]}</a>
  <a href="{hub_href(lang)}">{ui["all_games"]}</a>
  <a href="https://ko-fi.com/robertpotau" data-goatcounter-click="kofi-fitxa">{ui["foot_kofi"]}</a>
</footer>
</div>
</body>
</html>
"""

def fitxa_page(g, lang):
    ui, c = UI[lang], g["c"][lang]
    page = f"jocs/{g['slug']}.html"
    play = f"/games/{g['slug']}/{g['entry']}"
    ogimg = f"{BASE}/screenshots/{g['shot']}.jpg"
    lr = {
        "@context": "https://schema.org",
        "@type": ["WebApplication", "LearningResource"],
        "name": g["name"],
        "url": f"{BASE}/games/{g['slug']}/{g['entry']}",
        "mainEntityOfPage": page_url(lang, page),
        "description": c["meta"],
        "image": ogimg,
        "inLanguage": g["game_lang"],
        "applicationCategory": "EducationalApplication",
        "learningResourceType": "Game",
        "educationalUse": "practice",
        "educationalLevel": g["level"][lang],
        "teaches": g["teaches"][lang],
        "audience": {"@type": "EducationalAudience", "educationalRole": "student"},
        "isAccessibleForFree": True,
        "author": {"@type": "Person", "name": "Robert Potau", "url": BASE + "/"},
    }
    bc = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": ui["crumb_home"], "item": page_url(lang, "index.html")},
            {"@type": "ListItem", "position": 2, "name": ui["crumb_games"], "item": page_url(lang, "jocs/index.html")},
            {"@type": "ListItem", "position": 3, "name": g["name"], "item": page_url(lang, page)},
        ],
    }
    paras = "\n".join(f"<p>{p}</p>" for p in c["paragraphs"])
    feats = "\n".join(f"  <li>{f}</li>" for f in c["features"])
    rel = "\n".join(
        f'  <a href="{("/" if lang == "ca" else f"/{lang}/") + "jocs/" + BY_SLUG[r]["slug"] + ".html"}">'
        f'{BY_SLUG[r]["emoji"]} {BY_SLUG[r]["name"]}<span>{BY_SLUG[r]["c"][lang]["grade"]}</span></a>'
        for r in g["related"]
    )
    return head(lang, c["seo_title"], c["meta"], page, ogimg, [lr, bc]) + f"""
<nav class="topbar">
  <div class="nav">
    <a href="{home_href(lang)}">{ui["home"]}</a>
    <a href="{hub_href(lang)}">{ui["all_games"]}</a>
  </div>
  {lang_links(lang, page)}
</nav>
<p class="crumb"><a href="{home_href(lang)}">{ui["crumb_home"]}</a> › <a href="{hub_href(lang)}">{ui["crumb_games"]}</a> › {g["name"]}</p>
<h1>{g["emoji"]} {g["name"]}</h1>
<p class="lead">{c["lead"]}</p>
<div class="chips">
  <span class="chip">{c["subject"]}</span>
  <span class="chip grade">{c["grade"]}</span>
  <span class="chip">{ui["game_in"][g["game_lang"]]}</span>
  <span class="chip">{ui["free"]}</span>
</div>
<figure>
  <a href="{play}" data-goatcounter-click="fitxa-{g['slug']}-shot"><img class="shot" src="/screenshots/{g['shot']}.jpg" alt="{g['name']}" loading="lazy"></a>
  <figcaption>{ui["figcap"]}</figcaption>
</figure>
<a class="cta" href="{play}" data-goatcounter-click="fitxa-{g['slug']}-play">{ui["play"]}</a>
<h2>{ui["what"]}</h2>
{paras}
<h2>{ui["feats"]}</h2>
<ul class="features">
{feats}
</ul>
<div class="note">{ui["note"]}</div>
<h2>{ui["related"]}</h2>
<div class="related">
{rel}
</div>
""" + foot(lang)

def hub_page(lang):
    ui, hub = UI[lang], HUB[lang]
    page = "jocs/index.html"
    ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": hub["coll_name"],
        "url": page_url(lang, page),
        "description": hub["coll_desc"],
        "inLanguage": lang,
        "author": {"@type": "Person", "name": "Robert Potau", "url": BASE + "/"},
    }
    prefix = "/" if lang == "ca" else f"/{lang}/"
    cards = "\n".join(
        f'''  <div class="gcard">
    <a href="{prefix}jocs/{g['slug']}.html"><img src="/screenshots/{g['shot']}.jpg" alt="{g['name']}" loading="lazy"></a>
    <div class="in">
      <span class="g">{g['c'][lang]['grade']}</span>
      <h3>{g['emoji']} {g['name']}</h3>
      <p>{g['c'][lang]['lead']}</p>
      <div class="links">
        <a href="{prefix}jocs/{g['slug']}.html" data-goatcounter-click="hub-fitxa-{g['slug']}">{ui['fitxa']}</a>
        <a href="/games/{g['slug']}/{g['entry']}" data-goatcounter-click="hub-play-{g['slug']}">{ui['jugar']}</a>
      </div>
    </div>
  </div>'''
        for g in GAMES
    )
    return head(lang, hub["title"], hub["meta"], page, f"{BASE}/og-image.png", [ld]) + f"""
<nav class="topbar">
  <div class="nav">
    <a href="{home_href(lang)}">{ui["home"]}</a>
  </div>
  {lang_links(lang, page)}
</nav>
<h1>{hub["h1"]}</h1>
<p class="lead">{hub["lead"]}</p>
<p>{hub["p2"]}</p>
<div class="grid">
{cards}
</div>
<div class="note" style="margin-top:26px">{hub["note"]}</div>
""" + foot(lang)

for lang in LANGS:
    out_dir = os.path.join(ROOT, "jocs" if lang == "ca" else os.path.join(lang, "jocs"))
    os.makedirs(out_dir, exist_ok=True)
    for g in GAMES:
        with io.open(os.path.join(out_dir, g["slug"] + ".html"), "w", encoding="utf-8", newline="\n") as f:
            f.write(fitxa_page(g, lang))
    with io.open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(hub_page(lang))
    print(f"ok {lang}: 10 fitxes + hub")
print("done: 33 pages")
