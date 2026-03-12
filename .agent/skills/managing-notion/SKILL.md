---
name: managing-notion
description: Asistente inteligente de Notion que traduce páginas EN→ES preservando la estructura, crea páginas desde instrucciones, resume contenido largo y reorganiza bloques entre páginas.
---

# Managing Notion

## When to use this skill
- Cuando el usuario pida **traducir** una página de Notion del inglés al español.
- Cuando el usuario quiera **crear** una nueva página en Notion a partir de instrucciones.
- Cuando necesite **resumir** una página larga de Notion.
- Cuando quiera **reorganizar** contenido entre páginas.
- El espacio de trabajo por defecto es **RECURSOS** (`31109638-4773-809c-8b75-d8b14f541277`), salvo indicación contraria.

## Workflow

### Traducir Página
1. Identificar la página fuente (el usuario da el nombre o URL).
2. Leer la página con `API-retrieve-a-page` para obtener título y propiedades.
3. Leer todos los bloques hijos con `API-get-block-children` (paginar si `has_more: true`).
4. Para cada bloque con hijos (toggle, column_list), leer recursivamente sus children.
5. Traducir el contenido siguiendo las **Reglas de Traducción** (ver SOP `architecture/managing-notion.md`):
   - Texto, headings, callouts, listas, quotes → traducir contenido
   - Code blocks → NO traducir código, solo captions
   - Imágenes, videos, embeds → copiar tal cual, traducir captions
   - Preservar TODAS las annotations (bold, italic, color, links)
6. Crear página destino en RECURSOS con `API-post-page`:
   - Título = nombre traducido al español
   - Parent = RECURSOS page ID
7. Añadir bloques traducidos con `API-patch-block-children` (máx 100 por request).
8. Para bloques con hijos: crear padre primero, luego añadir children usando el ID del bloque padre recién creado.

### Crear Página
1. El usuario describe qué quiere en la página.
2. Generar los bloques de Notion correspondientes (headings, paragraphs, code, callouts, etc.).
3. Crear la página en RECURSOS con `API-post-page`.
4. Añadir los bloques con `API-patch-block-children`.

### Resumir Página
1. Leer la página completa recursivamente.
2. Generar un resumen conciso del contenido.
3. Opciones:
   - Crear nueva página: "[Resumen] Nombre Original"
   - Insertar un callout resumen al inicio de la página existente

### Reorganizar Contenido
1. Leer bloques de la página fuente.
2. Según las instrucciones del usuario: mover, reordenar o copiar bloques.
3. Usar `API-delete-a-block` + `API-patch-block-children` según sea necesario.

## Instructions

### Constantes
```
RECURSOS_PAGE_ID = "31109638-4773-809c-8b75-d8b14f541277"
```

### Reglas Generales
1. **Espacio por defecto**: RECURSOS, salvo que el usuario indique otro.
2. **Idioma**: Traducir de inglés a español por defecto.
3. **Bloques de código**: NUNCA traducir el código. Solo traducir captions.
4. **Annotations**: Siempre preservar bold, italic, strikethrough, underline, code inline, color y links.
5. **Límite 2000 chars**: Si un bloque traducido supera 2000 caracteres, dividirlo en múltiples bloques del mismo tipo.
6. **Límite 100 bloques/request**: Paginar las inserciones.
7. **Sub-páginas (child_page)**: NO traducir automáticamente. Preguntar al usuario primero.
8. **Imágenes de Notion (type: file)**: Las URLs expiran. Copiar como `external` cuando sea posible.

### Herramientas MCP a Usar
| Operación | Herramienta MCP |
|---|---|
| Buscar página | `API-post-search` |
| Leer página | `API-retrieve-a-page` |
| Leer bloques | `API-get-block-children` |
| Crear página | `API-post-page` |
| Añadir bloques | `API-patch-block-children` |
| Eliminar bloque | `API-delete-a-block` |
| Actualizar bloque | `API-update-a-block` |

## Resources
- **SOP completo**: `architecture/managing-notion.md`
- **Esquema de bloques Notion**: Ver tabla de reglas de traducción en el SOP
