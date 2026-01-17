#!/usr/bin/env python3
"""
GeoTriad Data Generator
Generates /data/geo.json according to the Data PRD specification.
"""

import json
import urllib.request
import urllib.error
from typing import Dict, List, Optional

# Data source URLs
COUNTRIES_JSON_URL = "https://raw.githubusercontent.com/Khodour/countries.json/master/countries.json"
GERMAN_COUNTRIES_URL = "https://raw.githubusercontent.com/stefangabos/world_countries/master/data/countries/de/countries.json"
CONTINENT_MAPPING_URL = "https://gist.githubusercontent.com/tiagodealmeida/0b97ccf117252d742dddf098bc6cc58a/raw/3d3a409b2c844e30ac35a0ad734ad7f5fc0ca5f0/country-to-continent.json"

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
    # Country + Capital (both tagged)
    "CH": ["extraordinary_name"],  # Switzerland - Bern
    "BF": ["extraordinary_name"],  # Burkina Faso - Ouagadougou
    "TD": ["extraordinary_name"],  # Chad - N'Djamena
    "TV": ["extraordinary_name"],  # Tuvalu - Funafuti
    "MN": ["extraordinary_name"],  # Mongolia - Ulaanbaatar
    "CI": ["extraordinary_name"],  # Côte d'Ivoire - Yamoussoukro
    "BW": ["extraordinary_name"],  # Botswana - Gaborone
}


def fetch_json(url: str) -> Optional[Dict]:
    """Fetch JSON data from URL."""
    try:
        print(f"Fetching data from {url}")
        with urllib.request.urlopen(url, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"✓ Successfully fetched data")
            return data
    except urllib.error.URLError as e:
        print(f"✗ Error fetching {url}: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"✗ Error parsing JSON from {url}: {e}")
        return None


def load_base_countries() -> Dict[str, Dict]:
    """Load base country data from Khodour/countries.json."""
    data = fetch_json(COUNTRIES_JSON_URL)
    if not data:
        return {}
    
    countries = {}
    for country in data:
        alpha2 = country.get("alpha2")
        if alpha2:
            countries[alpha2] = {
                "id": alpha2,
                "country_en": country.get("name", ""),
                "capital_en": country.get("capital", ""),
                "region_en": country.get("region", ""),
                "flag": country.get("flag", ""),
            }
    
    print(f"Loaded {len(countries)} base countries")
    return countries


def load_german_translations() -> Dict[str, Dict]:
    """Load German translations from stefangabos/world_countries."""
    data = fetch_json(GERMAN_COUNTRIES_URL)
    if not data or not isinstance(data, list):
        return {}
    
    translations = {}
    for country in data:
        alpha2 = country.get("alpha2")
        if alpha2:
            translations[alpha2] = {
                "country_de": country.get("name", ""),
                "capital_de": country.get("capital", ""),
            }
    
    print(f"Loaded {len(translations)} German translations")
    return translations


def load_continent_mapping() -> Dict[str, str]:
    """Load continent mapping from local file or fallback to URL."""
    # Try local file first
    try:
        with open("data/continents.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            print(f"Loaded continent mapping from local file")
    except FileNotFoundError:
        # Fallback to URL
        data = fetch_json(CONTINENT_MAPPING_URL)
        if not data:
            return {}
    
    mapping = {}
    for alpha2, continent in data.items():
        # Only include valid continents (exclude Antarctica)
        if continent in CONTINENT_MAP_EN_TO_DE:
            mapping[alpha2] = continent
    
    print(f"Loaded {len(mapping)} continent mappings")
    return mapping


def generate_geo_json() -> List[Dict]:
    """Generate the complete geo.json dataset."""
    print("\n" + "="*60)
    print("GeoTriad Data Generator")
    print("="*60 + "\n")
    
    # Load all data sources
    base_countries = load_base_countries()
    german_translations = load_german_translations()
    continent_mapping = load_continent_mapping()
    
    if not base_countries or not continent_mapping:
        print("\n✗ Failed to load required data sources")
        return []
    
    # Merge data
    result = []
    excluded_count = 0
    
    for alpha2, base_data in base_countries.items():
        # Get continent
        continent_en = continent_mapping.get(alpha2)
        if not continent_en:
            excluded_count += 1
            continue
        
        continent_de = CONTINENT_MAP_EN_TO_DE.get(continent_en)
        if not continent_de:
            excluded_count += 1
            continue
        
        # Get German translations
        german_data = german_translations.get(alpha2, {})
        country_de = german_data.get("country_de", "")
        capital_de = german_data.get("capital_de", "")
        
        # Check required fields
        if not all([
            base_data.get("country_en"),
            country_de,
            base_data.get("capital_en"),
            capital_de,
            continent_en,
            continent_de
        ]):
            excluded_count += 1
            continue
        
        # Get tags (preserve any existing tags, add extraordinary tags)
        tags = EXTRAORDINARY_TAGS.get(alpha2, [])
        
        # Build entry
        entry = {
            "id": alpha2,
            "country_en": base_data["country_en"],
            "country_de": country_de,
            "continent_en": continent_en,
            "continent_de": continent_de,
            "region_en": base_data.get("region_en", ""),
            "region_de": german_data.get("region_de", ""),
            "capital_en": base_data["capital_en"],
            "capital_de": capital_de,
            "flag": base_data.get("flag", ""),
            "tags": tags
        }
        
        result.append(entry)
    
    # Sort by country_en
    result.sort(key=lambda x: x["country_en"])
    
    print(f"\n" + "="*60)
    print(f"✓ Generated {len(result)} countries")
    print(f"✗ Excluded {excluded_count} countries (missing required fields)")
    print("="*60 + "\n")
    
    return result


def main():
    """Main entry point."""
    geo_data = generate_geo_json()
    
    if not geo_data:
        print("Failed to generate geo data")
        return
    
    # Write to file
    output_path = "data/geo.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(geo_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Successfully written to {output_path}")
    
    # Print some statistics
    continents = {}
    extraordinary_count = 0
    for entry in geo_data:
        continent = entry["continent_en"]
        continents[continent] = continents.get(continent, 0) + 1
        if entry.get("tags") and "extraordinary_name" in entry["tags"]:
            extraordinary_count += 1
    
    print("\nContinent distribution:")
    for continent, count in sorted(continents.items()):
        print(f"  {continent}: {count}")
    
    print(f"\nExtraordinary names tagged: {extraordinary_count}")
    
    # Show a few examples
    print("\nExample entries:")
    for entry in geo_data[:3]:
        print(f"  {entry['country_en']} ({entry['id']}) - {entry['capital_en']} - {entry['continent_en']}")


if __name__ == "__main__":
    main()
