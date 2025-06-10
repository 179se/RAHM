import requests
from bs4 import BeautifulSoup

url = "https://mawaqit.net/fr/m/al-mouhsinine-beaucaire"

response = requests.get(url)
response.raise_for_status()  # Vérifie que la requête a réussi

soup = BeautifulSoup(response.text, "html.parser")

print(soup)

# Récupérer la première balise <script>
script_tag = soup.find("script")


if script_tag:
    print("Contenu de la balise <script> :")
    print(script_tag)
else:
    print("Aucune balise <script> trouvée.")
