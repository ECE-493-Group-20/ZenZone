import { useCallback, useState } from "react"
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api"
import "./index.css"


const Map = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'test-script',
        googleMapsApiKey: 'AIzaSyAKfLRWwh4RB6-ReDOtr6IXq6ucV9OW7vc', // !!! PROD KEY IS RESTRICTED TO WEBSITE
    });
    
    const center = {
    lat: -3.745,
    lng: -38.523
    };

    const [map, setMap] = useState<google.maps.Map | null>();

    const onLoad = useCallback((map: any) => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

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
            zoom={10}
        >
            
        </GoogleMap>
        )
        :
        <></>
}

export default Map;

