# -*- coding: utf-8 -*-
"""Genera la fitxa PDF del professor d'Al Mercat! en CA/ES/EN.

Sortida: jocs/al-mercat-fitxa.pdf, es/jocs/al-mercat-fitxa.pdf, en/jocs/al-mercat-fitxa.pdf
Textos dels nivells: extrets de joc-mercat/data.js (I18N) via Node, així no es dupliquen.
Requereix: reportlab. Reexecutar si canvia data.js o els textos d'aquí sota.
"""
import io, json, os, re, subprocess, tempfile
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(os.path.dirname(ROOT), "joc-mercat", "data.js")
SHOT = os.path.join(ROOT, "screenshots", "al-mercat.jpg")

ORANGE = colors.HexColor("#ea580c")
LIGHT = colors.HexColor("#fff3e0")
LINE = colors.HexColor("#f5c99b")
INK = colors.HexColor("#3a2a1a")
MUTED = colors.HexColor("#7a5c3e")

# I18N des de data.js
tmp = os.path.join(tempfile.gettempdir(), "_mercat_data.js")
with io.open(DATA_JS, encoding="utf-8") as f:
    src = f.read()
with io.open(tmp, "w", encoding="utf-8") as f:
    f.write(src + "\nprocess.stdout.write(JSON.stringify({I18N,LVX,VERSION,VERSION_DATE}));")
out = subprocess.run(["node", tmp], capture_output=True, text=True, check=True, encoding="utf-8").stdout
D = json.loads(out)
I18N = D["I18N"]
LVX = D["LVX"]

TXT = {
    "ca": dict(
        sub="Mates amb monedes i bitllets d'euro · 1r ESO i aula d'acollida", file="jocs/al-mercat-fitxa.pdf",
        what="Què s'hi treballa",
        what_p="Suma, resta i multiplicació amb euros, decimals simples (1,25 €) i preus per quilo, en un context real: comprar en un mercat. L'alumne paga posant monedes (d'1 cèntim a 2 €) i bitllets (de 5 a 50 €) al mostrador, i als nivells de canvi fa de botiguer i torna les monedes al client.",
        levels="Els 10 nivells", th=("Nivell", "Contingut", "Exemple"),
        use="Com usar-lo a l'aula",
        bullets=[
            "Obre <b>robertpotau.github.io/games/al-mercat/</b> a l'ordinador, tauleta o mòbil. No cal instal·lar res ni registrar-se.",
            "Cada alumne es crea un perfil (nom, avatar) i tria l'idioma: <b>català, castellà o només icones + veu</b> (llegeix l'enunciat en veu alta).",
            "Els nivells es poden triar lliurement; el «Repte del dia» barreja compres de diferents nivells. El comptador d'ajuda de la caixa és automàtic als nivells 1-4 (es pot canviar a l'engranatge).",
            "<b>Panell del professor:</b> 5 clics ràpids al títol «Al Mercat!». Mostra el progrés de cada alumne, permet canviar les compres per partida i exporta les dades a CSV.",
            "El progrés es desa al navegador del dispositiu; cap dada surt de l'ordinador.",
        ],
        note="Consell: per a alumnat que acaba d'arribar, comença pel nivell 1 amb el mode «Només icones + veu» i deixa l'ajuda del comptador activada.",
        foot="Fet per Robert Potau, professor · Gratuït, sense registre i sense anuncis",
    ),
    "es": dict(
        sub="Mates con monedas y billetes de euro · 1º ESO y aula de acogida", file="es/jocs/al-mercat-fitxa.pdf",
        what="Qué se trabaja",
        what_p="Suma, resta y multiplicación con euros, decimales sencillos (1,25 €) y precios por kilo, en un contexto real: comprar en un mercado. El alumno paga poniendo monedas (de 1 céntimo a 2 €) y billetes (de 5 a 50 €) en el mostrador, y en los niveles de vuelta hace de tendero y devuelve las monedas al cliente.",
        levels="Los 10 niveles", th=("Nivel", "Contenido", "Ejemplo"),
        use="Cómo usarlo en el aula",
        bullets=[
            "Abre <b>robertpotau.github.io/games/al-mercat/</b> en ordenador, tableta o móvil. No hay que instalar nada ni registrarse.",
            "Cada alumno crea un perfil (nombre, avatar) y elige el idioma: <b>catalán, castellano o solo iconos + voz</b> (lee el enunciado en voz alta).",
            "Los niveles se eligen libremente; el «Reto del día» mezcla compras de distintos niveles. El contador de ayuda de la caja es automático en los niveles 1-4 (se cambia en el engranaje).",
            "<b>Panel del profesor:</b> 5 clics rápidos en el título «Al Mercat!». Muestra el progreso de cada alumno, permite cambiar las compras por partida y exporta los datos a CSV.",
            "El progreso se guarda en el navegador del dispositivo; ningún dato sale del ordenador.",
        ],
        note="Consejo: para alumnado recién llegado, empieza por el nivel 1 con el modo «Solo iconos + voz» y deja la ayuda del contador activada.",
        foot="Hecho por Robert Potau, profesor · Gratuito, sin registro y sin anuncios",
    ),
    "en": dict(
        sub="Maths with euro coins and notes · Age 12-13 and newcomer classes", file="en/jocs/al-mercat-fitxa.pdf",
        what="What it teaches",
        what_p="Addition, subtraction and multiplication with euros, simple decimals (€1.25) and prices per kilo, in a real context: shopping at a market. Students pay by putting coins (1 cent to €2) and notes (€5 to €50) on the counter, and in the change levels they play the shopkeeper and give the coins back to the customer.",
        levels="The 10 levels", th=("Level", "Content", "Example"),
        use="How to use it in class",
        bullets=[
            "Open <b>robertpotau.github.io/games/al-mercat/</b> on a computer, tablet or phone. Nothing to install and no sign-up.",
            "Each student creates a profile (name, avatar) and picks a language: <b>Catalan, Spanish or icons only + voice</b> (the task is read aloud).",
            "Levels can be chosen freely; the “Daily challenge” mixes purchases from different levels. The helper counter is automatic on levels 1-4 (change it in the settings cog).",
            "<b>Teacher panel:</b> 5 quick clicks on the “Al Mercat!” title. It shows each student's progress, lets you change the purchases per game and exports the data to CSV.",
            "Progress is stored in the device's browser; no data leaves the computer.",
        ],
        note="Tip: for students who have just arrived, start at level 1 in “Icons only + voice” mode and keep the helper counter on.",
        foot="Made by Robert Potau, teacher · Free, no sign-up, no ads",
    ),
}
# Els textos dels nivells de l'anglès no existeixen al joc: s'usen els de castellà com a base traduïda a mà.
EN_LV = [
    ("A euro each", "Buy 2 to 5 identical products and pay with €1 and €2 coins.", "Multiplying is adding many times: 5 × €1 = €5.", "5 apples · €1 each = 5 €"),
    ("Whole prices", "Buy products up to €10 and pay with coins and notes.", "Multiplying with bigger prices: 3 × €2 = €6.", "3 milks · €2 each = 6 €"),
    ("The shopping list", "Type the total of a list of 2 or 3 products, then pay.", "Adding prices and multiplying: 2 × €1 + 1 × €2 = €4.", "2 × 1 € + 1 × 2 € = 4 €"),
    ("Half a euro", "Prices with half euros (€0.50, €1.50…). Type the total and pay with 50-cent coins.", "Easy decimals: 3 × €1.50 = €4.50.", "3 biscuits · 1,50 € = 4,50 €"),
    ("Cents", "Prices like €1.25 or €0.75. Type the total and pay with cent coins.", "Adding and multiplying with cents: 3 × €0.75 = €2.25.", "3 apples · 0,75 € = 2,25 €"),
    ("Change", "You are the shopkeeper! The customer pays with a note: give the change in coins.", "Subtracting: €5 - €3.50 = €1.50.", "Total 3,50 € · pays 5 € → change 1,50 €"),
    ("Buy and change", "Work out the total of a purchase, then give the customer their change.", "Adding, multiplying and subtracting, all together.", "Total 6,75 € · pays 10 € → change 3,25 €"),
    ("Price per kilo", "Buy products by weight (1, 2 or 3 kg). Type the total and pay.", "Price per kilo: 2 kg × €3 = €6.", "2 kg apples · 3 €/kg = 6 €"),
    ("Half a kilo", "Weigh half a kilo or a kilo and a half. Type the total and pay.", "Half a kilo is half the price.", "0,5 kg · 3 €/kg = 1,50 €"),
    ("Quarter kilos", "Weigh 250 g or 750 g. Type the total and pay.", "250 g is a quarter of a kilo: the price ÷ 4.", "250 g · 4 €/kg = 1 €"),
]

def clean(s):
    return re.sub(r"</?strong>", lambda m: "<b>" if m.group(0) == "<strong>" else "</b>", s)

ss = getSampleStyleSheet()
st_title = ParagraphStyle("t", parent=ss["Title"], fontName="Helvetica-Bold", fontSize=30, textColor=ORANGE, alignment=0, spaceAfter=2, leading=34)
st_sub = ParagraphStyle("s", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=11.5, textColor=MUTED, spaceAfter=8)
st_h2 = ParagraphStyle("h2", parent=ss["Heading2"], fontName="Helvetica-Bold", fontSize=13.5, textColor=ORANGE, spaceBefore=10, spaceAfter=5)
st_body = ParagraphStyle("b", parent=ss["Normal"], fontName="Helvetica", fontSize=10, leading=14, textColor=INK, spaceAfter=6)
st_cell = ParagraphStyle("c", parent=st_body, fontSize=8.6, leading=11, spaceAfter=0)
st_cellb = ParagraphStyle("cb", parent=st_cell, fontName="Helvetica-Bold")
st_bul = ParagraphStyle("bu", parent=st_body, leftIndent=12, bulletIndent=0, spaceAfter=3)
st_note = ParagraphStyle("n", parent=st_body, fontName="Helvetica-Oblique", textColor=MUTED, backColor=LIGHT, borderPadding=6, spaceBefore=8)
st_foot = ParagraphStyle("f", parent=st_body, fontSize=8.5, textColor=MUTED, alignment=1, spaceBefore=10)

for lang, T in TXT.items():
    path = os.path.join(ROOT, T["file"])
    os.makedirs(os.path.dirname(path), exist_ok=True)
    doc = SimpleDocTemplate(path, pagesize=A4, topMargin=16*mm, bottomMargin=14*mm, leftMargin=18*mm, rightMargin=18*mm,
                            title="Al Mercat! — " + T["sub"], author="Robert Potau")
    S = []
    S.append(Paragraph("Al Mercat!", st_title))
    S.append(Paragraph(T["sub"], st_sub))
    S.append(Image(SHOT, width=120*mm, height=75*mm, hAlign="LEFT"))
    S.append(Paragraph(T["what"], st_h2))
    S.append(Paragraph(T["what_p"], st_body))
    S.append(Paragraph(T["levels"], st_h2))
    rows = [[Paragraph("<b>%s</b>" % h, st_cell) for h in T["th"]]]
    for i in range(10):
        if lang == "en":
            n, do, le, e = EN_LV[i]
            lbl = ("What you do", "What you learn")
        else:
            lv = I18N[lang]["lv"][i]
            n, do, le, e = lv["t"], LVX[lang][i]["do"], LVX[lang][i]["learn"], clean(lv["e"])
            lbl = ("Què faràs", "Què aprens") if lang == "ca" else ("Qué harás", "Qué aprendes")
        d = "<b>%s:</b> %s<br/><b>%s:</b> %s" % (lbl[0], do, lbl[1], le)
        rows.append([Paragraph("%d. %s" % (i + 1, n), st_cellb), Paragraph(d, st_cell), Paragraph(e, st_cell)])
    tb = Table(rows, colWidths=[34*mm, 88*mm, 52*mm], repeatRows=1)
    tb.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LINE), ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT, colors.white]),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    S.append(tb)
    S.append(Paragraph(T["use"], st_h2))
    for b in T["bullets"]:
        S.append(Paragraph(b, st_bul, bulletText="•"))
    S.append(Paragraph(T["note"], st_note))
    S.append(Paragraph("%s · v%s (%s) · robertpotau.github.io" % (T["foot"], D["VERSION"], D["VERSION_DATE"]), st_foot))
    doc.build(S)
    print("saved", path)
