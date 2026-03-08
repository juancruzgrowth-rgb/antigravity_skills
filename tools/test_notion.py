import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_notion():
    api_key = os.getenv("NOTION_API_KEY")
    if not api_key:
        print("❌ NOTION_API_KEY no encontrada en las variables de entorno ni en .env.")
        return False
    
    url = "https://api.notion.com/v1/users/me"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Notion-Version": "2022-06-28"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        print("✅ Conexión a Notion Exitosa!")
        print(f"Bot/Usuario autenticado: {response.json().get('name', 'Desconocido')}")
        return True
    except Exception as e:
        print(f"❌ Error al conectar con Notion: {e}")
        if 'response' in locals() and hasattr(response, 'text'):
            print(f"Detalle: {response.text}")
        return False

if __name__ == "__main__":
    test_notion()
