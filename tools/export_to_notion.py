import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def chunk_text(text, max_length=2000):
    """Notion API restringe los bloques de texto a 2000 caracteres como máximo."""
    return [text[i:i + max_length] for i in range(0, len(text), max_length)]

def export_to_notion():
    api_key = os.getenv("NOTION_API_KEY")
    database_id = os.getenv("NOTION_DATABASE_ID")
    
    if not api_key or not database_id:
        print("❌ NOTION_API_KEY o NOTION_DATABASE_ID no configurados en .env o entorno local.")
        return
        
    try:
        with open(".tmp/enriched_documentation.md", "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ Archivo .tmp/enriched_documentation.md no encontrado.")
        return

    project_name = os.path.basename(os.getcwd())
    
    url = "https://api.notion.com/v1/pages"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    # Crear bloques. Dividiremos el contenido en párrafos o chunks de max 2000 chars.
    chunks = chunk_text(content, 1900)
    children_blocks = []
    
    for chunk in chunks:
        children_blocks.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {"content": chunk}
                    }
                ]
            }
        })
        # Notion API limita a 100 bloques por request al crear.
        if len(children_blocks) >= 99:
            break

    payload = {
        "parent": {"database_id": database_id},
        "properties": {
            "title": { # Esto dependerá del esquema exacto en Notion, asumimos 'Name' o 'title'
                "title": [
                    {
                        "text": {
                            "content": f"Proyecto: {project_name}"
                        }
                    }
                ]
            }
        },
        "children": children_blocks
    }

    print("⏳ Exportando a Notion...")
    try:
        resp = requests.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        page_url = resp.json().get("url", "URL Desconocida")
        print(f"✅ Documentación subida exitosamente a Notion: {page_url}")
    except Exception as e:
        print(f"❌ Error al exportar a Notion: {e}")
        if hasattr(resp, 'text'):
            print(f"Detalle: {resp.text}")

if __name__ == "__main__":
    export_to_notion()
