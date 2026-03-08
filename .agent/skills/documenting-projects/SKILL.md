---
name: documenting-projects
description: Se dispara al finalizar un proyecto para recolectar el código, la arquitectura y el historial en Notion y NotebookLM.
---

# Documenting Projects

## When to use this skill
Cuando se ha completado la fase "Trigger" del protocolo B.L.A.S.T. en un proyecto local o cuando el usuario explícitamente pide "documentar el proyecto actual en Notion y NotebookLM". Sirve para construir la marca personal (build in public) generando un reporte técnico estructurado de la automatización.

## Workflow
El flujo de documentación sigue 4 pasos:
1. **Recolección local**: Se extraen los archivos de memoria (`gemini.md`, `findings.md`) y arquitectura, más los scripts de `tools/` (si los scripts superan 500 líneas se truncan para no saturar contextos).
2. **Enriquecimiento del contexto**: Se toma la recolección cruda y se le pide a Perplexity API que actúe como un "Technical Writer Senior" para generar un resumen explicativo y estado del arte de las decisiones técnicas.
3. **Exportación a Notion**: Se generan bloques de sub-páginas en Notion utilizando la API oficial, asegurando no sobrepasar el límite de 2000 caracteres por bloque text.
4. **Exportación a NotebookLM**: Se ensambla un archivo markdown (`_NotebookLM_export.md`) en la raíz del repositorio, listo y limpio para que el usuario lo suba manualmente.

## Instructions
1. Verifica que los siguientes archivos clave existan en el proyecto local: `gemini.md`, `task_plan.md`, `progress.md` y `findings.md`.
2. Verifica que las siguientes variables existan en `.env`:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `PERPLEXITY_API_KEY`
3. Asegúrate de que los 4 scripts de documentación (`collect_project_data.py`, `enrich_documentation.py`, `export_to_notion.py`, `export_for_notebooklm.py`) están copiados en la carpeta `tools/` de ese proyecto (o genéralos basados en el SOP del skill si no los tienen).
4. Ejecuta cada uno mediante la consola del agente usando Python:
   - `python tools/collect_project_data.py`
   - `python tools/enrich_documentation.py`
   - `python tools/export_to_notion.py`
   - `python tools/export_for_notebooklm.py`
5. Avisa al usuario que la entrada de Notion ha sido creada y envíale la ruta del archivo Markdown final para que lo suba a NotebookLM manualmente.

## Resources
No se requieren recursos adicionales. El formato debe ser estrictamente sin tono de 'influencer', manteniendo el valor para 'Developer Documentation'.
