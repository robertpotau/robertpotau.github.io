# -*- coding: utf-8 -*-
"""Generate sitemap.xml from the actual page inventory. Re-run + commit after
adding a game or a page. lastmod = today (deploy date)."""
import datetime, io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://robertpotau.github.io"
TODAY = datetime.date.today().isoformat()

GAME_ENTRIES = {  # slug -> playable entry file
    "calcuherois": "CalcuHerois.html", "fraccions": "fraccions.html",
    "geometria": "index.html", "quina-hora-es": "index.html",
    "lletra-a-lletra": "index.html", "ortografia": "index.html",
    "aula-acollida": "index.html", "vistes": "index.html",
    "what-time-is-it": "index.html", "verbs-english": "index.html",
}

urls = [("/", 1.0), ("/classic.html", 0.5), ("/es/", 0.9), ("/en/", 0.9)]
for prefix in ("", "/es", "/en"):
    urls.append((f"{prefix}/jocs/index.html", 0.9))
    urls += [(f"{prefix}/jocs/{slug}.html", 0.8) for slug in GAME_ENTRIES]
urls += [(f"/games/{slug}/{entry}", 0.8) for slug, entry in GAME_ENTRIES.items()]

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path, prio in urls:
    out += ["  <url>", f"    <loc>{BASE}{path}</loc>", f"    <lastmod>{TODAY}</lastmod>",
            "    <changefreq>monthly</changefreq>", f"    <priority>{prio}</priority>", "  </url>"]
out.append("</urlset>")

with io.open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(out) + "\n")
print(f"sitemap.xml: {len(urls)} URLs")
