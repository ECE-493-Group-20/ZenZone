import {Marker, MarkerProps} from "@react-google-maps/api"
import { useDashboard } from "../dashboard/dashboardprovider/DashboardProvider"
import "./index.css"

interface CustomMarkerProps {
  id?: string, // location id
  type: 'default' | 'favorite' | 'whereami'
}

const CustomMarker = (props: MarkerProps & CustomMarkerProps) => {
    const { setOpen, setCurrentLocation } = useDashboard()

    const icons : {[key: string]: google.maps.Symbol} = {
      default: {
        path: "m 255.99988,65.480241 a 150,150 0 0 0 -149.99963,150.000149 150,150 0 0 0 33.28582,93.75138 l 95.53009,141.31437 c 11.73588,17.36052 30.63208,17.36051 42.36795,0 L 372.70903,309.23849 A 150,150 0 0 0 406.00002,215.48039 150,150 0 0 0 255.99988,65.480241 Z m 0,75.000069 a 75,75 0 0 1 75.00007,75.00008 75,75 0 0 1 -75.00007,74.99955 75,75 0 0 1 -75.00008,-74.99955 75,75 0 0 1 75.00008,-75.00008 z",
        fillColor: "#383f51",
        fillOpacity: 1,
        anchor: new google.maps.Point(
          512 / 2, // width
          512 // height
        ),
        strokeWeight: 1,
        strokeColor: "#DDDBF1",
        scale: 0.075,
      },
      favorite: {
        path: "m 255.99988,65.480241 c -39.78236,9.8e-5 -77.93556,15.803847 -106.06588,43.934269 -28.13032,28.13042 -43.93379,66.28352 -43.93375,106.06588 0.1073,34.12698 11.84873,67.1974 33.28582,93.75138 l 95.53009,141.31437 c 11.73584,17.36048 30.63213,17.36047 42.36795,0 l 95.52492,-141.30765 c 21.44039,-26.55509 33.18376,-59.62819 33.29099,-93.7581 4e-5,-39.78245 -15.80331,-77.93595 -43.93375,-106.0664 C 333.93584,81.28356 295.78232,65.480202 255.99988,65.480241 Z m 0,75.000069 c 41.42133,-4e-5 75.00011,33.57875 75.00007,75.00008 -2.4e-4,41.42113 -33.57894,74.99959 -75.00007,74.99955 -41.42113,4e-5 -74.99983,-33.57842 -75.00008,-74.99955 -4e-5,-41.42133 33.57875,-75.00012 75.00008,-75.00008 z m -0.5364,11.54865 -18.00769,37.2923 -40.92928,6.30763 29.90256,28.64993 -6.6492,40.87554 36.48821,-19.58589 36.82049,18.95492 -7.35201,-40.75462 29.40544,-29.16049 -41.03212,-5.60225 z",
        fillColor: "#D1BEB0",
        fillOpacity: 1,
        anchor: new google.maps.Point(
          512 / 2, // width
          512 // height
        ),
        strokeWeight: 1,
        strokeColor: "#383F51",
        scale: 0.075,
      },
      whereami: {
        path: "m 255.99988,65.480242 c -39.78232,9.8e-5 -77.93559,15.803875 -106.06588,43.934268 -28.13029,28.13039 -43.93379,66.28356 -43.93375,106.06588 0.1073,34.12694 11.84876,67.19743 33.28582,93.75138 l 95.53009,141.31437 c 11.73583,17.36047 30.63215,17.36046 42.36796,0 l 95.52491,-141.30765 c 21.44037,-26.55506 33.18377,-59.62823 33.291,-93.7581 4e-5,-39.78241 -15.80334,-77.93597 -43.93376,-106.0664 C 333.93587,81.283593 295.78228,65.480203 255.99988,65.480242 Z m 0,75.000078 c 41.42129,-4e-5 75.00011,33.57878 75.00007,75.00007 -2.4e-4,41.42109 -33.57898,74.99959 -75.00007,74.99955 -41.42109,4e-5 -74.99982,-33.57846 -75.00007,-74.99955 -4e-5,-41.42129 33.57878,-75.00011 75.00007,-75.00007 z m 0,11.0727 a 62.5,62.5 0 0 0 -62.49954,62.50007 62.5,62.5 0 0 0 26.32914,50.79638 l -0.0496,0.30489 0.26613,-0.14314 a 62.5,62.5 0 0 0 35.95388,11.54193 62.5,62.5 0 0 0 36.80292,-12.17704 l 0.28577,0.14728 -0.0574,-0.31833 a 62.5,62.5 0 0 0 25.46873,-50.15197 62.5,62.5 0 0 0 -62.50006,-62.50007 z",
        fillColor: "#ff2945",
        fillOpacity: 1,
        anchor: new google.maps.Point(
          512 / 2, // width
          512 // height
        ),
        strokeWeight: 1,
        strokeColor: "#383F51",
        scale: 0.075,
      }
    }
    return <Marker {...props} icon={icons[props.type]} onClick={() => {if (props.type != 'whereami') {setCurrentLocation(props.id || null); setOpen(true); }}}/>
}

export default CustomMarker;