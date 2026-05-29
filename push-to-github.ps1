# Sync source from Antigravity copy, commit, and push to GitHub.
# Run in PowerShell: Right-click -> Run with PowerShell, or:
#   Set-ExecutionPolicy -Scope Process Bypass; .\push-to-github.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = $PSScriptRoot
$Source   = "C:\Users\ahmed\Desktop\Project\Antigravity\Password Generator\Password Generator V1"
$Dest     = Join-Path $RepoRoot "Password Generator V1"

if (-not (Test-Path $Source)) {
    Write-Error "Source not found: $Source"
}
if (-not (Test-Path (Join-Path $RepoRoot ".git"))) {
    Write-Error "Not a git repo: $RepoRoot"
}

Write-Host "Syncing project files (excluding node_modules, builds, temp-asar)..."
robocopy $Source $Dest /E /XD node_modules temp-asar dist dist-ssr dist-electron release .git `
    /XF stdout.txt stderr.txt /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }

Set-Location $RepoRoot

Write-Host "Removing tracked build folders from git index (if any)..."
git rm -r --cached "Password Generator V1/node_modules" 2>$null
git rm -r --cached "Password Generator V1/temp-asar" 2>$null
git rm -r --cached "Password Generator V1/dist-electron" 2>$null
git rm -r --cached "Password Generator V1/dist" 2>$null
git rm -r --cached "Password Generator V1/release" 2>$null

git add -A
git status -sb

$changes = git status --porcelain
if (-not $changes) {
    Write-Host "Nothing to commit. Pushing existing commits..."
} else {
    git commit -m @"
Add NightGold Password Manager source and documentation

Sync Electron/React app, README, docs, and gitignore. Exclude node_modules and build artifacts.
"@
}

Write-Host "Pushing to origin main..."
git push -u origin main

Write-Host "Done. Repository: https://github.com/Ahshika/Password-Generator-V1"
