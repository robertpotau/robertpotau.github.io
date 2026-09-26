# -*- coding: utf-8 -*-
"""Aplica el sistema responsive "fit" (el d'Al Mercat!) a un joc d'un sol HTML.

1) Converteix les mides `px` de tots els <style> a `rem` (menys les condicions de @media,
   @font-face i el contingut de url(...)), i les de style="..." del HTML estàtic.
2) Injecta un petit script que posa la mida base (html font-size) al màxim factor f (1..FMAX) tal que
   la pàgina càpiga sense scroll i f <= innerWidth/W0. Al mòbil f = 1 (res no canvia). f només baixa dins
   d'una pantalla i es reinicia quan canvia de pantalla (classe/display) o de mida de finestra.

Ús:  python apply_responsive_fit.py <fitxer.html> <W0> [<H0 ignorat>] [--dry]
És idempotent: si el fitxer ja porta la marca RESPONSIVE-FIT no fa res.
"""
import io, re, sys, os, shutil, datetime

MARK = "RESPONSIVE-FIT v2"
FMAX = 1.6

def px2rem(m):
    v = float(m.group(1))
    if v == 0:
        return m.group(0)
    s = ("%.4f" % (v / 16)).rstrip("0").rstrip(".")
    return s + "rem"

PX = re.compile(r"(?<![\w.#-])(-?\d*\.?\d+)px\b")
URLPART = re.compile(r"(url\([^)]*\))", re.I)

def conv_decl(text):
    """converteix px->rem fora de url(...)"""
    parts = URLPART.split(text)
    for i in range(0, len(parts), 2):
        parts[i] = PX.sub(px2rem, parts[i])
    return "".join(parts)

def conv_css(css):
    out = []
    for line in css.split("\n"):
        s = line.lstrip()
        if s.startswith("@font-face") or s.startswith("@import"):
            out.append(line)
        elif s.startswith("@media") or s.startswith("@supports") or s.startswith("@container"):
            k = line.find("{")
            out.append(line if k < 0 else line[: k + 1] + conv_decl(line[k + 1 :]))
        else:
            out.append(conv_decl(line))
    return "\n".join(out)

def conv_html_styles(html):
    """style="...px" dels fragments HTML fora de <script> i <style>"""
    segs = re.split(r"(<script\b.*?</script>|<style\b.*?</style>)", html, flags=re.S | re.I)
    for i in range(0, len(segs), 2):
        segs[i] = re.sub(r'(style\s*=\s*")([^"]*)(")', lambda m: m.group(1) + conv_decl(m.group(2)) + m.group(3), segs[i])
    return "".join(segs)

def build_script(w0, h0):
    js = r"""(function(){
var FM=%(FM)s,W0=%(W0)d,r=document.documentElement,cap=FM,tm=null,seen=new WeakMap();
function fits(f){r.style.fontSize=(16*f)+'px';return r.scrollHeight<=window.innerHeight+3&&r.scrollWidth<=window.innerWidth+3;}
function fit(reset){
  if(reset)cap=FM;
  var top=Math.max(1,Math.min(cap,window.innerWidth/W0));
  if(top<=1.001){r.style.fontSize='16px';cap=1;return;}
  var lo=1,hi=top;
  if(fits(hi)){lo=hi;}else{for(var i=0;i<6;i++){var mid=(lo+hi)/2;if(fits(mid))lo=mid;else hi=mid;}}
  r.style.fontSize=(16*lo)+'px';cap=lo;
}
function sched(reset){clearTimeout(tm);tm=setTimeout(function(){fit(reset);},110);}
var SCR=/screen|page|view|scene|panel|modal|overlay|menu|game|home|splash|app/i;
new MutationObserver(function(ms){
  var reset=false;
  for(var i=0;i<ms.length&&!reset;i++){
    var e=ms[i].target;if(e.nodeType!==1||e===r)continue;
    if(e.parentElement!==document.body&&!SCR.test((e.id||'')+' '+(typeof e.className==='string'?e.className:'')))continue;
    var k=(typeof e.className==='string'?e.className:'')+'|'+e.style.display+'|'+e.hidden;
    if(seen.get(e)!==k){seen.set(e,k);reset=true;}
  }
  if(reset)sched(true);
}).observe(document.body,{attributes:true,attributeFilter:['class','style','hidden'],subtree:true,childList:false});
window.addEventListener('resize',function(){sched(true);});
window.addEventListener('orientationchange',function(){sched(true);});
window.addEventListener('load',function(){sched(true);[1500,4700,6500].forEach(function(t){setTimeout(function(){sched(true);},t);});});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){sched(true);});
fit(true);
})();""" % {"FM": FMAX, "W0": w0}
    return "<script>/* " + MARK + ": mida base (rem) adaptada a la pantalla; mòbil = 1 */" + chr(10) + js + "</script>" + chr(10)

def main():
    path, w0 = sys.argv[1], int(sys.argv[2]); h0 = 0
    dry = "--dry" in sys.argv
    with io.open(path, encoding="utf-8", newline="") as f:
        src = f.read()
    if MARK in src:
        print("ja aplicat:", path); return
    nl = "\r\n" if "\r\n" in src else "\n"
    html = src.replace("\r\n", "\n")
    before = len(PX.findall(html))
    html = re.sub(r"(<style\b[^>]*>)(.*?)(</style>)", lambda m: m.group(1) + conv_css(m.group(2)) + m.group(3), html, flags=re.S | re.I)
    html = conv_html_styles(html)
    if "</body>" not in html:
        raise SystemExit("no </body>")
    i = html.rindex("</body>")
    html = html[:i] + build_script(w0, h0) + html[i:]
    after = len(PX.findall(html))
    print("%s: px abans=%d despres=%d (la resta són a JS/media)" % (os.path.basename(path), before, after))
    if dry:
        return
    d = os.path.join(os.path.dirname(path), "backups"); os.makedirs(d, exist_ok=True)
    b = os.path.join(d, "%s_backup_%s_pre-fit.html" % (os.path.splitext(os.path.basename(path))[0], datetime.date.today().isoformat()))
    shutil.copy(path, b)
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(html.replace("\n", nl))

if __name__ == "__main__":
    main()
