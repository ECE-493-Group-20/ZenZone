import { useCallback, useState, memo, useEffect } from "react"
import {GoogleMap, GoogleMapProps,  useJsApiLoader} from "@react-google-maps/api"
import "./index.css"
import { LinearProgress } from "@mui/material";
import CustomMarker from "../marker/Marker"
import { getAllLocs } from "../../scripts/Firebase"

import { GeoPoint } from 'firebase/firestore';

import { LocationContext } from "./LocationContext";

import { CreateLocation } from "../admin/CreateLocation";

interface coordinates {
    lat : number,
    long: number
}


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

    const [coordinates, clickCoordinates] = useState<coordinates>({lat: 0, long: 0})

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

    // Used to send the coordinates to the create/modify drawer for admin
    const getCoordinates = async (event : any) => {
        console.log(JSON.stringify(event.latLng?.toJSON(), null, 2));
        clickCoordinates({lat : event.latLng?.toJSON().lat, long : event.latLng?.toJSON().lng});
    }


    return isLoaded ? (
        
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

            onClick={getCoordinates}
        >
            <CustomMarker position={{lat: 53.53, lng: -113.52,}} type={'default'}/>
            <CustomMarker position={{lat: 53, lng: -113,}} type={'favorite'}/>
            
            <LocationContext.Provider value={{lat : coordinates.lat, long : coordinates.long}}>
                <CreateLocation/>
            </LocationContext.Provider>

        </GoogleMap>
        )
        :
        <div className="map">
            <LinearProgress />
        </div>
        
        
}

export default memo(Map);

