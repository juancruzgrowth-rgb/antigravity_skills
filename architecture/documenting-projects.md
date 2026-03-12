# SOP: Documenting Projects

## 1. Identidad y Propósito
Este documento define la arquitectura para la habilidad `documenting-projects`. Su objetivo es recopilar la historia completa de un proyecto (planificación, descubrimientos, arquitectura y código), enriquecerla usando el agente Antigravity como "Director de Contenido" y publicarla de forma estructurada en Notion y NotebookLM.

## 2. Entradas (Inputs)
- Archivos locales del proyecto Antigravity:
  - `gemini.md` (Constitución)
  - `task_plan.md` (Checklists)
  - `findings.md` (Investigación y Problemas)
  - `progress.md` (Log de eventos)
  - `architecture/` (SOPs por capa)
  - `tools/` (Scripts atómicos)
- `NOTION_API_KEY` y `NOTION_DATABASE_ID` en `.env`.

## 3. Lógica y Procesamiento

### 3.1 Recolección (`collect_project_data.py`)
- Lee todos los `.md` en la raíz y todos los scripts en `tools/`.
- **Restricción de Tamaño**: Si un archivo excede 500 líneas, se trunca.
- Output: `.tmp/collected_project_data.json`.

### 3.2 Enriquecimiento (Agente Antigravity)
El agente actúa como "Director de Contenido":
1. Lee los datos recolectados y los archivos del proyecto.
2. Reconstruye la historia como un **tutorial paso a paso para alguien sin conocimientos técnicos**.
3. Genera un JSON con `steps` tipados:
   - `heading_1/2/3`: Títulos de secciones
   - `paragraph/text`: Explicaciones en lenguaje sencillo
   - `code`: Bloques de código con caption explicativa
   - `callout`: Tips (💡), advertencias (⚠️), ejemplos destacados
   - `numbered_list`: Listas de pasos
   - `bulleted_list`: Listas de herramientas
   - `toggle`: Contenido expandible (lecciones aprendidas)
   - `quote`: Reflexiones clave
   - `diagram`: Flujos visuales
   - `divider`: Separadores
   - `table_of_contents`: Índice automático
4. **Tono**: Explicativo, como un tutorial para YouTube. Sin jerga técnica innecesaria.
5. Output: `.tmp/enriched_documentation.json`.

### 3.3 Exportación a Notion (`export_to_notion.js`)
- Lee el JSON enriquecido con `steps`.
- Crea una página en la Base de Datos Notion con:
  - Propiedades: Project Name, Status, Date, Stack, Complexity, AI Insights.
  - Contenido rico: Table of Contents + Summary Callout + Todos los Steps + Footer.
- **Límites**: Auto-split a 1900 chars/bloque. Paginación a 100 bloques/request.

### 3.4 Exportación a NotebookLM
- `notebooklm source add` sube el reporte `.md` al cuaderno configurado.
- Requiere autenticación previa (`notebooklm login`).

## 4. Cuándo Documentar
**Al finalizar el proyecto** (Fase Trigger del B.L.A.S.T.), no de forma incremental. Esto asegura que la documentación está completa y no contiene pasos que luego cambiaron.

## 5. Casos Borde y Restricciones
- **Notion 2000 chars**: El script divide automáticamente textos largos.
- **Notion 100 blocks**: Se envían en lotes con `appendChildren`.
- **NotebookLM sesión expirada**: Re-autenticar con `notebooklm login`.
- **Tokens Notion `ntn_` vs `secret_`**: Ambos formatos son válidos. Lo importante es dar permiso a la integración en la página.
