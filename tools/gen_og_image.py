from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

top = (204, 146, 252)   # #cc92fc
bottom = (119, 16, 209) # #7710d1

img = Image.new("RGB", (W, H), top)
draw = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    color = lerp(top, bottom, t)
    draw.line([(0, y), (W, y)], fill=color)

def load_font(size, bold=True):
    candidates = [
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
    ]
    for c in candidates:
        try:
            return ImageFont.truetype(c, size)
        except Exception:
            continue
    return ImageFont.load_default()

title_font = load_font(72, True)
tagline_font = load_font(34, False)
badge_font = load_font(28, True)

# Avatar circle
cx, cy, r = 150, 150, 70
draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(154,50,239), outline=(255,255,255,220), width=5)
emoji_font = load_font(58, True)
draw.text((cx, cy+4), "RP", font=emoji_font, fill="white", anchor="mm")

draw.text((280, 110), "Robert Potau", font=title_font, fill="white", anchor="lm")
draw.text((280, 195), "Jocs educatius a mida per a l'aula", font=tagline_font, fill=(255,255,255,230), anchor="lm")

# Subject badges row
badges = ["Matemàtiques", "Llengua", "Geometria", "Acollida", "Anglès"]
bx = 90
by = 470
for b in badges:
    tw = draw.textlength(b, font=badge_font)
    pad = 24
    bw = tw + pad*2
    bh = 58
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=29, fill=(255,255,255,235))
    draw.text((bx+pad, by+bh/2), b, font=badge_font, fill=(110,37,170), anchor="lm")
    bx += bw + 18

draw.text((90, 560), "robertpotau.github.io", font=load_font(26, False), fill=(255,255,255,220), anchor="lm")

img.save(r"C:\Users\PC\Documents\MEGA\Claude code\claude-projects\landing-page\og-image.png")
print("saved")
