---
name: designing-ui-ux-pro
description: Provides design intelligence for building professional UI/UX using searchable databases of styles, colors, typography, and UX guidelines.
---

# Designing UI/UX Pro

## When to use this skill
- When starting a new web or mobile project that needs a professional design system.
- When seeking inspiration for specific UI styles (glassmorphism, bento, etc.).
- When needing industry-specific color palettes or typography pairings.
- When implementing charts or complex layout patterns.

## Workflow

1. **Requirement Analysis**: Identify the product type (SaaS, E-commerce, etc.) and target audience.
2. **Design System Generation**: Use the internal search engine to generate a tailored design system.
   ```powershell
   python src/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "ProjectName"
   ```
3. **Style Selection**: Search for specific UI styles if needed.
   ```powershell
   python src/ui-ux-pro-max/scripts/search.py "<query>" --domain style
   ```
4. **Implementation**: Apply the recommended colors, fonts, and patterns using the preferred stack.
5. **Persistence**: Save the design system if requested by the user.
   ```powershell
   python src/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "ProjectName"
   ```

## Instructions

1.  **Python Dependency**: Ensure Python 3.x is available before running scripts.
2.  **Path Management**: All scripts are located in `src/ui-ux-pro-max/scripts/`. Always use relative paths from the skill root.
3.  **Output Interpretation**: The search engine returns ASCII or Markdown. Use the Markdown output (`-f markdown`) for better integration into documentation.
4.  **Anti-patterns**: Always check the "Anti-Patterns" section in the generated design system to avoid common industry mistakes.

## Resources
- [README.md](./README.md) - Full documentation and feature list.
- [CLAUDE.md](./CLAUDE.md) - Architecture and developer guidelines.
- [Scripts](./src/ui-ux-pro-max/scripts/) - Python search engine and generator.
- [Data](./src/ui-ux-pro-max/data/) - Canonical CSV databases.
