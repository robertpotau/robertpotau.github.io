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
