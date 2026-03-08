import os
import re

def export_for_notebooklm():
    """Toma la documentación enriquecida y la prepara para NotebookLM en la raíz."""
    try:
        with open(".tmp/enriched_documentation.md", "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ Archivo .tmp/enriched_documentation.md no encontrado. Ejecuta enrich_documentation.py primero.")
        return

    # Intentar extraer el nombre del proyecto de gemini.md o la carpeta
    project_name = os.path.basename(os.getcwd())
    
    final_md = f"# Proyecto: {project_name}\n\n"
    final_md += "> Generado automáticamente por Antigravity B.L.A.S.T para NotebookLM\n\n"
    final_md += content

    output_path = f"{project_name}_NotebookLM_export.md"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_md)
        
    print(f"✅ Exportación para NotebookLM lista en: {output_path}")
    print("👉 Sube este archivo manualmente a tu Notebook en Google NotebookLM.")

if __name__ == "__main__":
    export_for_notebooklm()
