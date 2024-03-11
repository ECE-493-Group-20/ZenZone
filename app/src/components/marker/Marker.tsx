import {Marker, MarkerProps} from "@react-google-maps/api"
import "./index.css"

const CustomMarker = (props: MarkerProps) => {
    const icon = {
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
    }

    return <Marker {...props} icon={icon} />
}

export default CustomMarker;