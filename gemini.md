# Antigravity Skills — Constitución del Proyecto

> Fuente de verdad para el repositorio central de Skills reutilizables.

## Estado del Proyecto

| Campo             | Valor                          |
|-------------------|--------------------------------|
| Fase BLAST actual | 🚀 Trigger (Completado)         |
| Fecha de inicio   | 2026-03-01                     |
| Última edición    | 2026-03-03                     |

## Estrella del Norte

> Crear un asistente de documentación detallada (`documenting-projects`) que capture la historia de cada proyecto Antigravity, genere una base de datos estructurada en Notion, y prepare la información enriquecida (vía APIs externas) para ser consumida manualmente por NotebookLM y convertida en contenido.

## Esquema de Datos

### Esquema de Datos - documenting-projects

**Carga útil para Notion (Base de Datos):**
* `project_id`: (Title) Nombre único del proyecto
* `date`: (Date) Fecha de recolección
* `tools_used`: (Multi-select) Ej: [Antigravity, n8n, Supabase]
* `complexity`: (Select) Ej: Alta, Media, Baja
* `summary`: (Text) Resumen rápido de la automatización
* `enriched_context`: (Text) Insights de tendencias/API
* `page_content`: (Page blocks) Todo el detalle paso a paso estructurado

**Carga útil para NotebookLM:**
* Exportación final en `.md` o texto enriquecido combinando toda la data y contexto, listo para subida manual.

### Estructura de una Skill

```
<skill-name>/
  SKILL.md            # Instrucciones principales (YAML frontmatter + markdown)
  scripts/            # (opcional) Scripts auxiliares
  examples/           # (opcional) Implementaciones de referencia
  resources/          # (opcional) Plantillas, assets, archivos adicionales
```

### SKILL.md — Frontmatter YAML obligatorio

```yaml
---
name: <gerundio-lowercase-hyphens-max-64-chars>
description: <tercera persona, triggers claros, cuándo usarse>
---
```

### SKILL.md — Secciones obligatorias

```markdown
# Skill Title

## When to use this skill

## Workflow

## Instructions

## Resources
```

> **Pendiente:** Confirmar esquema con el usuario antes de codificar.

## Reglas de Comportamiento

1. No escribir scripts innecesarios.
2. No duplicar lógica dentro de `tools/` si puede ser una skill.
3. Priorizar modularidad.
4. Declarar cada acción antes de ejecutarla.
5. Cuando se detecte lógica reutilizable: detener → proponer → crear skill → continuar.
6. Cada skill debe ser autosuficiente y copiable a cualquier proyecto.
7. **Reglas para `documenting-projects`**:
   - Nunca documentar código crudo que exceda las 500 líneas (resumir o truncar).
   - El tono del enriquecimiento debe ser explicativo, técnico y legible (tipo documentación para desarrolladores), sin lenguaje introductorio de redes sociales.
## Invariantes Arquitectónicas

- La ruta canónica de skills es `.agent/skills/`.
- Toda skill debe tener un `SKILL.md` válido con YAML frontmatter.
- El nombre (`name`) en el frontmatter sigue formato: gerundio, lowercase, hyphens, max 64 chars.
- La `description` en el frontmatter usa tercera persona e incluye triggers.
- Skills sin lógica compleja aún deben tener la estructura de carpetas completa.

## Skills Planificadas

| Skill                    | Estado      |
|--------------------------|-------------|
| creating-skills          | ⬜ Pendiente |
| managing-notion          | ⬜ Pendiente |
| managing-google-sheets   | ⬜ Pendiente |
| connecting-n8n           | ⬜ Pendiente |
| generating-pdf           | ⬜ Pendiente |
| creating-quiz-system     | ⬜ Pendiente |
| deploying-web-app        | ⬜ Pendiente |
| managing-leads           | ⬜ Pendiente |
| deploying-automation     | ⬜ Pendiente |
| documenting-projects     | 🔄 En Progreso |
