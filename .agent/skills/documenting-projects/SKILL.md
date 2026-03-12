---
name: documenting-projects
description: Se dispara al finalizar un proyecto para generar documentación tutorial paso a paso en Notion y NotebookLM, lista para crear contenido de YouTube e Instagram.
---

# Documenting Projects

## When to use this skill
Cuando se ha completado la fase "Trigger" del protocolo B.L.A.S.T. en un proyecto local, o cuando el usuario pide "documentar este proyecto". Genera documentación estilo tutorial (paso a paso, con código, ejemplos y gráficos) pensada para ser el guión base de contenido para YouTube e Instagram.

## Workflow
1. **Recolección local**: Se extraen los archivos de memoria (`gemini.md`, `findings.md`, `progress.md`, `task_plan.md`) y scripts de `tools/` (truncando si superan 500 líneas).
2. **Enriquecimiento (Agente)**: El agente lee todos los datos y genera un JSON con `steps` tipados (headings, code, callouts, lists, toggles, diagrams). El tono es no-técnico, como un tutorial para alguien que no sabe programar.
3. **Exportación a Notion**: Se genera una página rica en la base de datos de Notion con tabla de contenidos, pasos visuales y footer automático.
4. **Exportación a NotebookLM**: Se sube el reporte como fuente para generar podcasts, quizzes, reportes y más.

## Instructions
1. Verifica que existan: `gemini.md`, `task_plan.md`, `progress.md`, `findings.md`.
2. Verifica en `.env`: `NOTION_API_KEY`, `NOTION_DATABASE_ID`.
3. Ejecuta la recolección:
   ```
   python tools/collect_project_data.py
   ```
4. **Genera el JSON enriquecido** leyendo los archivos del proyecto y creando `.tmp/enriched_documentation.json` con el esquema de `steps` (ver SOP para tipos soportados). El tono debe ser:
   - Paso a paso, como un tutorial de YouTube
   - Lenguaje no técnico, explicando para alguien sin conocimientos previos
   - Con bloques de código cuando haga falta (incluyendo caption explicativa)
   - Con callouts para tips (💡), advertencias (⚠️) y ejemplos destacados (🎬)
   - Con toggles para lecciones aprendidas
   - Con diagramas de flujo cuando la lógica sea compleja
5. Exporta a Notion:
   ```
   node tools/export_to_notion.js
   ```
6. Exporta a NotebookLM (si autenticado):
   ```
   notebooklm source add ".tmp/enriched_documentation.md" --notebook ID --title "TITULO"
   ```
7. Avisa al usuario con los enlaces de Notion y NotebookLM.

## Resources
- **SOP**: `architecture/documenting-projects.md`
- **Esquema JSON**: Ver sección 3.2 del SOP para tipos de step soportados.
- El tono debe ser explicativo y profesional, pensado para 'Build in Public'. Sin jerga de redes sociales tipo "¡Hola chicos!".
