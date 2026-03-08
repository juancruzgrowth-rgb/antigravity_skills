import os
import glob
import json

def collect_files():
    """Recopila datos del proyecto actual, truncando archivos grandes."""
    project_data = {}
    
    # Recolectar archivos markdown raíz
    md_files = ["gemini.md", "task_plan.md", "findings.md", "progress.md"]
    for md in md_files:
        if os.path.exists(md):
            with open(md, "r", encoding="utf-8") as f:
                project_data[md] = f.read()
        else:
            project_data[md] = ""
            
    # Recolectar SOPs
    arch_files = glob.glob("architecture/*.md")
    for arch in arch_files:
        with open(arch, "r", encoding="utf-8") as f:
            project_data[arch] = f.read()

    # Recolectar herramientas (Scripts) respetando límite 500 líneas
    tool_files = glob.glob("tools/*.py")
    for tool in tool_files:
        with open(tool, "r", encoding="utf-8") as f:
            lines = f.readlines()
            if len(lines) > 500:
                project_data[tool] = "".join(lines[:500]) + "\n\n// Código truncado: > 500 líneas. Referirse al repositorio local."
            else:
                project_data[tool] = "".join(lines)
                
    return project_data

if __name__ == "__main__":
    data = collect_files()
    os.makedirs(".tmp", exist_ok=True)
    with open(".tmp/collected_project_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("✅ Datos locales recolectados en .tmp/collected_project_data.json")
