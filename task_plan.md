## Fase 1: Blueprint (Completado)
- [x] Preguntas de descubrimiento respondidas
- [x] Esquema de datos definido en `gemini.md`
- [x] Investigación inicial registrada en `findings.md`

## Fase 2: Link (Completado)
- [x] Verificar conexión a Notion API (crear una DB de prueba o usar existente mediante MCP/token)
- [x] Definir y probar la API de enriquecimiento (Perplexity API)

## Fase 3: Architect (Completado)
- [x] Construir SOP en `architecture/documenting-projects.md`
  - Definir cómo recolectar de `gemini.md`, `task_plan.md`, `findings.md` y `architecture/` del proyecto objetivo
  - Definir lógica para truncar/ignorar código > 500 líneas
  - Definir prompt de enriquecimiento para que el tono sea documental técnico
- [x] Escribir herramientas iterativas en `tools/`
  1. `collect_project_data.py`: Lee archivos locales y sanitiza
  2. `enrich_documentation.py`: Llama a API para contexto adicional
  3. `export_to_notion.py`: Crea/Actualiza DB y bloques de la página en Notion
  4. `export_for_notebooklm.py`: Genera el `.md` final unificado

## Fase 4: Stylize (Completado)
- [x] Dar formato Markdown rico a los bloques de Notion (Callouts para summary, Code blocks para scripts)
- [x] Configurar el archivo plano `.md` de salida para que sea 100% digerible por NotebookLM.

## Fase 5: Trigger (Completado)
- [x] Crear la habilidad `.agent/skills/documenting-projects/SKILL.md`
- [x] Definir las instrucciones de invocación y ejemplos.
