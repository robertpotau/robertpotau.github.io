<#
.SYNOPSIS
  Refreshes the playable copy of one (or all) featured game(s) inside this
  landing-page repo, then commits and pushes so GitHub Pages republishes.

.PARAMETER Slug
  Folder name of the game under claude-projects/<slug> and games/<slug>.
  Omit to sync every game listed below.

.EXAMPLE
  .\sync-game.ps1 -Slug fraccions
  .\sync-game.ps1
#>
param(
  [string]$Slug
)

$ErrorActionPreference = "Stop"

$src  = "C:\Users\PC\Documents\Claude-Sync\claude-projects"
$here = $PSScriptRoot

$games = @("calcuherois","aula-acollida","fraccions","lletra-a-lletra","ortografia","vistes","geometria","quina-hora-es","what-time-is-it")

if ($Slug) {
  if ($games -notcontains $Slug) {
    Write-Error "Unknown slug '$Slug'. Known games: $($games -join ', ')"
  }
  $targets = @($Slug)
} else {
  $targets = $games
}

foreach ($g in $targets) {
  $dest = Join-Path $here "games\$g"
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Write-Output "Syncing $g ..."
  robocopy "$src\$g" "$dest" /E /MIR `
    /XD .git apk backups pdf `
    /XF *.py *.md *.bak* server.log *.txt review_svgs.html revisio_icones.html figures_revision.html manifest.json .gitignore `
    /NFL /NDL /NJH | Out-Null
}

Push-Location $here
if ($Slug) {
  git add "games\$Slug"
} else {
  foreach ($g in $targets) { git add "games\$g" }
}
$msg = if ($Slug) { "Update $Slug game copy" } else { "Update all game copies" }
$diff = git status --porcelain
if ($diff) {
  git commit -m $msg | Out-Null
  git push origin main
  Write-Output "Pushed. Live site will update at https://robertpotau.github.io/ shortly."
} else {
  Write-Output "No changes to publish."
}
Pop-Location
