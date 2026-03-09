import os
import requests
from dotenv import load_dotenv

load_dotenv()

def create_database():
    api_key = os.getenv("NOTION_API_KEY")
    page_id = "31d0963847738091ae42e95885c3af9c" # ID de la página proporcionada
    
    if not api_key:
        print("❌ NOTION_API_KEY no encontrada en .env")
        return

    url = "https://api.notion.com/v1/databases"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    payload = {
        "parent": {"type": "page_id", "page_id": page_id},
        "title": [
            {
                "type": "text",
                "text": {"content": "📂 Registro de Proyectos Antigravity"}
            }
        ],
        "properties": {
            "Project Name": {"title": {}},
            "Status": {
                "select": {
                    "options": [
                        {"name": "🛠️ Dev", "color": "orange"},
                        {"name": "✅ Done", "color": "green"},
                        {"name": "🚀 Published", "color": "blue"}
                    ]
                }
            },
            "Date": {"date": {}},
            "Stack": {
                "multi_select": {
                    "options": [
                        {"name": "Antigravity", "color": "purple"},
                        {"name": "n8n", "color": "red"},
                        {"name": "Supabase", "color": "green"},
                        {"name": "Notion", "color": "default"},
                        {"name": "Python", "color": "blue"}
                    ]
                }
            },
            "Complexity": {
                "select": {
                    "options": [
                        {"name": "⭐", "color": "yellow"},
                        {"name": "⭐⭐", "color": "orange"},
                        {"name": "⭐⭐⭐", "color": "red"}
                    ]
                }
            },
            "AI Insights": {"rich_text": {}}
        }
    }

    print("⏳ Creando base de datos en Notion...")
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        db_id = response.json()["id"]
        print(f"✅ Base de Datos creada con éxito!")
        print(f"ID de la Base de Datos: {db_id}")
        print(f"URL: {response.json()['url']}")
        
        # Guardar el ID en el .env para los otros scripts
        with open(".env", "a") as f:
            f.write(f"\nNOTION_DATABASE_ID={db_id}\n")
        print("✅ NOTION_DATABASE_ID guardado en .env")
        
    except Exception as e:
        print(f"❌ Error al crear la base de datos: {e}")
        if hasattr(response, 'text'):
            print(f"Detalle: {response.text}")

if __name__ == "__main__":
    create_database()
