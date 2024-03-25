import { useCallback, useState, memo } from "react"
import {GoogleMap, GoogleMapProps, useJsApiLoader} from "@react-google-maps/api"
import "./index.css"
import { LinearProgress } from "@mui/material";
import CustomMarker from "../marker/Marker"
import { getAllLocs } from "../../scripts/Firebase"


const Map = (props: GoogleMapProps) => {
    const { isLoaded } = useJsApiLoader({
        id: 'test-script',
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY || '', // !!! PROD KEY IS RESTRICTED TO WEBSITE
    });
    // Map centered on ETLC
    const center = {
        lat: 53.52716644287327,
        lng: -113.5302139343207,
    };

    const [_, setMap] = useState<google.maps.Map | null>();

    const onLoad = useCallback((map: google.maps.Map) => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        const getLocs = (async() => { 
            const locs = await getAllLocs("University of Alberta");
            locs.forEach((doc) => {
                console.log(doc);  // Actually make a new marker here. List of firebase documents is returned
            });
        });
        getLocs();
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    return isLoaded ? (
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

