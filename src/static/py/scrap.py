import re
import json

# Charger le contenu depuis le fichier que tu as donné
with open("c.txt", "r", encoding="utf-8") as f:
    script_content = f.read()

# Extraire l'objet confData = {...};
match = re.search(r'confData\s*=\s*(\{.*?\});', script_content, re.DOTALL)

if match:
    conf_json_str = match.group(1)
    
    # Parser l'objet JS en JSON
    try:
        conf_data = json.loads(conf_json_str)
        
        # Sauvegarder dans un fichier JSON
        with open("confData.json", "w", encoding="utf-8") as json_file:
            json.dump(conf_data, json_file, indent=2, ensure_ascii=False)

        print("✅ Données confData enregistrées dans 'confData.json'")
        
    except json.JSONDecodeError as e:
        print("❌ Erreur de parsing JSON :", e)
else:
    print("❌ Aucune variable 'confData' trouvée dans le script.")