import { createContext, useContext, useCallback, useState, memo, useMemo, useEffect } from "react"
import {GoogleMap, GoogleMapProps, HeatmapLayer, Libraries, useJsApiLoader} from "@react-google-maps/api"
import "./index.css"
import { LinearProgress } from "@mui/material";
import CustomMarker from "../marker/Marker"
import { getAllLocs } from "../../scripts/Firebase"

import { GeoPoint } from 'firebase/firestore';

import { useLocationPicker } from "./LocationPickerProvider";
import { useDashboard } from "../dashboard/dashboardprovider/DashboardProvider";

import { useAuth } from "../authentication/AuthProvider";

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

interface HeatmapProps {
  refreshHeatmap: boolean
  setRefreshHeatmap: React.Dispatch<React.SetStateAction<boolean>>
}

const HeatmapContext = createContext<any>({})

interface MapProps {
  heatmap: boolean;
  handleItemClick: (itemId: string) => Promise<void>;
  position: {
    latitude: number;
    longitude: number;
  };
  map: google.maps.Map;
  setMap: React.Dispatch<
    React.SetStateAction<google.maps.Map | null | undefined>
  >;
}


const Map = (props: GoogleMapProps & MapProps) => {

    const { setCoordinates } = useLocationPicker();
    
    const [heatmap, setHeatMap] = useState<google.maps.visualization.HeatmapLayer | null>();
    const [heatmapData, setHeatMapData] = useState<google.maps.visualization.WeightedLocation[]>([]);
    const [heatmapOps, setHeatMapOps] = useState<google.maps.visualization.HeatmapLayerOptions>();
    const [refreshHeatmap, setRefreshHeatmap] = useState<boolean>(true);
    const [position, setPosition] = useState({
      latitude: null as unknown as number,
      longitude: null as unknown as number,
    });
    const {locations, currentLocation, isLocations} = useDashboard();
    const map = props.map;

    // Favourite locations
    const { favouriteLocations } = useAuth();

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
        if (!heatmap) {
            return
        }
        if (props.heatmap && heatmap && map) {
            heatmap.setMap(map)
        } else {
            heatmap.setMap(null)
        }
    }, [props.heatmap, map, heatmap])
    
    // used to prevent loaded libraries
    const libraries = useMemo(() => {
      return ['visualization']
    }, [])
    
    const { isLoaded } = useJsApiLoader({
        id: 'test-script',
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY || '', // !!! PROD KEY IS RESTRICTED TO WEBSITE
        libraries: libraries as Libraries,
    });

    const center = useMemo(() => {
      return {
        lat: position.latitude || 53.52716644287327,
        lng: position.longitude || -113.5302139343207,
      };
    }, [position]);

    const onLoad = useCallback((map: google.maps.Map) => {
        map.setZoom(15)
        map.setCenter(center)
        // Weight of > 1 doesn't seem to affect anything. Lower than 0.3 does not proivde noticiable differences.
        // So, weight of a point is just the busyness level divided by one hundred.
        var data = []
        for (let id in locations) {
          let weight = locations[id].busytrend[(new Date()).getHours()] / 100;
          data.push({location: new window.google.maps.LatLng({lat: locations[id].position.latitude, lng: locations[id].position.longitude}), weight: weight})
        }
        setHeatMapData(data);
        setHeatMapOps({radius: 50});
        props.setMap(map);
    }, [center]);

    useEffect(() => {
      // Weight of > 1 doesn't seem to affect anything. Lower than 0.3 does not proivde noticiable differences.
      // Weight of 0 is the same as a weight of greater than one, so these are clamped at 0.1.
      // So, weight of a point is just the busyness level divided by one hundred.
      var data = []
      for (let id in locations) {
        let weight = locations[id].busytrend[(new Date()).getHours()] / 100.0;
        if (weight == 0) { weight = 0.1; }
        data.push({location: new window.google.maps.LatLng({lat: locations[id].position.latitude, lng: locations[id].position.longitude}), weight: weight})
      }
      setHeatMapData(data);
      setHeatMapOps({radius: 50});
      setTimeout(heatmapCallback, 3000);
    }, [refreshHeatmap])

    function heatmapCallback() {
      setRefreshHeatmap(!refreshHeatmap);
    }

    const onUnmount = useCallback(() => {
        props.setMap(null);
    }, []);

    const onHeatMapLoad = useCallback((heatmapLayer: google.maps.visualization.HeatmapLayer) => {
      heatmapLayer.setMap(null)
      setHeatMap(heatmapLayer)
  }, [heatmapData])

  const onHeatMapUnmount = useCallback((heatmapLayer: google.maps.visualization.HeatmapLayer) => {
      heatmapLayer.setMap(null)
  }, [])

    // Used to send the coordinates to the create/modify drawer for admin
    const getCoordinates = async (event : any) => {
        console.log(JSON.stringify(event.latLng?.toJSON(), null, 2));
        setCoordinates({lat : event.latLng?.toJSON().lat, long : event.latLng?.toJSON().lng});
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
            <CustomMarker position={center} type='whereami'/>
            {
                isLocations ? 
                Object.values(locations).map((location, index) => {
                  // console.log(location)
                  // console.log(location.id);
                  if (favouriteLocations != null && favouriteLocations.includes(location.id)) {
                    return <CustomMarker key={index} id={location.id} type='favorite' position={{lat: location.position.latitude, lng: location.position.longitude}}/>
                  } else {
                    return <CustomMarker key={index} id={location.id} type='default' position={{lat: location.position.latitude, lng: location.position.longitude}}/>
                  }
                })
                : null
            }
            <HeatmapLayer onLoad={onHeatMapLoad} onUnmount={onHeatMapUnmount} data={heatmapData} options={heatmapOps}/>

        </GoogleMap>
        )
        :
        <div className="map">
            <LinearProgress />
        </div>
        
        
}

export default memo(Map);

export const useHeatmap = () => {
  return useContext<HeatmapProps>(HeatmapContext);
}