---
name: publishing-to-github
description: Automates the process of adding, committing, and pushing code changes to a GitHub repository, ensuring standard commit messages.
---

# Publishing to GitHub

## When to use this skill
- When a significant block of work or task is completed.
- When the user explicitly requests to "publish to github", "push to repo", or "commit changes".
- When a milestone is reached and the current state needs to be saved to version control.

## Workflow

1. **Verify State**: Confirm the current branch and repository status using `git status`.
2. **Review Changes**: Ensure that no sensitive information (e.g., `.env` files, API keys) is staged or unstaged by checking `.gitignore`.
3. **Stage Files**: Use `git add .` to stage all necessary changes inside the working directory.
4. **Commit**: Use `git commit -m "[Conventional Commit Message]"` to commit the changes. The message should follow the conventional commit format (e.g., `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
5. **Push**: Use `git push origin [branch-name]` to upload local repository content to the remote repository.
6. **Confirm**: Confirm successful push and notify the user.

## Instructions

1.  **Safety First**: Ensure no hardcoded secrets exist before adding changes.
2.  **Naming Convention**: Write professional and descriptive commit messages following the Conventional Commits specification.
    - `feat:` for new features.
    - `fix:` for bug fixes.
    - `docs:` for documentation changes.
    - `style:` for formatting, missing semi colons, etc; no code change.
    - `refactor:` refactoring production code.
    - `chore:` updating build tasks, package manager configs, etc; no production code change.
3.  **Transparency**: Verbally confirm the intention if the codebase is particularly dirty or has massive changes before executing the push.

## Resources
- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
