---
name: deploying-web-app
description: Standardizes the dual deployment process for web applications: pushing source code to GitHub and deploying the production build to Vercel.
---

# Deploying Web App

## When to use this skill
- When a web project is ready for production or a new visual/functional update needs to be published.
- When the user explicitly requests to "publish to Vercel", "deploy", or "replicate changes in Github and Vercel".

## Workflow

1. **Verify State**: Confirm the current branch and repository status using `git status`.
2. **GitHub Publication**: 
    - Stage changes: `git add .`
    - Commit them: `git commit -m "feat: [Description of update]"`
    - Push them: `git push origin [branch-name]`.
3. **Vercel Setup**: 
    - If Vercel CLI is not installed, install it globally using `npm i -g vercel`.
4. **Vercel Publishing**:
    - Run `vercel --prod --token [VERCEL_TOKEN] --yes` to force a direct production deployment without interactive prompts. 
    - *Note: Vercel Token should be retrieved from MCP config or environment variables.*
5. **Confirm**: Confirm both successful push to GitHub and the direct Vercel deployment URL, notifying the user.

## Instructions

1.  **Dual publishing**: This skill must always execute the Github commit/push cycle FIRST to ensure source control is up to date, and then the Vercel direct deployment cycle SECOND.
2.  **Safety First**: Ensure no hardcoded secrets exist before adding changes.
3.  **Tokens**: Never print the Vercel API token in the chat. Use it directly in the background terminal command.

## Resources
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
