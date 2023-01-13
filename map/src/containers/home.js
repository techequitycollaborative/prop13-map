import React, {useState, useRef, useEffect} from 'react'
import "../styles/main.css"
import "../styles/home.css"
import * as pmtiles from "pmtiles";



// eslint-disable-next-line import/no-webpack-loader-syntax
// import mapboxgl from "mapbox-gl";
import maplibregl from "maplibre-gl"
let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);



const server = process.env.REACT_APP_SERVER_URL;
const fetchString = 'server/fetchMarkers';
// const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
// mapboxgl.accessToken = token;


const Home = () => {
    // reference for the map object
    const mapRef = useRef(null);
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);

    // utils
    function featureCollection(data){
        return {
            "type": "FeatureCollection",
            "features": data
        }
    }

    function setDataOrAddSourceJSON(theMap, sourceID, data, sourceOptions){
        let src = theMap.getSource(sourceID);
        if (src && data){
            src.setData(featureCollection(data))
        } else {
            theMap.addSource(sourceID, {

                type: "geojson",
                data: featureCollection(data ? data : []),
                ...sourceOptions
            })
        }

    }

    function initClusterLayers(map){
        console.log('initClusters')
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'parcels',
            'source-layer': 'prop13',
            // filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#bfddff',
                    100,
                    '#a3d6ff',
                    750,
                    '#78c2ff'
                ],
                'circle-opacity': 0.6,
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });
         
        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'parcels',
            'source-layer': 'prop13',
            filter: ['has', 'point_count'],
            paint: {
                'text-color': '#555'
            },
            layout: {
                // 'text-field': [
                //     'number-format',
                //     ['get', 'sum'],
                //     {'currency': 'usd', 'max-fraction-digits': 0}
                // ],
                'text-field': '{point_count_abbreviated}',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });
         
        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'parcels',
            'source-layer': 'prop13',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': [
                    "rgb",
                    255,
                    ['-', 255, ['get', 'color']],
                    ['-', 255, ['get', 'color']]
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#777',
                'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    12, 2,
                    20, 8
                ]
            }
        });
         
        // inspect a cluster on click
        map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: map.getZoom() + 2,
              });
            // const clusterId = features[0].properties.cluster_id;
            // map.getSource('parcels').getClusterExpansionZoom(
            //     clusterId,
            //     (err, zoom) => {
            //         if (err) return;
            //         map.easeTo({
            //             center: features[0].geometry.coordinates,
            //             zoom: zoom+2
            //         });
            //     }
            // );
        });
         
        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const address = e.features[0].properties.address;
            const sqft = e.features[0].properties.sqft;
            const recorded_value = e.features[0].properties.recorded_value;
            const estimated_value = e.features[0].properties.estimated_value;
            const subsidy = e.features[0].properties.subsidy_formatted;
            // const subsidy_sqft = e.features[0].properties.subsidy_sqft;
            const prop_size = getPropSize(parseInt(sqft));

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }    
            new maplibregl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<p class='popup-address'>${address}</p>
                        <p>Property size: ${sqft.toLocaleString('en-US')} sqft (${prop_size})</p>
                        <p>Estimated value: ${estimated_value}</p>
                        <p>Assessed value: ${recorded_value}</p>
                        <p>Estimated subsidy: ${subsidy} / year</p>`)
                .addTo(map);
        });
         
        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'unclustered-point', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'unclustered-point', () => {
            map.getCanvas().style.cursor = '';
        });
 
    }

    // function formatResponse(data) {
    //     // console.log('formatResponse', data)
    //     return {
    //         "features": data['results'].map(item => {
    //             const recorded_value = parseFloat(item.recorded_value.replace(/[$,]/g, '')); //TODO fix db to have this preformatted
    //             const estimated_value = Math.round(parseFloat(item.estimated_value.replace(/[$,]/g, '')) / 1000) * 1000;
    //             const subsidy_total = Math.max((estimated_value - recorded_value) / 100.0, 0); // Based on 1% property tax
    //             const subsidy_sqft = subsidy_total / parseFloat(item.sqft);
    //             var formatter = new Intl.NumberFormat('en-US', {
    //                 style: 'currency',
    //                 currency: 'USD',
    //                 maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    //             });

    //             return {
    //                 "type": "Feature",
    //                 "geometry": {
    //                     "type": "Point",
    //                     "coordinates": [item.long, item.lat]
    //                 },
    //                 "properties": {
    //                     "id": item.prop_id,
    //                     "recorded_value": formatter.format(recorded_value), 
    //                     "estimated_value": formatter.format(estimated_value),
    //                     "subsidy": subsidy_total,
    //                     "subsidy_formatted": formatter.format(subsidy_total),
    //                     "subsidy_sqft": formatter.format(subsidy_sqft),
    //                     "color": Math.min((subsidy_sqft / 5) * 255, 255),
    //                     "zipcode": item.zipcode,
    //                     "sqft": item.sqft,
    //                     "address": item.address
    //                 }
    //             };
    //         })
    //     };
    // }

    function getPropSize(sqft) {
        let prop_size;
        if (sqft <= 3000)
            prop_size = 'small';
        else if (sqft > 3000 && sqft <= 15000)
            prop_size = 'medium';
        else if (sqft > 15000 && sqft <= 100000)
            prop_size = 'large';
        else prop_size = 'huge';

        return prop_size;
    }

    // do things to markers later
    // useEffect(() => {
    //     console.log("markers effect");
    //     const map = mapRef.current;
    //     map && (console.log(map.getSource('parcels')))
    //     //mapRef.current.getSource('parcels').setData(markers) 
    //     //const source = mapRef.current.getSource('parcels');
    //     //console.log(source);
        
    // }, [markers])

    useEffect(() => {
        // async function getMarkers() {
        //     console.log('get markers')
        //     let data = await fetchMarkers();
        //     await setMarkers(data);
        //     // mapRef.current.addSource('parcels', {
        //     //     type: "geojson",
        //     //     data: featureCollection(data),
        //     //     cluster: true,
        //     //     clusterMaxZoom: 13, // Max zoom to cluster points on
        //     //     clusterRadius: 100, // Radius of each cluster when clustering points (defaults to 50)
        //     //     clusterProperties: {'sum': ['+', ['get', 'subsidy']]}
        //     // })
            
        // }
        // const fetchMarkers = async () => {
        //     try {
        //         const response = await fetch(server + fetchString, {
        //             headers : {
        //                 'Content-Type': 'application/json',
        //                 'Accept': 'application/json'
        //             }
        //         });
        //         const data = await response.json();
        //         return formatResponse(data);
        //     } catch (err) {
        //         console.log(err.message);
        //     }
        // }
        function renderMap() {
            console.log('render map')
            if (mapRef.current) {
                console.log('map already initialized')
                return 
            }

            mapRef.current = new maplibregl.Map({
                container: mapContainer.current,
                // See style options here: https://docs.mapbox.com/api/maps/#styles
                // style: 'mapbox://styles/mapbox/light-v10?optimize=true',
                style: 'https://demotiles.maplibre.org/style.json',
                center: [-118.2437, 34.0522],
                zoom: 10,
            });

            const map = mapRef.current;
            map.on('load', () => {
                map.resize()
                console.log("map loaded")
                map.addSource("parcels", {
                    "type":"vector",
                    "url":"pmtiles://prop13.pmtiles"
                })
                initClusterLayers(map)
            
            });
            map.addControl(new maplibregl.NavigationControl(), 'top-right');

            // clean up on unmount
            return () => map.remove();
        }
        
        renderMap();
    }, []);

    return (
        <div className="home">
            <div className="map">
                <div className="map-container" ref={mapContainer}/>
            </div>
        </div>)
}

export default Home;