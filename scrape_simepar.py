import json
import requests
from bs4 import BeautifulSoup
import time
import re
import os

GEOJSON_FILE = "parana.geojson"

def get_forecast(ibge_code):
    url = f'https://www.simepar.br/simepar/forecast_by_counties/{ibge_code}'
    try:
        response = requests.get(url, timeout=15)
        if response.status_code != 200:
            print(f"Error fetching {ibge_code}: Status {response.status_code}")
            return None

        soup = BeautifulSoup(response.text, 'html.parser')

        # Current temp
        current_temp_tag = soup.find('span', class_='currentTemp')
        current_temp = None
        if current_temp_tag:
            # Extract number from " 12˚C"
            match = re.search(r'(-?\d+)', current_temp_tag.get_text())
            if match:
                current_temp = int(match.group(1))

        # Max and Min from Highcharts script or data labels
        # Looking into the script part where series are defined
        scripts = soup.find_all('script')
        max_temp = None
        min_temp = None

        for script in scripts:
            if script.string and 'Temperatura Máxima' in script.string:
                # Use regex to find data: [13,16,17,...]
                max_match = re.search(r'name:\s*"Temperatura Máxima",.*?data:\s*\[(.*?)\],', script.string, re.DOTALL)
                if max_match:
                    data_str = max_match.group(1)
                    temps = [int(t) for t in data_str.split(',')]
                    if temps:
                        max_temp = temps[0] # Today's max

                min_match = re.search(r'name:\s*"Temperatura Mínima",.*?data:\s*\[(.*?)\],', script.string, re.DOTALL)
                if min_match:
                    data_str = min_match.group(1)
                    temps = [int(t) for t in data_str.split(',')]
                    if temps:
                        min_temp = temps[0] # Today's min
                break

        return {
            'temp_atual': current_temp,
            'temp_max': max_temp,
            'temp_min': min_temp,
            'updated_at': time.strftime('%Y-%m-%d %H:%M:%S')
        }
    except Exception as e:
        print(f"Exception fetching {ibge_code}: {e}")
        return None

def update_geojson():
    with open(GEOJSON_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total = len(data['features'])
    print(f"Updating {total} municipalities...")

    for i, feature in enumerate(data['features']):
        ibge_code = feature['properties']['codarea']
        nome = feature['properties']['nome']
        print(f"[{i+1}/{total}] Fetching data for {nome} ({ibge_code})...")

        forecast = get_forecast(ibge_code)
        if forecast:
            feature['properties'].update(forecast)
        else:
            print(f"Failed to get forecast for {nome}")

        # Small delay to avoid being blocked
        time.sleep(0.1)

    with open(GEOJSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
    print("GeoJSON updated successfully.")

if __name__ == "__main__":
    update_geojson()
