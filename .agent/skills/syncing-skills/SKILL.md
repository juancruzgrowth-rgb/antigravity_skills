---
name: syncing-skills
description: Automates the synchronization of skills between the local workspace and the central GitHub repository.
---

# Syncing Skills

## When to use this skill
- After creating or modifying a skill in the central repository.
- When starting work on a consumer project that uses these skills.
- When the user asks to "update skills".

## Workflow

1. **Detection**: Identify if the current workspace is the "Central Repository" or a "Consumer Project".
2. **Central Repo Logic**:
    - Run `scripts/sync.ps1` to commit and push changes.
3. **Consumer Project Logic**:
    - Run `scripts/install-skills.ps1` to pull the latest version from GitHub.

## Instructions

1.  **Transparency**: Always inform the user before pushing or pulling.
2.  **Safety**: If there are merge conflicts in a consumer project, stop and ask the user for help.
3.  **Frequency**: Proactively check for updates (pull) when first starting a session in a project that has the `.agent/skills/` directory.

## Resources
- [sync.ps1](../../scripts/sync.ps1)
- [install-skills.ps1](../../scripts/install-skills.ps1)
