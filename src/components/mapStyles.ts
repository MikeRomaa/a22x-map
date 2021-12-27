import { LayerProps } from 'react-map-gl';

export const airportStyle: LayerProps = {
    id: 'airports',
    type: 'circle',
    paint: {
        'circle-radius': 8,
        'circle-color': '#29abe2',
        'circle-stroke-color': '#29abe2',
        'circle-stroke-opacity': 0.4,
        'circle-stroke-width': 4,
    },
};

export const flightStyle: LayerProps = {
    id: 'flights',
    type: 'line',
    paint: {
        'line-width': 2,
        'line-color': '#ffffff',
    },
};
