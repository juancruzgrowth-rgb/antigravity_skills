# Findings — Antigravity Skills Repository

## Investigación Inicial

- **Workspace vacío**: No existe código previo. Partimos de cero.
- **Contexto del usuario**: El usuario gestiona proyectos Antigravity que incluyen integraciones con Notion, Google Sheets, n8n, generación de PDFs, sistemas de quiz, despliegue web y automatizaciones.
- **Proyecto relacionado**: Existe un proyecto de e-commerce (Amapola Haircare) que será consumidor de estas skills.

## Estándar de Skills de Antigravity

El sistema nativo de Antigravity reconoce skills en `.agent/skills/` con la siguiente convención:
- Cada skill es una carpeta con `SKILL.md` como archivo principal
- El frontmatter YAML define `name` y `description`
- Carpetas opcionales: `scripts/`, `examples/`, `resources/`

## Limitaciones Identificadas

- Las skills son archivos estáticos; no hay un mecanismo de versionado integrado.
- La copia entre proyectos es manual (copiar carpeta `.agent/skills/`).
- **Autenticación Git**: El agente no tiene acceso directo a las credenciales de GitHub del usuario. El primer push debe ser realizado manualmente por el usuario para activar el gestor de credenciales.
