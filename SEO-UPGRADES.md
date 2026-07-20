# SEO Upgrades — robertpotau.github.io

Audit date: 2026-07-20. Status of each item is tracked here — update this file when an item is done.

## Current state (what's already good)

- `robots.txt` (allow all) + `sitemap.xml` exist and are referenced correctly.
- `index.html` has: title, meta description, full OG + Twitter card tags, correct 1200×630 `og-image.png`, single `<h1>`, semantic `<h2>` structure, `lang="ca"`, lazy-loaded images with alt text.
- All 10 game links are real crawlable `<a href>` — good internal linking.
- GoatCounter script is `async` ✓. `classic.html` has its own title/description ✓.

## Problems found

| # | Problem | Where |
|---|---------|-------|
| P1 | No `<link rel="canonical">` on any page; `classic.html`'s `og:url` points at `/` — duplicate-content signal split between index and classic | index.html, classic.html |
| P2 | No structured data (JSON-LD) anywhere — zero rich-result eligibility | all pages |
| P3 | ES/EN translations are JS-only (`data-i18n` swap). Google indexes the server-rendered Catalan only; Spanish/English searchers never find the site | index.html, classic.html |
| P4 | 9 of 10 game pages have only a `<title>` — no meta description, no OG, no canonical (only aula-acollida has a description) | games/*/ |
| P5 | Sitemap lists only 2 URLs — no game pages, no `<lastmod>` | sitemap.xml |
| P6 | `verbs-english` has `lang="ca"` but is an English-content game | games/verbs-english + canonical repo |
| P7 | `apple-touch-icon` points to SVG (iOS wants PNG); no web app manifest | index.html |
| P8 | Three.js loaded from unpkg CDN (single point of failure; page has a `no3d` fallback but the 3D experience dies if unpkg hiccups). NOT render-blocking (it's at end of body) | index.html:665 |
| P9 | Very little indexable *text* — the story page is beautiful but keyword-thin. Nobody searching "joc de fraccions online gratis" will land here | site-wide |
| P10 | Search Console / Bing Webmaster status unknown — can't verify remotely | external |

## ⚠️ Critical constraint for game-page edits (P4, P6)

`sync-game.ps1` uses `robocopy /MIR` canonical → `landing-page/games/<slug>/`.
**Any tag added only to the landing-page copy gets deleted on the next sync.**
All game-page SEO edits MUST be made in the canonical game file
(`Documents\Claude-Sync\claude-projects\<slug>\`) first, then copied to the
landing-page copy (manual `cp` on this machine; the script's `$src` only exists on the Tower).

## Proposed upgrades

> **Deployed 2026-07-20** — landing-page pushed (commit `55d01ee`) and all 10 private game repos pushed.
> During deploy we discovered the Tower had committed Supabase to the canonical repos (older content
> generation); reconciled by adopting the live landing copies as canonical. Backup branches
> `pre-merge-backup-20260720` left in the 7 affected repos.
> Version bumps done as part of this: aula-acollida → 2.4, lletra-a-lletra → 1.2.

### Tier A — quick technical wins (safe, local, ~no risk) — ✅ DONE 2026-07-20

- [x] **A1. Canonical tags**: added to index.html (→ `/`) and classic.html (→ `/classic.html`); classic's `og:url` now points at itself. *(fixes P1)*
- [x] **A2. JSON-LD on index.html**: `Person` + `WebSite` `@graph` block in `<head>`. *(fixes P2 for the homepage)*
- [x] **A3. Sitemap expansion**: 12 URLs (index, classic, 10 games) + `<lastmod>`. *(fixes P5)*
- [x] **A4. Icons + manifest**: `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` (rasterized from favicon.svg via Playwright — regen script pattern: screenshot the SVG at target viewport), `site.webmanifest`, `theme-color` meta. Wired in both index and classic. *(fixes P7)*
- [x] **A5. Self-host Three.js**: `vendor/three-0.160.0.min.js`, script src updated, `onerror` no3d fallback kept. *(fixes P8)*

### Tier B — game-page SEO — ✅ DONE 2026-07-20 (local, not yet pushed)

- [x] **B1+B2. Per-game meta + `LearningResource` JSON-LD**: all 10 games got keyword-rich `<title>`, meta description, canonical, OG/Twitter tags (og:image = `screenshots/<slug>.jpg`; verbquest.jpg for verbs-english), and a `WebApplication`+`LearningResource` JSON-LD block. verbs-english `lang` fixed ca→en. *(fixes P2, P4, P6)*
  - Applied **identically to BOTH copies** (canonical `claude-projects/<slug>/` AND `landing-page/games/<slug>/`) via Python io.open, preserving BOM/line endings and leaving the landing-only Supabase additions untouched. Script kept at nothing — one-shot; the metadata now lives in the files.
  - Note: verbs-english reports `lang=ca` at runtime because its own settings script sets `document.documentElement.lang` — served HTML is `lang="en"`, which is what matters most; harmless.
  - Verified headless (Playwright): all 10 load, JSON-LD parses, no page errors, UTF-8 intact.

### Tier C — structural / content (bigger wins, bigger effort)

- [ ] **C1. Pre-rendered ES + EN pages** (`/es/`, `/en/`) with `hreflang` cluster. Biggest traffic unlock — makes the Spanish/English content real for Google. Static generation from the existing `translations` object, no build system needed. *(fixes P3)*
- [x] **C2. Per-game "fitxa" pages** — ✅ DONE 2026-07-20. `jocs/<slug>.html` × 10 + hub `jocs/index.html` (outside the robocopy /MIR target). Generated by `tools/gen_fitxes.py` (per-game data lives in its `GAMES` list — edit there and re-run to regenerate; output is committed). Each fitxa: keyword-rich title/meta/canonical/OG, `LearningResource` + `BreadcrumbList` JSON-LD, ~250 words of real Catalan copy, features list, screenshot, Jugar CTA, related-games links, GoatCounter events (`fitxa-<slug>-play`, `hub-fitxa-<slug>`…). Homepage cards gained an "ℹ️ Fitxa del joc" link (i18n key `fitxa` in CA/ES/EN). Sitemap +11 URLs. **When adding a new game: add it to `tools/gen_fitxes.py`, re-run, add sitemap entry, add the card's fitxa link.** *(fixes P9)*
- [ ] **C3. Google Search Console + Bing Webmaster**: verify property, submit sitemap, monitor queries. Needs Robert's account — guided setup. Bing matters extra because ChatGPT/Copilot answers pull from Bing's index. *(fixes P10)*
- [ ] **C4. Custom domain** (optional, ~10-15 €/year, e.g. `robertpotau.cat`): better branding + memorability; `.github.io` subdomains rank fine but a domain survives a platform move. Not urgent.

### Recommended order

A1-A5 together (one session) → B1+B2 (one session, touches 10 canonical repos + sync) → C3 (needs Robert) → C2 → C1 → C4 whenever.

**Publishing note**: nothing gets committed/pushed to the public repo without Robert's OK — a push deploys the live site.
