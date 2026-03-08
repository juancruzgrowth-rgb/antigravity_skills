# SOP: Documenting Projects

## 1. Identidad y Propósito
Este documento define la arquitectura para la habilidad `documenting-projects`. Su objetivo es recopilar la historia completa de un proyecto (planificación, descubrimientos, arquitectura y código), enriquecerla usando Perplexity API y publicarla de forma estructurada en una base de datos de Notion y localmente para NotebookLM.

## 2. Entradas (Inputs)
- Archivos locales del proyecto Antigravity destino donde se ejecutan los scripts:
  - `gemini.md` (Constitución)
  - `task_plan.md` (Checklists)
  - `findings.md` (Investigación y Problemas)
  - `progress.md` (Log de eventos)
  - `architecture/` (SOPs por capa)
  - `tools/` (Scripts atómicos)
- `NOTION_API_KEY`, `NOTION_DATABASE_ID` y `PERPLEXITY_API_KEY` en `.env`.

## 3. Lógica y Procesamiento
1. **Recolección (`collect_project_data.py`)**:
   - Se leen todos los `.md` en la raíz.
   - Se leen todos los `.py` en `tools/`.
   - **Restricción de Tamaño**: Si un archivo en `tools/` excede las 500 líneas, se truncará agregando la nota: `// Código truncado: > 500 líneas. Referirse al repositorio local.`
   
2. **Enriquecimiento (`enrich_documentation.py`)**:
   - Envía el *dump* de código y *markdown* a la API de Perplexity (`llama-3-sonar-small-32k-online` o equivalente).
   - **Tono y Prompt**: Tono *técnico*, orientado a "developer documentation". Explicar la elección de tecnologías, resumir el workflow de la automatización construida y proveer insights de tendencias útiles y estables en el mercado (por qué se hizo así).
   - Prohibido utilizar lenguaje de redes sociales como "¡Hola chicos!" o "Bienvenidos a mi canal".

3. **Exportación a Notion (`export_to_notion.py`)**:
   - Genera una página dentro de la Base de Datos Notion.
   - Propiedades base: `Title` (Nombre proyecto inferido), `Date` (Hoy).
   - Contenido de la página: Segmentado en bloques de Título e Texto Enriquecido.

4. **Exportación a NotebookLM (`export_for_notebooklm.py`)**:
   - Genera el reporte combinado como `<project_name>_NotebookLM_export.md` para subida manual.

## 4. Casos Borde y Restricciones (Auto-reparación)
- **Error de Tokens Perplexity**: Si todo el contexto supera 32k tokens, el recolector deberá limitarse a leer solo `gemini.md` y `architecture/`, ignorando `tools/` para el enriquecimiento.
- **Formateo Notion**: La API de Notion puede rechazar bloques muy extensos (límite de 2000 chars por bloque de texto). El script `export_to_notion.py` debe dividir textos largos en sub-bloques de 2000 caracteres como máximo.
