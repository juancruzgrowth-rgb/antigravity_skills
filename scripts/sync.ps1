# Sync script for Central Repository
param(
    [string]$Message = "chore: update skills"
)

git add .
git commit -m $Message
git push
