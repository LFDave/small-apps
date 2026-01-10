import json

# German names for all 151 Gen 1 Pokemon
german_names = [
    "Bisasam", "Bisaknosp", "Bisaflor", "Glumanda", "Glutexo", "Glurak", "Schiggy", "Schillok", "Turtok", "Raupy",
    "Safcon", "Smettbo", "Hornliu", "Kokuna", "Bibor", "Taubsi", "Tauboga", "Tauboss", "Rattfratz", "Rattikarl",
    "Habitak", "Ibitak", "Rettan", "Arbok", "Pikachu", "Raichu", "Sandan", "Sandamer", "Nidoran♀", "Nidorina",
    "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Piepi", "Pixi", "Vulpix", "Vulnona", "Pummeluff", "Knuddeluff",
    "Zubat", "Golbat", "Myrapla", "Duflor", "Giflor", "Paras", "Parasek", "Bluzuk", "Omot", "Digda",
    "Digdri", "Mauzi", "Snobilikat", "Enton", "Entoron", "Menki", "Rasaff", "Fukano", "Arkani", "Quapsel",
    "Quaputzi", "Quappo", "Abra", "Kadabra", "Simsala", "Machollo", "Maschock", "Machomei", "Knofensa", "Ultrigaria",
    "Sarzenia", "Tentacha", "Tentoxa", "Kleinstein", "Georok", "Geowaz", "Ponita", "Gallopa", "Flegmon", "Lahmus",
    "Magnetilo", "Magneton", "Porenta", "Dodu", "Dodri", "Jurob", "Jugong", "Sleima", "Sleimok", "Muschas",
    "Austos", "Nebulak", "Alpollo", "Gengar", "Onix", "Traumato", "Hypno", "Krabby", "Kingler", "Voltobal",
    "Lektrobal", "Owei", "Kokowei", "Tragosso", "Knogga", "Kicklee", "Nockchan", "Schlurp", "Smogon", "Smogmog",
    "Rihorn", "Rizeros", "Chaneira", "Tangela", "Kangama", "Seeper", "Seemon", "Goldini", "Golking", "Sterndu",
    "Starmie", "Pantimos", "Sichlor", "Rossana", "Elektek", "Magmar", "Pinsir", "Tauros", "Karpador", "Garados",
    "Lapras", "Ditto", "Evoli", "Aquana", "Blitza", "Flamara", "Porygon", "Amonitas", "Amoroso", "Kabuto",
    "Kabutops", "Aerodactyl", "Relaxo", "Arktos", "Zapdos", "Lavados", "Dratini", "Dragonir", "Dragoran", "Mewtu",
    "Mew"
]

# Read the existing JSON
with open('data/pokemon.json', 'r', encoding='utf-8') as f:
    pokemon_data = json.load(f)

# Update each Pokemon with German name and region
for i, pokemon in enumerate(pokemon_data):
    pokemon['germanName'] = german_names[i]
    pokemon['region'] = 'Kanto'

# Write back the updated JSON
with open('data/pokemon.json', 'w', encoding='utf-8') as f:
    json.dump(pokemon_data, f, indent=2, ensure_ascii=False)

print("Successfully updated pokemon.json with German names and region!")
