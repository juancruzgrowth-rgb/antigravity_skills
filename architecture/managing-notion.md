# SOP: Managing Notion — Asistente de Notion

## 1. Identidad y Propósito
Asistente de Notion para Antigravity. Puede leer, traducir, crear, resumir y reorganizar páginas de Notion usando las herramientas MCP directamente, sin scripts intermedios.

## 2. Constantes del Workspace

| Constante | Valor |
|-----------|-------|
| Página RECURSOS (ID) | `31109638-4773-809c-8b75-d8b14f541277` |
| Espacio por defecto | RECURSOS (salvo que el usuario indique otro) |
| Idioma de traducción | Inglés → Español |
| Token | Variable de entorno en MCP config |

## 3. Operaciones

### 3.1 Traducir Página (EN → ES)

**Flujo:**
1. Identificar la página fuente (por nombre o ID)
2. Leer la página: `API-retrieve-a-page` → obtener título y propiedades
3. Leer bloques hijos: `API-get-block-children` (recursivo, paginar si `has_more`)
4. Para cada bloque, aplicar reglas de traducción (ver §4)
5. Crear página destino: `API-post-page` con parent = RECURSOS y título traducido
6. Añadir bloques traducidos: `API-patch-block-children` (máx 100 por request)
7. Si un bloque tiene hijos (toggle, column_list, synced_block):
   - Primero crear el bloque padre
   - Luego añadir los hijos con `API-patch-block-children` usando el ID del bloque padre

**Nombre de la página traducida:**
- Si el original es "How I build Beautiful Websites" → "Cómo construyo sitios web hermosos"
- No añadir "(ES)" — usar directamente el nombre traduciado

### 3.2 Crear Página Desde Instrucciones

**Flujo:**
1. El usuario describe el contenido deseado
2. Generar los bloques de Notion (mismo motor que `export_to_notion.js`)
3. Crear la página en RECURSOS: `API-post-page`
4. Añadir bloques: `API-patch-block-children`

### 3.3 Resumir Página

**Flujo:**
1. Leer la página completa recursivamente
2. Generar un resumen conciso
3. Crear nueva página con título: "[Resumen] Nombre Original"
4. O insertar en la misma página como callout al inicio

### 3.4 Reorganizar Contenido

**Flujo:**
1. Leer los bloques de la página fuente
2. Mover/reordenar según instrucciones del usuario
3. Usar `API-delete-a-block` + `API-patch-block-children` para reorganizar

## 4. Reglas de Traducción por Tipo de Bloque

| Tipo de Bloque | ¿Traducir? | Notas |
|---|---|---|
| `paragraph` | ✅ Sí | Traducir todo el rich_text |
| `heading_1/2/3` | ✅ Sí | Traducir título |
| `bulleted_list_item` | ✅ Sí | Traducir contenido |
| `numbered_list_item` | ✅ Sí | Traducir contenido |
| `to_do` | ✅ Sí | Traducir texto, mantener checked |
| `quote` | ✅ Sí | Traducir contenido |
| `callout` | ✅ Sí | Traducir texto, mantener emoji/color |
| `toggle` | ✅ Sí | Traducir título, recursión en hijos |
| `code` | ❌ No | Mantener código intacto. Solo traducir `caption` |
| `divider` | ➡️ Copiar | Sin contenido textual |
| `table_of_contents` | ➡️ Copiar | Sin contenido textual |
| `image` | ➡️ Copiar | Mantener URL. Traducir `caption` si la tiene |
| `video` | ➡️ Copiar | Mantener URL. Traducir `caption` |
| `embed` | ➡️ Copiar | Mantener URL |
| `bookmark` | ➡️ Copiar | Mantener URL. Traducir `caption` |
| `table` / `table_row` | ✅ Sí | Traducir contenido de celdas |
| `column_list` / `column` | ➡️ Recursión | Traducir contenido de cada columna |
| `synced_block` | ⚠️ Precaución | Solo traducir si es bloque original, no referencia |
| `child_page` | ❌ No | No traducir sub-páginas automáticamente (preguntar primero) |
| `child_database` | ❌ No | No tocar bases de datos inline |

### Rich Text — Reglas de Formato
Al traducir un `rich_text` array:
- **Preservar annotations**: bold, italic, strikethrough, underline, code, color
- **Preservar links**: mantener href intacto
- **Traducir solo el `plain_text`/`content`**: el texto visible

## 5. Límites y Casos Borde
- **2000 chars por bloque**: Si la traducción es más larga que el original, dividir
- **100 bloques por request**: Paginar con `API-patch-block-children`
- **Bloques con hijos**: Crear padre primero, luego añadir hijos por ID
- **Images/files hosted en Notion**: Las URLs de tipo `file` de Notion expiran. Al traducir, convertir a tipo `external` con la URL temporal. La imagen funcionará hasta que expire (~1h). Alternativa: descargar y re-subir manualmente.
- **link_preview blocks**: La API de Notion no permite crear bloques de tipo `link_preview`. Al clonar una página, se deben convertir a `bookmark`.
- **child_page encontrado**: No traducir automáticamente. Informar al usuario y preguntar si desea traducir esa sub-página también

## 6. Nota de Auto-reparación
> Error detectado: Al incluir image blocks con `type: "file"`, Notion rechaza la request con error 400 porque espera `external` o `file_upload`.
> **Solución**: Antes de escribir, convertir todos los image blocks de tipo `file` a tipo `external` copiando la URL temporal.
