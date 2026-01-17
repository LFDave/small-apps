#!/usr/bin/env python3
"""
GeoTriad Data Generator - Simplified Version
Generates /data/geo.json according to the Data PRD specification.
Uses comprehensive German translations and local continent mapping.
"""

import json
import urllib.request
from typing import Dict, List

# Continent enum (strict) - Antarctica is excluded
CONTINENT_MAP_EN_TO_DE = {
    "Africa": "Afrika",
    "Europe": "Europa",
    "Asia": "Asien",
    "North America": "Nordamerika",
    "South America": "Südamerika",
    "Oceania": "Ozeanien"
}

# Extraordinary name tags (mandatory according to PRD)
EXTRAORDINARY_TAGS = {
    "CH": ["extraordinary_name"],  # Switzerland - Bern
    "BF": ["extraordinary_name"],  # Burkina Faso - Ouagadougou
    "TD": ["extraordinary_name"],  # Chad - N'Djamena
    "TV": ["extraordinary_name"],  # Tuvalu - Funafuti
    "MN": ["extraordinary_name"],  # Mongolia - Ulaanbaatar
    "CI": ["extraordinary_name"],  # Côte d'Ivoire - Yamoussoukro
    "BW": ["extraordinary_name"],  # Botswana - Gaborone
    "HT": ["extraordinary_name"],  # Haiti - Port-au-Prince (capital only, but tagging country too)
    "BI": ["extraordinary_name"],  # Burundi - Bujumbura (capital only)
    "MW": ["extraordinary_name"],  # Malawi - Lilongwe (capital only)
    "SB": ["extraordinary_name"],  # Solomon Islands - Honiara (capital only)
}

# Comprehensive German translations
GERMAN_TRANSLATIONS = {
    "AF": {"country": "Afghanistan", "capital": "Kabul"},
    "AL": {"country": "Albanien", "capital": "Tirana"},
    "DZ": {"country": "Algerien", "capital": "Algier"},
    "AD": {"country": "Andorra", "capital": "Andorra la Vella"},
    "AO": {"country": "Angola", "capital": "Luanda"},
    "AG": {"country": "Antigua und Barbuda", "capital": "Saint John's"},
    "AR": {"country": "Argentinien", "capital": "Buenos Aires"},
    "AM": {"country": "Armenien", "capital": "Eriwan"},
    "AU": {"country": "Australien", "capital": "Canberra"},
    "AT": {"country": "Österreich", "capital": "Wien"},
    "AZ": {"country": "Aserbaidschan", "capital": "Baku"},
    "BS": {"country": "Bahamas", "capital": "Nassau"},
    "BH": {"country": "Bahrain", "capital": "Manama"},
    "BD": {"country": "Bangladesch", "capital": "Dhaka"},
    "BB": {"country": "Barbados", "capital": "Bridgetown"},
    "BY": {"country": "Belarus", "capital": "Minsk"},
    "BE": {"country": "Belgien", "capital": "Brüssel"},
    "BZ": {"country": "Belize", "capital": "Belmopan"},
    "BJ": {"country": "Benin", "capital": "Porto-Novo"},
    "BT": {"country": "Bhutan", "capital": "Thimphu"},
    "BO": {"country": "Bolivien", "capital": "Sucre"},
    "BA": {"country": "Bosnien und Herzegowina", "capital": "Sarajevo"},
    "BW": {"country": "Botswana", "capital": "Gaborone"},
    "BR": {"country": "Brasilien", "capital": "Brasília"},
    "BN": {"country": "Brunei", "capital": "Bandar Seri Begawan"},
    "BG": {"country": "Bulgarien", "capital": "Sofia"},
    "BF": {"country": "Burkina Faso", "capital": "Ouagadougou"},
    "BI": {"country": "Burundi", "capital": "Gitega"},
    "CV": {"country": "Kap Verde", "capital": "Praia"},
    "KH": {"country": "Kambodscha", "capital": "Phnom Penh"},
    "CM": {"country": "Kamerun", "capital": "Yaoundé"},
    "CA": {"country": "Kanada", "capital": "Ottawa"},
    "CF": {"country": "Zentralafrikanische Republik", "capital": "Bangui"},
    "TD": {"country": "Tschad", "capital": "N'Djamena"},
    "CL": {"country": "Chile", "capital": "Santiago de Chile"},
    "CN": {"country": "China", "capital": "Peking"},
    "CO": {"country": "Kolumbien", "capital": "Bogotá"},
    "KM": {"country": "Komoren", "capital": "Moroni"},
    "CG": {"country": "Republik Kongo", "capital": "Brazzaville"},
    "CD": {"country": "Demokratische Republik Kongo", "capital": "Kinshasa"},
    "CR": {"country": "Costa Rica", "capital": "San José"},
    "CI": {"country": "Elfenbeinküste", "capital": "Yamoussoukro"},
    "HR": {"country": "Kroatien", "capital": "Zagreb"},
    "CU": {"country": "Kuba", "capital": "Havanna"},
    "CY": {"country": "Zypern", "capital": "Nikosia"},
    "CZ": {"country": "Tschechien", "capital": "Prag"},
    "DK": {"country": "Dänemark", "capital": "Kopenhagen"},
    "DJ": {"country": "Dschibuti", "capital": "Dschibuti"},
    "DM": {"country": "Dominica", "capital": "Roseau"},
    "DO": {"country": "Dominikanische Republik", "capital": "Santo Domingo"},
    "EC": {"country": "Ecuador", "capital": "Quito"},
    "EG": {"country": "Ägypten", "capital": "Kairo"},
    "SV": {"country": "El Salvador", "capital": "San Salvador"},
    "GQ": {"country": "Äquatorialguinea", "capital": "Malabo"},
    "ER": {"country": "Eritrea", "capital": "Asmara"},
    "EE": {"country": "Estland", "capital": "Tallinn"},
    "SZ": {"country": "Eswatini", "capital": "Mbabane"},
    "ET": {"country": "Äthiopien", "capital": "Addis Abeba"},
    "FJ": {"country": "Fidschi", "capital": "Suva"},
    "FI": {"country": "Finnland", "capital": "Helsinki"},
    "FR": {"country": "Frankreich", "capital": "Paris"},
    "GA": {"country": "Gabun", "capital": "Libreville"},
    "GM": {"country": "Gambia", "capital": "Banjul"},
    "GE": {"country": "Georgien", "capital": "Tiflis"},
    "DE": {"country": "Deutschland", "capital": "Berlin"},
    "GH": {"country": "Ghana", "capital": "Accra"},
    "GR": {"country": "Griechenland", "capital": "Athen"},
    "GD": {"country": "Grenada", "capital": "Saint George's"},
    "GT": {"country": "Guatemala", "capital": "Guatemala-Stadt"},
    "GN": {"country": "Guinea", "capital": "Conakry"},
    "GW": {"country": "Guinea-Bissau", "capital": "Bissau"},
    "GY": {"country": "Guyana", "capital": "Georgetown"},
    "HT": {"country": "Haiti", "capital": "Port-au-Prince"},
    "HN": {"country": "Honduras", "capital": "Tegucigalpa"},
    "HU": {"country": "Ungarn", "capital": "Budapest"},
    "IS": {"country": "Island", "capital": "Reykjavík"},
    "IN": {"country": "Indien", "capital": "Neu-Delhi"},
    "ID": {"country": "Indonesien", "capital": "Jakarta"},
    "IR": {"country": "Iran", "capital": "Teheran"},
    "IQ": {"country": "Irak", "capital": "Bagdad"},
    "IE": {"country": "Irland", "capital": "Dublin"},
    "IL": {"country": "Israel", "capital": "Jerusalem"},
    "IT": {"country": "Italien", "capital": "Rom"},
    "JM": {"country": "Jamaika", "capital": "Kingston"},
    "JP": {"country": "Japan", "capital": "Tokio"},
    "JO": {"country": "Jordanien", "capital": "Amman"},
    "KZ": {"country": "Kasachstan", "capital": "Astana"},
    "KE": {"country": "Kenia", "capital": "Nairobi"},
    "KI": {"country": "Kiribati", "capital": "Tarawa"},
    "KP": {"country": "Nordkorea", "capital": "Pjöngjang"},
    "KR": {"country": "Südkorea", "capital": "Seoul"},
    "KW": {"country": "Kuwait", "capital": "Kuwait-Stadt"},
    "KG": {"country": "Kirgisistan", "capital": "Bischkek"},
    "LA": {"country": "Laos", "capital": "Vientiane"},
    "LV": {"country": "Lettland", "capital": "Riga"},
    "LB": {"country": "Libanon", "capital": "Beirut"},
    "LS": {"country": "Lesotho", "capital": "Maseru"},
    "LR": {"country": "Liberia", "capital": "Monrovia"},
    "LY": {"country": "Libyen", "capital": "Tripolis"},
    "LI": {"country": "Liechtenstein", "capital": "Vaduz"},
    "LT": {"country": "Litauen", "capital": "Vilnius"},
    "LU": {"country": "Luxemburg", "capital": "Luxemburg"},
    "MG": {"country": "Madagaskar", "capital": "Antananarivo"},
    "MW": {"country": "Malawi", "capital": "Lilongwe"},
    "MY": {"country": "Malaysia", "capital": "Kuala Lumpur"},
    "MV": {"country": "Malediven", "capital": "Malé"},
    "ML": {"country": "Mali", "capital": "Bamako"},
    "MT": {"country": "Malta", "capital": "Valletta"},
    "MH": {"country": "Marshallinseln", "capital": "Majuro"},
    "MR": {"country": "Mauretanien", "capital": "Nouakchott"},
    "MU": {"country": "Mauritius", "capital": "Port Louis"},
    "MX": {"country": "Mexiko", "capital": "Mexiko-Stadt"},
    "FM": {"country": "Mikronesien", "capital": "Palikir"},
    "MD": {"country": "Moldau", "capital": "Chișinău"},
    "MC": {"country": "Monaco", "capital": "Monaco"},
    "MN": {"country": "Mongolei", "capital": "Ulaanbaatar"},
    "ME": {"country": "Montenegro", "capital": "Podgorica"},
    "MA": {"country": "Marokko", "capital": "Rabat"},
    "MZ": {"country": "Mosambik", "capital": "Maputo"},
    "MM": {"country": "Myanmar", "capital": "Naypyidaw"},
    "NA": {"country": "Namibia", "capital": "Windhoek"},
    "NR": {"country": "Nauru", "capital": "Yaren"},
    "NP": {"country": "Nepal", "capital": "Kathmandu"},
    "NL": {"country": "Niederlande", "capital": "Amsterdam"},
    "NZ": {"country": "Neuseeland", "capital": "Wellington"},
    "NI": {"country": "Nicaragua", "capital": "Managua"},
    "NE": {"country": "Niger", "capital": "Niamey"},
    "NG": {"country": "Nigeria", "capital": "Abuja"},
    "MK": {"country": "Nordmazedonien", "capital": "Skopje"},
    "NO": {"country": "Norwegen", "capital": "Oslo"},
    "OM": {"country": "Oman", "capital": "Maskat"},
    "PK": {"country": "Pakistan", "capital": "Islamabad"},
    "PW": {"country": "Palau", "capital": "Ngerulmud"},
    "PS": {"country": "Palästina", "capital": "Ramallah"},
    "PA": {"country": "Panama", "capital": "Panama-Stadt"},
    "PG": {"country": "Papua-Neuguinea", "capital": "Port Moresby"},
    "PY": {"country": "Paraguay", "capital": "Asunción"},
    "PE": {"country": "Peru", "capital": "Lima"},
    "PH": {"country": "Philippinen", "capital": "Manila"},
    "PL": {"country": "Polen", "capital": "Warschau"},
    "PT": {"country": "Portugal", "capital": "Lissabon"},
    "QA": {"country": "Katar", "capital": "Doha"},
    "RO": {"country": "Rumänien", "capital": "Bukarest"},
    "RU": {"country": "Russland", "capital": "Moskau"},
    "RW": {"country": "Ruanda", "capital": "Kigali"},
    "KN": {"country": "St. Kitts und Nevis", "capital": "Basseterre"},
    "LC": {"country": "St. Lucia", "capital": "Castries"},
    "VC": {"country": "St. Vincent und die Grenadinen", "capital": "Kingstown"},
    "WS": {"country": "Samoa", "capital": "Apia"},
    "SM": {"country": "San Marino", "capital": "San Marino"},
    "ST": {"country": "São Tomé und Príncipe", "capital": "São Tomé"},
    "SA": {"country": "Saudi-Arabien", "capital": "Riad"},
    "SN": {"country": "Senegal", "capital": "Dakar"},
    "RS": {"country": "Serbien", "capital": "Belgrad"},
    "SC": {"country": "Seychellen", "capital": "Victoria"},
    "SL": {"country": "Sierra Leone", "capital": "Freetown"},
    "SG": {"country": "Singapur", "capital": "Singapur"},
    "SK": {"country": "Slowakei", "capital": "Bratislava"},
    "SI": {"country": "Slowenien", "capital": "Ljubljana"},
    "SB": {"country": "Salomonen", "capital": "Honiara"},
    "SO": {"country": "Somalia", "capital": "Mogadischu"},
    "ZA": {"country": "Südafrika", "capital": "Pretoria"},
    "SS": {"country": "Südsudan", "capital": "Juba"},
    "ES": {"country": "Spanien", "capital": "Madrid"},
    "LK": {"country": "Sri Lanka", "capital": "Colombo"},
    "SD": {"country": "Sudan", "capital": "Khartum"},
    "SR": {"country": "Suriname", "capital": "Paramaribo"},
    "SE": {"country": "Schweden", "capital": "Stockholm"},
    "CH": {"country": "Schweiz", "capital": "Bern"},
    "SY": {"country": "Syrien", "capital": "Damaskus"},
    "TJ": {"country": "Tadschikistan", "capital": "Duschanbe"},
    "TZ": {"country": "Tansania", "capital": "Dodoma"},
    "TH": {"country": "Thailand", "capital": "Bangkok"},
    "TL": {"country": "Osttimor", "capital": "Dili"},
    "TG": {"country": "Togo", "capital": "Lomé"},
    "TO": {"country": "Tonga", "capital": "Nuku'alofa"},
    "TT": {"country": "Trinidad und Tobago", "capital": "Port of Spain"},
    "TN": {"country": "Tunesien", "capital": "Tunis"},
    "TR": {"country": "Türkei", "capital": "Ankara"},
    "TM": {"country": "Turkmenistan", "capital": "Aschgabat"},
    "TV": {"country": "Tuvalu", "capital": "Funafuti"},
    "UG": {"country": "Uganda", "capital": "Kampala"},
    "UA": {"country": "Ukraine", "capital": "Kiew"},
    "AE": {"country": "Vereinigte Arabische Emirate", "capital": "Abu Dhabi"},
    "GB": {"country": "Vereinigtes Königreich", "capital": "London"},
    "US": {"country": "Vereinigte Staaten", "capital": "Washington, D.C."},
    "UY": {"country": "Uruguay", "capital": "Montevideo"},
    "UZ": {"country": "Usbekistan", "capital": "Taschkent"},
    "VU": {"country": "Vanuatu", "capital": "Port Vila"},
    "VA": {"country": "Vatikanstadt", "capital": "Vatikanstadt"},
    "VE": {"country": "Venezuela", "capital": "Caracas"},
    "VN": {"country": "Vietnam", "capital": "Hanoi"},
    "YE": {"country": "Jemen", "capital": "Sanaa"},
    "ZM": {"country": "Sambia", "capital": "Lusaka"},
    "ZW": {"country": "Simbabwe", "capital": "Harare"}
}


def main():
    """Generate geo.json data."""
    print("\n" + "="*60)
    print("GeoTriad Data Generator (Simplified)")
    print("="*60 + "\n")
    
    # Load base countries data
    print("Fetching base countries data...")
    url = "https://raw.githubusercontent.com/Khodour/countries.json/master/countries.json"
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            base_countries = json.loads(response.read().decode('utf-8'))
        print(f"✓ Loaded {len(base_countries)} base countries")
    except Exception as e:
        print(f"✗ Error fetching base data: {e}")
        return
    
    # Load continent mapping
    print("Loading continent mapping...")
    try:
        with open("data/continents.json", "r", encoding="utf-8") as f:
            continents = json.load(f)
        print(f"✓ Loaded {len(continents)} continent mappings")
    except Exception as e:
        print(f"✗ Error loading continents: {e}")
        return
    
    # Generate geo data
    print("\nGenerating geo.json...")
    result = []
    excluded_count = 0
    
    for country in base_countries:
        alpha2 = country.get("alpha2")
        if not alpha2:
            excluded_count += 1
            continue
        
        # Check if we have German translation
        if alpha2 not in GERMAN_TRANSLATIONS:
            excluded_count += 1
            continue
        
        # Get continent
        continent_en = continents.get(alpha2)
        if not continent_en or continent_en == "Antarctica":
            excluded_count += 1
            continue
        
        continent_de = CONTINENT_MAP_EN_TO_DE.get(continent_en)
        if not continent_de:
            excluded_count += 1
            continue
        
        # Get German data
        german = GERMAN_TRANSLATIONS[alpha2]
        
        # Get flag (prefer emoji field)
        flag = country.get("emoji", country.get("flag", ""))
        
        # Build entry
        entry = {
            "id": alpha2,
            "country_en": country.get("name", ""),
            "country_de": german["country"],
            "continent_en": continent_en,
            "continent_de": continent_de,
            "region_en": country.get("region", ""),
            "region_de": "",  # Optional field
            "capital_en": country.get("capital", ""),
            "capital_de": german["capital"],
            "flag": flag,
            "tags": EXTRAORDINARY_TAGS.get(alpha2, [])
        }
        
        # Validate required fields
        if not all([
            entry["country_en"],
            entry["country_de"],
            entry["capital_en"],
            entry["capital_de"],
            entry["continent_en"],
            entry["continent_de"]
        ]):
            excluded_count += 1
            continue
        
        result.append(entry)
    
    # Sort by country_en
    result.sort(key=lambda x: x["country_en"])
    
    # Write to file
    output_path = "data/geo.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\n" + "="*60)
    print(f"✓ Generated {len(result)} countries")
    print(f"✗ Excluded {excluded_count} countries (missing required fields)")
    print(f"✓ Successfully written to {output_path}")
    print("="*60 + "\n")
    
    # Statistics
    continents_stats = {}
    extraordinary_count = 0
    for entry in result:
        continent = entry["continent_en"]
        continents_stats[continent] = continents_stats.get(continent, 0) + 1
        if "extraordinary_name" in entry.get("tags", []):
            extraordinary_count += 1
    
    print("Continent distribution:")
    for continent, count in sorted(continents_stats.items()):
        print(f"  {continent}: {count}")
    
    print(f"\nExtraordinary names tagged: {extraordinary_count}")
    
    # Show examples
    print("\nExample entries:")
    for entry in result[:5]:
        tags_str = f" [{', '.join(entry['tags'])}]" if entry['tags'] else ""
        print(f"  {entry['flag']} {entry['country_en']} ({entry['id']}) - {entry['capital_en']} - {entry['continent_en']}{tags_str}")


if __name__ == "__main__":
    main()
