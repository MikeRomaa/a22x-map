import React, { useCallback, useMemo, useState } from 'react';
import GeoJSON from 'geojson';
import ReactMapGL, { FlyToInterpolator, Layer, MapEvent, Popup, Source } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { airportStyle, flightStyle } from './mapStyles';
import flightsGeo from '../data/flights.json';
import airportsGeo from '../data/airports.json';

// The following is required to stop "yarn build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MapBox: React.FC = () => {
    const [selectedAirport, setselectedAirport] = useState<string | undefined>();
    const [popup, setPopup] = React.useState<GeoJSON.Feature<GeoJSON.Point>>();
    const [viewport, setViewport] = useState({
        latitude: 40,
        longitude: 0,
        zoom: 3,
    });

    const handleHover = useCallback((event: MapEvent) => {
        setPopup(event.features && event.features[0]);
    }, []);

    const handleClick = useCallback((event: MapEvent) => {
        if (event.features && event.features.length > 0) {
            setselectedAirport(event.features[0].properties.iata);
        }
    }, []);

    const filterFrom = useMemo(() => ['==', 'dep', selectedAirport ?? ''], [selectedAirport]);
    const filterTo = useMemo(() => ['==', 'arr', selectedAirport ?? ''], [selectedAirport]);

    return (
        <ReactMapGL
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            height="100vh"
            width="100vw"
            dragRotate={false}
            touchRotate={false}
            onHover={handleHover}
            onClick={handleClick}
            onViewportChange={setViewport}
            interactiveLayerIds={['airports']}
            transitionDuration="auto"
            transitionInterpolator={new FlyToInterpolator({ speed: 2 })}
            {...viewport}
        >
            <Source type="geojson" data={flightsGeo as GeoJSON.FeatureCollection<GeoJSON.LineString>}>
                <Layer {...flightStyle} filter={['any', filterFrom, filterTo]} />
            </Source>
            <Source type="geojson" data={airportsGeo as GeoJSON.FeatureCollection<GeoJSON.Point>}>
                <Layer {...airportStyle} />
            </Source>
            {popup && (
                <Popup
                    longitude={popup.geometry.coordinates[0]}
                    latitude={popup.geometry.coordinates[1]}
                >
                    <h3>{popup.properties?.icao} / {popup.properties?.iata}</h3>
                    <p>{popup.properties?.name}</p>
                </Popup>
            )}
        </ReactMapGL>
    );
};

export default MapBox;
