import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def enrich_data():
    """Toma la data cruda desde .tmp y llama a Perplexity para generar un resumen técnico."""
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        print("❌ PERPLEXITY_API_KEY no configurado.")
        return
        
    try:
        with open(".tmp/collected_project_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ Archivo .tmp/collected_project_data.json no encontrado.")
        return

    # Limitar el payload enviado por si acaso excede el prompt del LLM
    raw_text = "\n\n".join([f"### Archivo: {k}\n{v}" for k, v in data.items()])
    
    # Prompt estricto del B.L.A.S.T
    prompt = f"""
    Eres un Technical Writer Senior documentando un proyecto de automatización estructurado.
    A continuación recibirás todo el código y la arquitectura de un proyecto local. 
    Tu trabajo es producir:
    1. Un Resumen Técnico de alto nivel del proyecto.
    2. Las tecnologías utilizadas y por qué son el "estado del arte".
    3. Una explicación legible de la automatización para otro desarrollador.
    
    Tono: Técnico, directo, tipo documentación de software. Cero lenguaje estilo redes sociales, youtuber o influencers. 
    Producir respuesta en formato Markdown.
    
    DATOS DEL PROYECTO:
    {raw_text[:25000]} # Limitado a ~25k caracteres de forma conservadora
    """

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3-sonar-small-32k-online",
        "messages": [
            {"role": "system", "content": "You are a senior technical documentarian."},
            {"role": "user", "content": prompt}
        ]
    }

    print("⏳ Solicitando enriquecimiento a Perplexity API...")
    resp = requests.post("https://api.perplexity.ai/chat/completions", headers=headers, json=payload)
    resp.raise_for_status()
    
    enriched = resp.json()['choices'][0]['message']['content']
    
    with open(".tmp/enriched_documentation.md", "w", encoding="utf-8") as f:
        f.write(enriched)
    print("✅ Documentación enriquecida guardada en .tmp/enriched_documentation.md")

if __name__ == "__main__":
    enrich_data()
