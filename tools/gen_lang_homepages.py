# -*- coding: utf-8 -*-
"""Generate pre-rendered /es/index.html and /en/index.html from the root index.html.

SEO Tier C1: Google only indexes server-rendered text, so the JS language
switcher's ES/EN content was invisible to search. This bakes each language in.

How it works: extracts the `translations` object (via Node), then for each
data-i18n element in the SOURCE html replaces its inner text with the target
language string. Also: lang attr, translated title/meta/OG, self-canonical,
hreflang cluster, absolute asset URLs, switcher becomes real links, and the
localStorage JS-swap init is removed (each language is its own page now).

Re-run after ANY edit to index.html (including new i18n keys) — the /es/ and
/en/ files are generated artifacts, never edit them by hand.
"""
import io, json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://robertpotau.github.io"
SRC = os.path.join(ROOT, "index.html")

META = {
    "es": dict(
        title="Robert Potau — Un profesor que hace juegos",
        desc="Un viaje por el instituto donde nacen los juegos: matemáticas, lengua, geometría y más. Juegos educativos gratuitos creados por Robert Potau, profesor de secundaria de Tecnología y Digitalización.",
        og_desc="Un viaje por el instituto donde nacen los juegos: matemáticas, lengua, geometría y más. Juegos educativos gratuitos para el aula.",
        tw_desc="Juegos educativos gratuitos nacidos en el aula. Entra en el instituto.",
    ),
    "en": dict(
        title="Robert Potau — A teacher who makes games",
        desc="A journey through the school where the games are born: maths, language, geometry and more. Free educational games created by Robert Potau, secondary school teacher of Technology.",
        og_desc="A journey through the school where the games are born: maths, language, geometry and more. Free educational games for the classroom.",
        tw_desc="Free educational games born in the classroom. Step into the school.",
    ),
}

HREFLANG = f'''<link rel="alternate" hreflang="ca" href="{BASE}/">
<link rel="alternate" hreflang="es" href="{BASE}/es/">
<link rel="alternate" hreflang="en" href="{BASE}/en/">
<link rel="alternate" hreflang="x-default" href="{BASE}/">'''

# extract translations via node (translations object is JS, not JSON)
node_out = subprocess.run(
    ["node", "-e",
     "const fs=require('fs');const t=fs.readFileSync(process.argv[1],'utf8');"
     "const m=t.match(/const translations = (\\{[\\s\\S]*?\\n\\});/);"
     "process.stdout.write(JSON.stringify(eval('('+m[1]+')')));", SRC],
    capture_output=True, text=True, check=True, encoding="utf-8")
TR = json.loads(node_out.stdout)

with io.open(SRC, encoding="utf-8", newline="") as f:
    src = f.read()

I18N_EL = re.compile(r'(<(\w+)([^>]*\bdata-i18n="([^"]+)"[^>]*)>)([^<]*)(</\2>)')

def absolutize(t, lang):
    # internal links & assets → root-absolute so they work from /es/ and /en/
    t = re.sub(r'((?:href|src)=")(?!https?:|//|mailto:|#|/)', r'\1/', t)
    t = t.replace("url('fonts/", "url('/fonts/")
    # fitxa links point at the same-language fitxes
    t = t.replace('href="/jocs/', f'href="/{lang}/jocs/')
    return t

for lang in ("es", "en"):
    d, meta = TR[lang], META[lang]
    t = src
    missing = []
    def sub(m):
        key = m.group(4)
        if key not in d:
            missing.append(key)
            return m.group(0)
        return m.group(1) + d[key] + m.group(6)
    t = I18N_EL.sub(sub, t)
    if missing:
        raise SystemExit(f"{lang}: missing keys {missing}")
    # count sanity: every data-i18n occurrence should have been matched
    unmatched = len(re.findall(r'data-i18n="', t)) - len(I18N_EL.findall(t))
    if unmatched:
        raise SystemExit(f"{lang}: {unmatched} data-i18n elements not plain-text — extend the generator")

    t = t.replace('<html lang="ca">', f'<html lang="{lang}">')
    t = re.sub(r'<title>[^<]*</title>', f'<title>{meta["title"]}</title>', t)
    t = re.sub(r'(<meta name="description" content=")[^"]*(">)', r'\1' + meta["desc"] + r'\2', t)
    t = re.sub(r'(<link rel="canonical" href=")[^"]*(">)', r'\1' + f"{BASE}/{lang}/" + r'\2', t)
    t = re.sub(r'(<meta property="og:title" content=")[^"]*(">)', r'\1' + meta["title"] + r'\2', t)
    t = re.sub(r'(<meta property="og:description" content=")[^"]*(">)', r'\1' + meta["og_desc"] + r'\2', t)
    t = re.sub(r'(<meta property="og:url" content=")[^"]*(">)', r'\1' + f"{BASE}/{lang}/" + r'\2', t)
    t = re.sub(r'(<meta name="twitter:title" content=")[^"]*(">)', r'\1' + meta["title"] + r'\2', t)
    t = re.sub(r'(<meta name="twitter:description" content=")[^"]*(">)', r'\1' + meta["tw_desc"] + r'\2', t)
    t = absolutize(t, lang)

    # language switcher → real links (this page IS the language)
    switch = (
        '<div class="lang-switch">\n'
        + "\n".join(
            f'    <a href="{url}"><button data-lang="{l}"{" class=\"active\"" if l == lang else ""}>{l.upper()}</button></a>'
            for l, url in (("ca", "/?lang=ca"), ("es", "/es/"), ("en", "/en/"))
        )
        + "\n  </div>"
    )
    t = re.sub(r'<div class="lang-switch">.*?</div>', switch, t, count=1, flags=re.S)
    # neutralize the whole switcher JS block: this page IS its language, the
    # switcher is plain links, and the root page's storedLang redirect must not run here
    t = re.sub(
        r"/\* ES/EN live on pre-rendered pages.*?applyLang\('ca'\);\n\}",
        "/* pre-rendered page: language fixed, switcher is plain links */\n"
        f"localStorage.setItem('landing_lang', '{lang}');",
        t, count=1, flags=re.S)
    if "pre-rendered page: language fixed" not in t:
        raise SystemExit(f"{lang}: switcher JS block not found — generator out of sync with index.html")

    out_dir = os.path.join(ROOT, lang)
    os.makedirs(out_dir, exist_ok=True)
    with io.open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8", newline="") as f:
        f.write(t)
    print(f"ok {lang}/index.html")

# hreflang cluster into the ROOT page (idempotent)
with io.open(SRC, encoding="utf-8", newline="") as f:
    root = f.read()
if 'hreflang="es"' not in root:
    root = root.replace('<link rel="canonical" href="https://robertpotau.github.io/">',
                        '<link rel="canonical" href="https://robertpotau.github.io/">\n' + HREFLANG)
    with io.open(SRC, "w", encoding="utf-8", newline="") as f:
        f.write(root)
    print("root: hreflang cluster added")
else:
    print("root: hreflang already present")
