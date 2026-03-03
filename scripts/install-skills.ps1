# Install/Update script for Consumer Projects
param(
    [string]$RepoUrl = "https://github.com/juancruzgrowth-rgb/antigravity_skills.git"
)

if (-not (Test-Path ".agent")) { New-Item -ItemType Directory -Path ".agent" }
if (-not (Test-Path ".agent/skills")) {
    Write-Host "Cloning skills repository..."
    git clone $RepoUrl .agent/skills
} else {
    Write-Host "Updating skills repository..."
    Set-Location .agent/skills
    git pull
    Set-Location ../../
}
