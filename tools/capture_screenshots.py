import time
import os
from playwright.sync_api import sync_playwright

BASE = r"C:\Users\PC\Documents\MEGA\Claude code\claude-projects\landing-page\games"
OUT = r"C:\Users\PC\Documents\MEGA\Claude code\claude-projects\landing-page\screenshots"
os.makedirs(OUT, exist_ok=True)

# slug -> (entry file relative to games/<slug>/, wait seconds for splash/animations to settle)
targets = {
    "calcuherois": "CalcuHerois.html",
    "aula-acollida": "index.html",
    "fraccions": "fraccions.html",
    "lletra-a-lletra": "index.html",
    "ortografia": "index.html",
    "vistes": "index.html",
    "geometria": "index.html",
    "quina-hora-es": "index.html",
    "what-time-is-it": "index.html",
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 960, "height": 600})
    for slug, entry in targets.items():
        path = os.path.join(BASE, slug, entry)
        url = "file:///" + path.replace("\\", "/")
        print("Capturing", slug, url)
        try:
            page.goto(url, wait_until="load", timeout=15000)
            page.wait_for_timeout(1800)
            page.screenshot(path=os.path.join(OUT, f"{slug}.jpg"), type="jpeg", quality=82)
        except Exception as e:
            print("FAILED", slug, e)
    browser.close()

print("done")
