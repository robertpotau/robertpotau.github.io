# -*- coding: utf-8 -*-
"""QA pass over today's SEO work: link resolution, canonical/hreflang
consistency, duplicate ids, leftover relative URLs on subdirectory pages."""
import io, json, os, re, sys

ROOT = r"C:\Users\Robert\Documents\Claude-Sync\claude-projects\landing-page"
BASE = "https://robertpotau.github.io"

pages = ["index.html", "classic.html", "404.html",
         "es/index.html", "en/index.html"]
for lang_dir in ("jocs", "es/jocs", "en/jocs"):
    d = os.path.join(ROOT, *lang_dir.split("/"))
    pages += [f"{lang_dir}/{f}" for f in sorted(os.listdir(d)) if f.endswith(".html")]

HREF = re.compile(r'(?:href|src)="([^"]+)"')
issues = []

def exists(path_url):
    p = path_url.split("?")[0].split("#")[0]
    if p.endswith("/"):
        p += "index.html"
    return os.path.isfile(os.path.join(ROOT, p.lstrip("/").replace("/", os.sep)))

for page in pages:
    fp = os.path.join(ROOT, page.replace("/", os.sep))
    t = io.open(fp, encoding="utf-8").read()
    depth = page.count("/")
    # 1. every referenced local URL must exist
    for url in HREF.findall(t):
        if url.startswith(("http:", "https:", "//", "mailto:", "#", "data:")):
            continue
        if url.startswith("/"):
            if not exists(url):
                issues.append(f"{page}: broken absolute link {url}")
        else:
            # relative link: resolve against page dir
            base_dir = os.path.dirname(page)
            resolved = os.path.normpath(os.path.join(base_dir, url.split("?")[0].split("#")[0])).replace("\\", "/")
            if resolved.endswith("/"):
                resolved += "index.html"
            if not os.path.isfile(os.path.join(ROOT, resolved.replace("/", os.sep))):
                issues.append(f"{page}: broken relative link {url}")
            if depth > 0 and page != "404.html":
                issues.append(f"{page}: RELATIVE url on subdir page (fragile): {url}")
    # 2. canonical must match the page's own URL
    m = re.search(r'<link rel="canonical" href="([^"]+)"', t)
    if m:
        canon = m.group(1)
        expect_paths = {f"{BASE}/{page}"}
        if page.endswith("index.html"):
            expect_paths.add(f"{BASE}/{page[:-len('index.html')]}")
        if canon not in expect_paths:
            issues.append(f"{page}: canonical mismatch {canon}")
    elif page != "404.html":
        issues.append(f"{page}: NO canonical")
    # 3. hreflang targets must exist as files
    for hl, url in re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', t):
        path = url[len(BASE):] if url.startswith(BASE) else url
        if not exists(path):
            issues.append(f"{page}: hreflang {hl} target missing {url}")
    # 4. JSON-LD parse
    for ld in re.findall(r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>', t, re.S):
        try:
            json.loads(ld)
        except Exception as e:
            issues.append(f"{page}: invalid JSON-LD ({e})")
    # 5. og:url should equal canonical
    mo = re.search(r'<meta property="og:url" content="([^"]+)"', t)
    if m and mo and mo.group(1) != m.group(1):
        issues.append(f"{page}: og:url {mo.group(1)} != canonical {m.group(1)}")
    # 6. lang attribute sanity
    ml = re.search(r'<html lang="([a-z]+)">', t)
    want = "es" if page.startswith("es/") else "en" if page.startswith("en/") else "ca"
    if ml and page not in ("404.html",) and ml.group(1) != want:
        issues.append(f"{page}: lang={ml.group(1)} expected {want}")

print(f"checked {len(pages)} pages")
if issues:
    for i in issues:
        print("ISSUE:", i)
    sys.exit(1)
print("NO ISSUES")
