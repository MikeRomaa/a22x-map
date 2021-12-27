import json

output = {
    'type': 'FeatureCollection',
    'features': [],
}

with open('flights.raw.json') as f:
    flights = json.load(f)

with open('airports.json') as f:
    airports = json.load(f)['features']

def filter_iata(iata):
    return filter(lambda airport: airport['properties']['iata'] == iata, airports)

for flight in flights:
    dep = next(filter_iata(flight['dep']))
    arr = next(filter_iata(flight['arr']))
    output['features'].append({
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': [
                dep['geometry']['coordinates'],
                arr['geometry']['coordinates'],
            ],
        },
        'properties': flight,
    })

with open('flights.json', 'w') as f:
    json.dump(output, f)
