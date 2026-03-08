import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_perplexity():
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        print("❌ PERPLEXITY_API_KEY no encontrada en las variables de entorno ni en .env.")
        return False
    
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3-sonar-small-32k-online",
        "messages": [
            {"role": "system", "content": "Be precise and concise."},
            {"role": "user", "content": "What is 2+2?"}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print("✅ Conexión a Perplexity Exitosa!")
        print(f"Respuesta: {response.json()['choices'][0]['message']['content']}")
        return True
    except Exception as e:
        print(f"❌ Error al conectar con Perplexity: {e}")
        if 'response' in locals() and hasattr(response, 'text'):
            print(f"Detalle: {response.text}")
        return False

if __name__ == "__main__":
    test_perplexity()
