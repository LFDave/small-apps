import json

# Gen 2 Pokémon (Johto region, #152-251)
gen2_pokemon = [
    {"id": 152, "name": "Chikorita", "germanName": "Endivie", "region": "Johto"},
    {"id": 153, "name": "Bayleef", "germanName": "Lorblatt", "region": "Johto"},
    {"id": 154, "name": "Meganium", "germanName": "Meganie", "region": "Johto"},
    {"id": 155, "name": "Cyndaquil", "germanName": "Feurigel", "region": "Johto"},
    {"id": 156, "name": "Quilava", "germanName": "Igelavar", "region": "Johto"},
    {"id": 157, "name": "Typhlosion", "germanName": "Tornupto", "region": "Johto"},
    {"id": 158, "name": "Totodile", "germanName": "Karnimani", "region": "Johto"},
    {"id": 159, "name": "Croconaw", "germanName": "Tyracroc", "region": "Johto"},
    {"id": 160, "name": "Feraligatr", "germanName": "Impergator", "region": "Johto"},
    {"id": 161, "name": "Sentret", "germanName": "Wiesor", "region": "Johto"},
    {"id": 162, "name": "Furret", "germanName": "Wiesenior", "region": "Johto"},
    {"id": 163, "name": "Hoothoot", "germanName": "Hoothoot", "region": "Johto"},
    {"id": 164, "name": "Noctowl", "germanName": "Noctuh", "region": "Johto"},
    {"id": 165, "name": "Ledyba", "germanName": "Ledyba", "region": "Johto"},
    {"id": 166, "name": "Ledian", "germanName": "Ledian", "region": "Johto"},
    {"id": 167, "name": "Spinarak", "germanName": "Webarak", "region": "Johto"},
    {"id": 168, "name": "Ariados", "germanName": "Ariados", "region": "Johto"},
    {"id": 169, "name": "Crobat", "germanName": "Iksbat", "region": "Johto"},
    {"id": 170, "name": "Chinchou", "germanName": "Lampi", "region": "Johto"},
    {"id": 171, "name": "Lanturn", "germanName": "Lanturn", "region": "Johto"},
    {"id": 172, "name": "Pichu", "germanName": "Pichu", "region": "Johto"},
    {"id": 173, "name": "Cleffa", "germanName": "Pii", "region": "Johto"},
    {"id": 174, "name": "Igglybuff", "germanName": "Fluffeluff", "region": "Johto"},
    {"id": 175, "name": "Togepi", "germanName": "Togepi", "region": "Johto"},
    {"id": 176, "name": "Togetic", "germanName": "Togetic", "region": "Johto"},
    {"id": 177, "name": "Natu", "germanName": "Natu", "region": "Johto"},
    {"id": 178, "name": "Xatu", "germanName": "Xatu", "region": "Johto"},
    {"id": 179, "name": "Mareep", "germanName": "Voltilamm", "region": "Johto"},
    {"id": 180, "name": "Flaaffy", "germanName": "Waaty", "region": "Johto"},
    {"id": 181, "name": "Ampharos", "germanName": "Ampharos", "region": "Johto"},
    {"id": 182, "name": "Bellossom", "germanName": "Blubella", "region": "Johto"},
    {"id": 183, "name": "Marill", "germanName": "Marill", "region": "Johto"},
    {"id": 184, "name": "Azumarill", "germanName": "Azumarill", "region": "Johto"},
    {"id": 185, "name": "Sudowoodo", "germanName": "Mogelbaum", "region": "Johto"},
    {"id": 186, "name": "Politoed", "germanName": "Quaxo", "region": "Johto"},
    {"id": 187, "name": "Hoppip", "germanName": "Hoppspross", "region": "Johto"},
    {"id": 188, "name": "Skiploom", "germanName": "Hubelupf", "region": "Johto"},
    {"id": 189, "name": "Jumpluff", "germanName": "Papungha", "region": "Johto"},
    {"id": 190, "name": "Aipom", "germanName": "Griffel", "region": "Johto"},
    {"id": 191, "name": "Sunkern", "germanName": "Sonnkern", "region": "Johto"},
    {"id": 192, "name": "Sunflora", "germanName": "Sonnflora", "region": "Johto"},
    {"id": 193, "name": "Yanma", "germanName": "Yanma", "region": "Johto"},
    {"id": 194, "name": "Wooper", "germanName": "Felino", "region": "Johto"},
    {"id": 195, "name": "Quagsire", "germanName": "Morlord", "region": "Johto"},
    {"id": 196, "name": "Espeon", "germanName": "Psiana", "region": "Johto"},
    {"id": 197, "name": "Umbreon", "germanName": "Nachtara", "region": "Johto"},
    {"id": 198, "name": "Murkrow", "germanName": "Kramurx", "region": "Johto"},
    {"id": 199, "name": "Slowking", "germanName": "Laschoking", "region": "Johto"},
    {"id": 200, "name": "Misdreavus", "germanName": "Traunfugil", "region": "Johto"},
    {"id": 201, "name": "Unown", "germanName": "Icognito", "region": "Johto"},
    {"id": 202, "name": "Wobbuffet", "germanName": "Woingenau", "region": "Johto"},
    {"id": 203, "name": "Girafarig", "germanName": "Girafarig", "region": "Johto"},
    {"id": 204, "name": "Pineco", "germanName": "Tannza", "region": "Johto"},
    {"id": 205, "name": "Forretress", "germanName": "Forstellka", "region": "Johto"},
    {"id": 206, "name": "Dunsparce", "germanName": "Dummisel", "region": "Johto"},
    {"id": 207, "name": "Gligar", "germanName": "Skorgla", "region": "Johto"},
    {"id": 208, "name": "Steelix", "germanName": "Stahlos", "region": "Johto"},
    {"id": 209, "name": "Snubbull", "germanName": "Snubbull", "region": "Johto"},
    {"id": 210, "name": "Granbull", "germanName": "Granbull", "region": "Johto"},
    {"id": 211, "name": "Qwilfish", "germanName": "Baldorfish", "region": "Johto"},
    {"id": 212, "name": "Scizor", "germanName": "Scherox", "region": "Johto"},
    {"id": 213, "name": "Shuckle", "germanName": "Pottrott", "region": "Johto"},
    {"id": 214, "name": "Heracross", "germanName": "Skaraborn", "region": "Johto"},
    {"id": 215, "name": "Sneasel", "germanName": "Sniebel", "region": "Johto"},
    {"id": 216, "name": "Teddiursa", "germanName": "Teddiursa", "region": "Johto"},
    {"id": 217, "name": "Ursaring", "germanName": "Ursaring", "region": "Johto"},
    {"id": 218, "name": "Slugma", "germanName": "Schneckmag", "region": "Johto"},
    {"id": 219, "name": "Magcargo", "germanName": "Magcargo", "region": "Johto"},
    {"id": 220, "name": "Swinub", "germanName": "Quiekel", "region": "Johto"},
    {"id": 221, "name": "Piloswine", "germanName": "Keifel", "region": "Johto"},
    {"id": 222, "name": "Corsola", "germanName": "Corasonn", "region": "Johto"},
    {"id": 223, "name": "Remoraid", "germanName": "Remoraid", "region": "Johto"},
    {"id": 224, "name": "Octillery", "germanName": "Octillery", "region": "Johto"},
    {"id": 225, "name": "Delibird", "germanName": "Botogel", "region": "Johto"},
    {"id": 226, "name": "Mantine", "germanName": "Mantax", "region": "Johto"},
    {"id": 227, "name": "Skarmory", "germanName": "Panzaeron", "region": "Johto"},
    {"id": 228, "name": "Houndour", "germanName": "Hunduster", "region": "Johto"},
    {"id": 229, "name": "Houndoom", "germanName": "Hundemon", "region": "Johto"},
    {"id": 230, "name": "Kingdra", "germanName": "Seedraking", "region": "Johto"},
    {"id": 231, "name": "Phanpy", "germanName": "Phanpy", "region": "Johto"},
    {"id": 232, "name": "Donphan", "germanName": "Donphan", "region": "Johto"},
    {"id": 233, "name": "Porygon2", "germanName": "Porygon2", "region": "Johto"},
    {"id": 234, "name": "Stantler", "germanName": "Damhirplex", "region": "Johto"},
    {"id": 235, "name": "Smeargle", "germanName": "Farbeagle", "region": "Johto"},
    {"id": 236, "name": "Tyrogue", "germanName": "Rabauz", "region": "Johto"},
    {"id": 237, "name": "Hitmontop", "germanName": "Kapoera", "region": "Johto"},
    {"id": 238, "name": "Smoochum", "germanName": "Kussilla", "region": "Johto"},
    {"id": 239, "name": "Elekid", "germanName": "Elekid", "region": "Johto"},
    {"id": 240, "name": "Magby", "germanName": "Magby", "region": "Johto"},
    {"id": 241, "name": "Miltank", "germanName": "Miltank", "region": "Johto"},
    {"id": 242, "name": "Blissey", "germanName": "Heiteira", "region": "Johto"},
    {"id": 243, "name": "Raikou", "germanName": "Raikou", "region": "Johto"},
    {"id": 244, "name": "Entei", "germanName": "Entei", "region": "Johto"},
    {"id": 245, "name": "Suicune", "germanName": "Suicune", "region": "Johto"},
    {"id": 246, "name": "Larvitar", "germanName": "Larvitar", "region": "Johto"},
    {"id": 247, "name": "Pupitar", "germanName": "Pupitar", "region": "Johto"},
    {"id": 248, "name": "Tyranitar", "germanName": "Despotar", "region": "Johto"},
    {"id": 249, "name": "Lugia", "germanName": "Lugia", "region": "Johto"},
    {"id": 250, "name": "Ho-Oh", "germanName": "Ho-Oh", "region": "Johto"},
    {"id": 251, "name": "Celebi", "germanName": "Celebi", "region": "Johto"}
]

# Read existing data
with open('data/pokemon.json', 'r', encoding='utf-8') as f:
    pokemon_data = json.load(f)

# Add image URLs for Gen 2
for pokemon in gen2_pokemon:
    # Convert name to lowercase and handle special characters for URL
    name_for_url = pokemon['name'].lower().replace("'", "")
    pokemon['imageUrl'] = f"https://img.pokemondb.net/artwork/large/{name_for_url}.jpg"

# Append Gen 2 to existing data
pokemon_data.extend(gen2_pokemon)

# Write back to file
with open('data/pokemon.json', 'w', encoding='utf-8') as f:
    json.dump(pokemon_data, f, indent=2, ensure_ascii=False)

print(f"Successfully added {len(gen2_pokemon)} Gen 2 Pokémon!")
print(f"Total Pokémon in dataset: {len(pokemon_data)}")
