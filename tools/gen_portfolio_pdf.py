from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER

PRIMARY = colors.HexColor("#7710d1")
PRIMARY_LIGHT = colors.HexColor("#f3e8ff")
TEXT_MUTED = colors.HexColor("#5b4a70")

styles = getSampleStyleSheet()
title_style = ParagraphStyle('title2', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=28, textColor=PRIMARY, spaceAfter=2)
tagline_style = ParagraphStyle('tagline', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=13, textColor=TEXT_MUTED, spaceAfter=10)
body_style = ParagraphStyle('body2', parent=styles['Normal'], fontName='Helvetica', fontSize=10.5, leading=15, textColor=colors.HexColor("#241433"), spaceAfter=10)
h2_style = ParagraphStyle('h2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14, textColor=PRIMARY, spaceBefore=14, spaceAfter=6)
game_title_style = ParagraphStyle('gt', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, textColor=colors.HexColor("#241433"))
game_desc_style = ParagraphStyle('gd', parent=styles['Normal'], fontName='Helvetica', fontSize=9, textColor=TEXT_MUTED, leading=12)
game_grade_style = ParagraphStyle('gg', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=8.5, textColor=PRIMARY)
contact_style = ParagraphStyle('contact', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, textColor=colors.white, alignment=TA_CENTER)

games = [
    ("CalcuHerois", "Càlcul mental gamificat amb missions i herois.", "Primària 3r-6è"),
    ("Fraccions", "Set maneres de treballar el concepte de fracció.", "Primària 4t-6è"),
    ("Geometria", "Repàs interactiu de figures geomètriques.", "Primària 5è - ESO 2n"),
    ("Quina hora és", "Lectura de l'hora amb el sistema de quarts.", "Primària 1r-3r"),
    ("Lletra a lletra", "Lectoescriptura: síl·labes, associació i lectura.", "Infantil P5 - Primària 2n"),
    ("Ortografia", "Deu blocs temàtics d'ortografia catalana.", "Primària 3r-6è"),
    ("Aula d'Acollida", "Vocabulari i jocs per a alumnat nouvingut.", "Tots els nivells"),
    ("Vistes", "Projeccions geomètriques: alçat, planta, perfil.", "ESO 3r-4t / Batxillerat"),
    ("What time is it", "Telling the time in English.", "Primària 2n-4t"),
]

doc = SimpleDocTemplate(
    r"C:\Users\PC\Documents\claude-code-pcsobretaula\claude-projects\landing-page\robert-potau-portfolio.pdf",
    pagesize=A4,
    topMargin=22*mm, bottomMargin=18*mm, leftMargin=20*mm, rightMargin=20*mm,
)

story = []
story.append(Paragraph("Robert Potau", title_style))
story.append(Paragraph("Professor de secundària · Creador de jocs educatius a mida per a l'aula", tagline_style))
story.append(Paragraph(
    "Sóc professor de secundària de Tecnologia i Digitalització a la Generalitat de Catalunya i des de fa temps dissenyo jocs i eines "
    "interactives per fer les classes més dinàmiques i properes als alumnes. Aquest "
    "portfolio recull una selecció dels jocs que he desenvolupat per treballar "
    "matemàtiques, llengua, geometria i molt més. Si el teu centre o editorial necessita "
    "un joc fet a mida, també puc ajudar-te a crear-lo — des de zero o partint d'algun "
    "dels jocs d'aquí.",
    body_style
))

story.append(Paragraph("Jocs desenvolupats", h2_style))

rows = []
for name, desc, grade in games:
    cell = [
        Paragraph(name, game_title_style),
        Paragraph(desc, game_desc_style),
        Paragraph(grade, game_grade_style),
    ]
    rows.append(cell)

# lay out as 3-column grid, one game per cell (3 rows x 3 cols)
table_data = []
for i in range(0, len(rows), 3):
    table_data.append(rows[i:i+3])
# pad last row
while len(table_data[-1]) < 3:
    table_data[-1].append(Paragraph("", game_desc_style))

t = Table(table_data, colWidths=[52*mm]*3, rowHeights=None)
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), PRIMARY_LIGHT),
    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#e4c9fb")),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e4c9fb")),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
]))
story.append(t)

story.append(Paragraph("Serveis a mida per a centres i editorials", h2_style))
story.append(Paragraph(
    "Disseny i desenvolupament de jocs educatius interactius adaptats al currículum, "
    "idioma o estil visual del teu centre. Procés: contacte → definim l'abast → "
    "prototip jugable → lliurament final (web i/o APK Android).",
    body_style
))

story.append(Spacer(1, 10*mm))

contact_table = Table([[
    Paragraph("✉️ robertpotau@gmail.com&nbsp;&nbsp;&nbsp;&nbsp;🌐 robertpotau.github.io&nbsp;&nbsp;&nbsp;&nbsp;☕ ko-fi.com/robertpotau", contact_style)
]], colWidths=[170*mm])
contact_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
    ('TOPPADDING', (0,0), (-1,-1), 12),
    ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ('ROUNDEDCORNERS', [10,10,10,10]),
]))
story.append(contact_table)

doc.build(story)
print("saved")
