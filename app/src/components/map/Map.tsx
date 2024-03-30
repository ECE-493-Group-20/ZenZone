import { useCallback, useState, memo } from "react"
import {GoogleMap, GoogleMapProps, useJsApiLoader} from "@react-google-maps/api"
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

export const getLocation = (getLoc: (loc: any) => any) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        getLoc([position.coords.latitude, position.coords.longitude]);
      },
      null,
      { enableHighAccuracy: true }
    );
  } else {
    console.log("Geolocation is not available in your browser.");
  }
};


const Map = (props: GoogleMapProps) => {
    const [_, setMap] = useState<google.maps.Map | null>();
    const [locations, setLocations] = useState<LocationData[] | null>(null);
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
    
    const { isLoaded } = useJsApiLoader({
        id: 'test-script',
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY || '', // !!! PROD KEY IS RESTRICTED TO WEBSITE
    });
    // Map centered on ETLC
    const center = {
        lat: position.latitude || 53.52716644287327, 
        lng: position.longitude || -113.5302139343207,
    };

    const onLoad = useCallback((map: google.maps.Map) => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    return isLoaded && locations ? (
        <GoogleMap
            center={center}
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
            {
                // locations ? 
                // locations.map((location) => {
                //     return <CustomMarker position={{lat: 53.53, lng: -113.52,}}/>
                // })
                // : null
            }
            <CustomMarker position={{lat: 53.53, lng: -113.52,}}/>
            <CustomMarker position={{lat: 53, lng: -113,}} favorite/>
        </GoogleMap>
        )
        :
        <div className="map">
            <LinearProgress />
        </div>
}

export default memo(Map);

