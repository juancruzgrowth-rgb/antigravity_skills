---
name: creating-skills
description: Generates new Antigravity skills by detecting patterns, extracting reusable logic, and following architectural standards.
---

# Creating Skills

## When to use this skill
- When a logic pattern is repeated across different project parts.
- When an interaction with an external service is standardized.
- When a specific complex workflow is successfully implemented and could be useful for other projects.
- When the user explicitly requests to "modularize" or "save this logic as a skill".

## Workflow

1. **Pattern Detection**: Identify code, prompts, or tool logic that is project-agnostic.
2. **Standardization**: Ensure the logic follows the gerund naming convention and 3-layer architecture (if scripts are involved).
3. **Drafting**: Create the folder structure under `.agent/skills/`.
4. **Implementation**: Write the `SKILL.md` with YAML frontmatter and required sections.
5. **Sync**: Trigger `syncing-skills` to push the new skill to the central repository.
6. **Validation Loop**: Check that the skill is self-contained.
7. **Documentation**: Update the global `.agent/skills/README.md`.

## Instructions

1.  **Stop Execution**: Before creating the skill, pause and declare the intention to the user.
2.  **Naming**: Use `<gerundio>-lowercase-hyphens`. Max 64 chars.
3.  **Folders**: Always create `scripts/`, `examples/`, and `resources/` even if empty (placeholder `.gitkeep` if needed, but Antigravity prefers clean directories).
4.  **YAML**:
    - `name`: Match folder name.
    - `description`: Use 3rd person, start with a verb (e.g., "Manages...", "Generates...").
5.  **Sections**:
    - `# Skill Title`: Human-readable name.
    - `## When to use this skill`: Context and triggers.
    - `## Workflow`: Step-by-step checklist for the agent.
    - `## Instructions`: Core logic and constraints.
    - `## Resources`: References to internal files.

## Resources
- [Global README.md](../README.md)
- [Project Constitution](../../gemini.md)
