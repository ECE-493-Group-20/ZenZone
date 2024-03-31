import { useCallback, useState, memo } from "react"
import {GoogleMap, GoogleMapProps, HeatmapLayer, Libraries, useJsApiLoader} from "@react-google-maps/api"
import "./index.css"
import { LinearProgress } from "@mui/material";
import CustomMarker from "../marker/Marker"
import { getAllLocs } from "../../scripts/Firebase"
import { GeoPoint } from "firebase/firestore";
import { useEffect } from "react";


interface LocationData {
    busytrend: number[],
    capacity: number,
    description: string,
    loudtrend: number[],
    name: string,
    position: GeoPoint,
    size: string,
}

interface MapProps {
    heatmap: boolean
}


const Map = (props: GoogleMapProps & MapProps) => {
    const [map, setMap] = useState<google.maps.Map | null>();
    const [heatmap, setHeatMap] = useState<google.maps.visualization.HeatmapLayer | null>();
    const [locations, setLocations] = useState<LocationData[] | null>(null);
    const [heatmapData, setHeatMapData] = useState<google.maps.LatLng[]>([]);
    const [position, setPosition] = useState({
      latitude: null as unknown as number,
      longitude: null as unknown as number,
    });

    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
      } else {
        console.log("Geolocation is not available in your browser.");
      }
    }, []);

    useEffect(() => {
        const getLocs = (async() => {
            const locs = await getAllLocs("University of Alberta");
            setLocations(locs.map((doc) => doc.data()));
        });
        getLocs();
    }, [])

    useEffect(() => {
        if (!heatmap) {
            return
        }
        if (props.heatmap && heatmap && map) {
            heatmap.setMap(map)
        } else {
            heatmap.setMap(null)
        }
    }, [props.heatmap, map, heatmap])
    
    const { isLoaded } = useJsApiLoader({
        id: 'test-script',
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY || '', // !!! PROD KEY IS RESTRICTED TO WEBSITE
        libraries: ['visualization'],
    });
    // Map centered on ETLC
    const center = {
        lat: position.latitude || 53.52716644287327, 
        lng: position.longitude || -113.5302139343207,
    };

    const onLoad = useCallback((map: google.maps.Map) => {
        map.setZoom(15)
        map.setCenter(center)
        // TODO: FETCH DATA
        setHeatMapData([
            new window.google.maps.LatLng({lat: 53.52716644287327, lng: -113.5302139343207}),
            new window.google.maps.LatLng({lat: 53.52716644287327, lng: -113.530213907}),
            new window.google.maps.LatLng({lat: 53.52716644287327, lng: -113.53034307}),
            new window.google.maps.LatLng({lat: 53.52716644287327, lng: -113.5302143207}),
        ]);
        setMap(map);
    }, [center]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onHeatMapLoad = useCallback((heatmapLayer: google.maps.visualization.HeatmapLayer) => {
        heatmapLayer.setMap(null)
        setHeatMap(heatmapLayer)
    }, [])

    const onHeatMapUnmount = useCallback((heatmapLayer: google.maps.visualization.HeatmapLayer) => {
        heatmapLayer.setMap(null)
    }, [])

    return isLoaded && locations ? (
        <GoogleMap
            mapContainerClassName="map"        
            onLoad={onLoad}
            onUnmount={onUnmount}   
            zoom={18}
            id="gmap"
            options={{
                disableDefaultUI: true,                
                styles: require("./mapStyle.json"),
            }}
            {...props}
        >
            <CustomMarker position={center} type='whereami'/>
            {
                locations ? 
                locations.map((location, index) => {
                    return <CustomMarker key={index} type='default' position={{lat: location.position.latitude, lng: location.position.longitude}}/>
                })
                : null
            }
            <HeatmapLayer onLoad={onHeatMapLoad} onUnmount={onHeatMapUnmount} data={heatmapData} />
        </GoogleMap>
        )
        :
        <div className="map">
            <LinearProgress />
        </div>
}

export default memo(Map);

