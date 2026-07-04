# Landing page — Robert Potau

Live at **https://robertpotau.github.io/**, served by GitHub Pages from the `main` branch of the public repo `robertpotau/robertpotau.github.io` (this folder).

## Architecture

- `index.html` — the landing page itself (bio + game gallery). Styled after `claude-projects/GAMES-TEMPLATE` (Nunito font, orange palette, chunky rounded cards).
- `fonts/` — copy of the Nunito font used by the template/games.
- `games/<slug>/` — **playable copies** of each featured game's static files (HTML/CSS/JS/assets only — no `.git`, no `apk/` Android wrapper, no `backups/`, no `.py`/`.md` docs, no PDFs).

## Why copies instead of linking to the source repos

Each game also lives in its own **private** repo under `github.com/robertpotau/<slug>` (source of truth, full history, backups, dev docs). GitHub Pages needs a **public** repo to serve pages for free, so instead of making the source repos public, static playable copies are duplicated into `games/<slug>/` inside this public repo. The private repos are untouched by this — they keep the real history, backups, and any WIP files that shouldn't be public yet.

## Featured games (as of 2026-07-04)

| slug | entry file (relative to `games/<slug>/`) | source repo |
|---|---|---|
| calcuherois | `CalcuHerois.html` | `robertpotau/calcuherois` |
| aula-acollida | `index.html` | `robertpotau/aula-acollida` |
| fraccions | `fraccions.html` | `robertpotau/fraccions` |
| lletra-a-lletra | `index.html` | `robertpotau/lletra-a-lletra` |
| ortografia | `index.html` | `robertpotau/ortografia` |
| vistes | `index.html` | `robertpotau/vistes` |
| geometria | `index.html` | `robertpotau/geometria` |
| quina-hora-es | `index.html` | `robertpotau/quina-hora-es` |
| what-time-is-it | `index.html` | `robertpotau/what-time-is-it` |

All source repos live at `C:\Users\PC\Documents\MEGA\Claude code\claude-projects\<slug>` locally.

## When Robert updates one of these games

**Trigger:** any edit to a file inside `claude-projects/<slug>/` for a game listed above.

**What to do**, without being asked, once the edit is confirmed working:
1. Commit + push the change in the game's own private repo (`claude-projects/<slug>`) as usual.
2. Run the sync script for that one game to refresh its copy in the landing page and publish:
   ```powershell
   C:\Users\PC\Documents\MEGA\Claude code\claude-projects\landing-page\sync-game.ps1 -Slug <slug>
   ```
   This re-copies the game's static files into `landing-page/games/<slug>/`, commits, and pushes `robertpotau/robertpotau.github.io` — which republishes the live site automatically (GitHub Pages rebuilds on push, usually live within ~1 minute).
3. Tell Robert the live page has been updated, with the URL.

To sync **all** featured games at once (e.g. after a batch of changes), run the script with no `-Slug`:
```powershell
C:\Users\PC\Documents\MEGA\Claude code\claude-projects\landing-page\sync-game.ps1
```

## Adding a new game to the landing page

1. Add a new `<div class="game-card">` block in `index.html` (copy an existing card, change icon/subject/title/description/link).
2. Add the slug + entry file to both the table above and the `$games` map at the top of `sync-game.ps1`.
3. Run `sync-game.ps1 -Slug <newslug>` to copy its files in and publish.
4. If the game doesn't yet have its own private GitHub repo, create one first (`gh repo create robertpotau/<slug> --private --source=. --remote=origin`, push).

## Known limitation: progress doesn't sync across devices

All 6 games with save state (calcuherois, fraccions, geometria, aula-acollida, ortografia — via `localStorage`) keep progress only in the student's current browser. No backend exists yet. A future-upgrade proposal (Supabase/Firebase sync layer, class-code based identification, no fix needed now) is written up in `claude-projects/IDEAS.md` under "Cross-device progress sync for student games" — read that before starting any related work.

## Git identity note

Use `Robert Potau` / `robertpotau@gmail.com` for all git commits in these repos (work identity). Never use the `salemlayonn@gmail.com` address — that's Robert's private email.

## v2: immersive "living school" page (2026-07-05)

`index.html` was rebuilt as a scroll-driven, emotion-first storytelling experience using **Three.js (WebGL)**. The previous commercial page is fully preserved:
- **`classic.html`** — the v1 page, still live at https://robertpotau.github.io/classic.html and linked from the v2 footer
- git tag **`v1-classic`** marks the last commit of v1
- local folder backup at `claude-projects/landing-page-backup-v1-20260705/`

### How v2 works

One HTML file, no build step. Three.js `0.160.0` UMD from unpkg (**pin this version** — r161+ dropped the UMD build so a version bump would silently break the `<script src>` include; there's a harmless deprecation warning in console).

- **Story structure**: 10 `<section class="beat" data-beat="0..9">` narrative beats — hero (who Robert is) → the problem (students switching off) → the spark ("what if class were the place everyone wants to play?") → 5 "classrooms" (Matemàtiques, Llengua, Acollida, Taller/Tecnologia, English), each with its game cards → support beat (Ko-fi, emotional core: "fets als vespres, gratuïts, cada cafè és una hora més") → custom-games/contact beat.
- **3D scene**: fixed full-screen canvas behind the DOM (z-index 0 vs 10). A camera travels down a long z-axis "hallway" (one zone per beat, 70 units apart, `START_Z` 18). Each zone has themed floating objects: emoji/text sprites via canvas textures (numbers/operators, letters, hearts/coffee), a partial-circle "fraction pizza" mesh, colored book boxes, **wireframe solids** (EdgesGeometry — the vistes nod), and an animated clock with rotating hands. Global chalk-dust `Points` + soft glow sprites span the whole depth. Fog + clear-color lerp between per-zone palette colors.
- **Scroll sync (important)**: camera position is NOT a linear function of scroll — DOM sections have different heights, so `beatProgress()` maps the viewport center against the real measured centers of each `.beat` element (`measureBeats()`, recomputed on resize/load) and interpolates a fractional beat index. Camera z, sway, and atmosphere color all derive from that. If beats are added/removed, keep `BEATS`, the `zoneColors` array, and the object-placement `place(obj, beat, ...)` calls consistent.
- **Reveals**: IntersectionObserver adds `.in` to each beat; `.reveal`/`.d1/.d2/.d3` children stagger in with big translate+scale transitions.
- **i18n**: same `data-i18n` + `translations` object pattern as v1 (CA/ES/EN, saved in `localStorage.landing_lang`). All narrative copy is in all three languages — keep them in sync when editing.
- **Degradations**: `prefers-reduced-motion` skips bobbing/eases instantly; CDN load failure or WebGL init failure adds `body.no3d` (static gradient background, all content still readable); rAF loop pauses when tab hidden.
- **Debug handle**: `window.__rp = { camera, scene, renderer, step }` — `step(true)` forces one frame with instant camera easing. Used for headless verification (`scratchpad`-style script in `tools/` not needed; see below) and handy for future tweaking.

**Verification quirk worth remembering**: in a *hidden/backgrounded* automated tab, CSS transitions freeze and `scroll-behavior: smooth` never completes, so the page looks broken in screenshots even though it's fine — verify with headless Playwright (visible-rendering) instead, scrolling each `[data-beat]` into center view and waiting ~2.5s.

## Commercial upgrade — v1, now classic.html (2026-07-04/05)

Robert asked for a more "commercial" turn plus a batch of professional-polish items. What's in place now:

- **Palette**: switched from orange to blue/violet (source: icolorpalette.com/p/415101). Games grouped into 5 subject categories (Matemàtiques, Llengua catalana, Acollida, Tecnologia i dibuix, Anglès).
- **Grade/age tags**: each card now shows a subject tag + a grade-level tag (e.g. "Primària 3r-6è") so a school can judge fit at a glance.
- **Real screenshots**: each card shows an actual in-game screenshot (`screenshots/<slug>.jpg`), captured headlessly with Playwright. Regenerate with `tools/capture_screenshots.py` (`py -m pip install playwright && py -m playwright install chromium` once, then run the script) whenever a game's visuals change meaningfully. `sync-game.ps1` does **not** auto-recapture screenshots — do that manually/separately.
- **Favicon + OG/social preview**: `favicon.svg` (simple "RP" monogram) and `og-image.png` (1200x630, regenerate with `tools/gen_og_image.py`, needs `pip install Pillow`). Wired up via `<link rel="icon">` and `og:*`/`twitter:*` meta tags in `index.html`.
- **Trilingual (CA/ES/EN)**: a small `translations` object + `data-i18n` attributes in `index.html`, toggled by buttons top-right, preference saved in `localStorage`. Default is Catalan. When adding new copy to the page, add a `data-i18n="key"` span/attr and a matching entry in all three language blocks in the inline `<script>` — don't leave any of the 3 incomplete.
- **Custom-game commercial framing**: hero copy now mentions custom games; a 4-step "how it works" process section (Contacte → Definim l'abast → Prototip → Lliurament); a CTA card linking `mailto:robertpotau@gmail.com`.
- **Ko-fi**: `https://ko-fi.com/robertpotau` linked in a dedicated support card.
- **Future paid-tier framing**: a badge note states today's games are free/open demos, with paid full/extended versions possible later for schools — an explicit, deliberate framing decision, not a half-built paywall.
- **Privacy note**: states plainly that no game sends data anywhere; progress is `localStorage`-only (ties into the known cross-device limitation documented in `IDEAS.md`).
- **APK-on-request note**: every card says an Android APK can be provided on request (not hosted publicly in this repo — see below).
- **One-page PDF portfolio**: `robert-potau-portfolio.pdf`, linked from the custom-game CTA card. Regenerate with `tools/gen_portfolio_pdf.py` (needs `pip install reportlab`) if the games list or bio changes.
- **Analytics**: not active yet — needs Robert to manually create a free account (Plausible or GoatCounter; account creation can't be done on his behalf). The ready-to-uncomment `<script>` snippet and instructions are in an HTML comment near the top of `index.html`.

### APK build environment (set up 2026-07-04)

To build Android APKs for games that don't have one yet, this machine now has:
- **Node.js** (via winget, `OpenJS.NodeJS.LTS`)
- **Android SDK** command-line tools at `C:\Android\sdk` (`cmdline-tools\latest`, `platform-tools`, `platforms;android-34`, `build-tools;34.0.0`), licenses pre-accepted via hash files in `C:\Android\sdk\licenses\`
- **`ANDROID_HOME`** and **`ANDROID_SDK_ROOT`** set to `C:\Android\sdk` (User env vars), `platform-tools` added to `PATH`
- **JDK**: use `C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot` as `JAVA_HOME` for Gradle builds (there's also a JDK 23 on this machine that also seems to work, but 21 is the tested one)

Of the 9 featured games: **calcuherois** has its APK in the separate `CalcuHerois-android` project folder; **aula-acollida, fraccions, lletra-a-lletra, ortografia, quina-hora-es, what-time-is-it** already had one under `<slug>/apk/android/app/build/outputs/apk/debug/app-debug.apk`; **geometria** and **vistes** did not and were being wrapped with Capacitor (see `fraccions/apk/BUILD.md` for the exact pattern to replicate: `package.json` with `@capacitor/{core,cli,android}`, `capacitor.config.json` with `appId: cat.jocs.<slug>`, `www/index.html`, then `npm install && npx cap add android && npx cap sync android && cd android && gradlew.bat assembleDebug`).

**APK files are never committed into this public landing-page repo** — they're only ever built inside the private per-game repos (`claude-projects/<slug>/apk/`) and handed over directly if/when a school actually requests one.
