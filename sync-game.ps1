<#
.SYNOPSIS
  Refreshes the playable copy of one (or all) featured game(s) inside this
  landing-page repo, then commits and pushes so GitHub Pages republishes.

.DESCRIPTION
  The source root is derived from this script's own location: the landing-page
  repo lives inside claude-projects, so the parent folder IS the source root.
  That keeps the script portable between the mini PC (user "Robert") and the
  Tower (user "PC") without any hard-coded home directory.

.PARAMETER Slug
  Folder name of the game under claude-projects/<slug> and games/<slug>.
  Omit to sync every game listed below.

.PARAMETER NoPush
  Stage and commit, but do not push. Useful for reviewing before publishing.

.EXAMPLE
  .\sync-game.ps1 -Slug fraccions
  .\sync-game.ps1
  .\sync-game.ps1 -Slug fraccions -NoPush
#>
param(
  [string]$Slug,
  [switch]$NoPush
)

$ErrorActionPreference = "Stop"

$here = $PSScriptRoot
$src  = Split-Path -Parent $here

if (-not (Test-Path -LiteralPath $src)) {
  Write-Error "Source root not found: $src"
}
Write-Output "Source root: $src"

$games = @("calcuherois","aula-acollida","fraccions","lletra-a-lletra","ortografia","vistes","geometria","quina-hora-es","what-time-is-it","verbs-english","euroexplora")

if ($Slug) {
  if ($games -notcontains $Slug) {
    Write-Error "Unknown slug '$Slug'. Known games: $($games -join ', ')"
  }
  $targets = @($Slug)
} else {
  $targets = $games
}

# Verify every source folder exists BEFORE copying anything: robocopy /MIR
# against a missing source would empty the published copy.
$missing = @()
foreach ($g in $targets) {
  if (-not (Test-Path -LiteralPath (Join-Path $src $g))) { $missing += $g }
}
if ($missing.Count -gt 0) {
  Write-Error "Source folder(s) not found under ${src}: $($missing -join ', '). Nothing was copied."
}

foreach ($g in $targets) {
  $dest = Join-Path $here "games\$g"
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Write-Output "Syncing $g ..."
  robocopy "$src\$g" "$dest" /E /MIR `
    /XD .git apk backups pdf `
    /XF *.py *.md *.pdf *.bak* *_backup_* server.log *.txt review_svgs.html revisio_icones.html figures_revision*.html descarrega_landmarks.html manifest.json .gitignore `
    /NFL /NDL /NJH | Out-Null
  # robocopy: 0-7 = success (0 = nothing to do), 8+ = real failure
  if ($LASTEXITCODE -ge 8) {
    Write-Error "robocopy failed for '$g' with exit code $LASTEXITCODE"
  }
}

Push-Location $here
try {
  foreach ($g in $targets) { git add -- "games/$g" }

  git diff --cached --quiet
  $hasStaged = ($LASTEXITCODE -ne 0)

  if ($hasStaged) {
    $msg = if ($Slug) { "Update $Slug game copy" } else { "Update all game copies" }
    git commit -m $msg | Out-Null
    if ($NoPush) {
      Write-Output "Committed. Not pushed (-NoPush). Run: git push origin main"
    } else {
      git push origin main
      Write-Output "Pushed. Live site will update at https://robertpotau.github.io/ shortly."
    }
  } else {
    Write-Output "No changes to publish."
  }
}
finally {
  Pop-Location
}
