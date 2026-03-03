# Antigravity Skills Library

Repository of reusable skills for Antigravity agents.

## How to use this library
1. Copy the `.agent/skills/` directory to your project root.
2. Antigravity will automatically index the skills.
3. Use the skills by following their `Workflow` and `Instructions`.

## Standard Structure
Every skill MUST follow this hierarchy:
```
<skill-name>/
  SKILL.md        # Logic and Metadata
  scripts/        # Support scripts (Python/JS)
  examples/       # Reference implementations
  resources/      # Assets and templates
```

## Creating new skills
Use the `creating-skills` skill itself to expand this library.

## Available Skills
- [creating-skills](./creating-skills/SKILL.md): Self-expansion logic.
- [syncing-skills](./syncing-skills/SKILL.md): Automated GitHub push/pull.
- [managing-notion](./managing-notion/SKILL.md): Notion API & Database handling.
- [managing-google-sheets](./managing-google-sheets/SKILL.md): GSheets data sync.
- [connecting-n8n](./connecting-n8n/SKILL.md): Workflow triggers and API.
- [generating-pdf](./generating-pdf/SKILL.md): Dynamic PDF generation.
- [creating-quiz-system](./creating-quiz-system/SKILL.md): Interactive lead capture.
- [deploying-web-app](./deploying-web-app/SKILL.md): Deployment SOPs.
- [managing-leads](./managing-leads/SKILL.md): CRM and lead qualification.
- [deploying-automation](./deploying-automation/SKILL.md): Cron & Webhook management.

## GitHub Sync & Import

### For Central Repository (this repo)
To push changes automatically, the `syncing-skills` skill will run:
```powershell
.\scripts\sync.ps1 -Message "your commit message"
```

### For Consumer Projects (other projects)
To import or update these skills in a new project, run:
```powershell
# In the root of your project:
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/juancruzgrowth-rgb/antigravity_skills/master/scripts/install-skills.ps1" -OutFile "install-skills.ps1"
.\install-skills.ps1 -RepoUrl "https://github.com/juancruzgrowth-rgb/antigravity_skills.git"
```
