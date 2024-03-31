import { Drawer, ToggleButton, Tooltip, Button, IconButton, Box} from "@mui/material"
import { useRef, useEffect, useContext } from "react";

import "./index.css"
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer"
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
//import LevelCard from "./LevelCard"
import { AccountBox, Description, GpsFixed, TurnedIn, TurnedInNot, WidthFull } from "@mui/icons-material"
import { useState } from "react"
import { BarPlot, ChartsLegend } from "@mui/x-charts"
import TextField from '@mui/material/TextField';
import Map from '../map/Map';
// Button Icons
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
// Firebase functions
import { newLocation } from '../../scripts/Firebase'
import { GeoPoint } from "firebase/firestore";

import { LocationContext } from "../map/LocationContext";
import { useAdminFeat } from "./AdminFeatProvider";


interface adminProps {
  locationName?: string,
  lat?: string | null,
  long?: string | null,
  capacity?: number,
  description?: string,
  busyLevel?: number,
  soundLevel?: number,
}

export const CreateLocation = (props : adminProps) => {
    const nameRef = useRef<HTMLInputElement>();
    const descriptionRef = useRef<HTMLInputElement>();
    const capacityRef = useRef<HTMLInputElement>();
    const sizeRef = useRef<HTMLInputElement>();
    const orgRef = useRef<HTMLInputElement>();

    // used to get the location clicked on the map
    const locationContext = useContext(LocationContext);

    // used to indicate when the admin user is picking the coordinates of a new location
    const [locationPicker, setLocation] = useState<boolean>(false);
  
    // used to open/close the drawer
    const{open, setOpen} = useAdminFeat();  

    //const [favorite, setFavorite] = useState<boolean>(false);
    function openAddLocation () : void {
      setOpen(true);
    }

    const getLocation = async () => {
      if (locationPicker==false) {
        // open location prompt
        setLocation(true);
        // get the location from the map
        console.log("recieved coordinates");
        console.log(locationContext.lat);
        console.log(locationContext.long);
      } else {
        // close location prompt
        setLocation(false);
      }
    }

    const saveLocation = async () => {
      // preform necessary checks and save to firebase
      const position = new GeoPoint(locationContext.lat, locationContext.long);
      newLocation(nameRef.current!.value, orgRef.current!.value, position, sizeRef.current!.value, capacityRef.current!.value, descriptionRef.current!.value);
      // display error message if location already exits in map
    }

    const closeDrawer = async () => {
      // close the drawer
      setOpen(false);
    }

    return (
      <>
      {open == false ? <IconButton  onClick={openAddLocation}><AddIcon /></IconButton> : 
        <Drawer 
          id="createLocation"
          className="drawer" 
          anchor='bottom' 
          open={open} 
          variant = "persistent"
          >
            {locationPicker==true ? <p>{"Click on the map to select the location"}</p> : null}

          <div className="paper">
            <Box sx={{width: 1/2, p:1}}>
            <TextField label="Location Name" inputRef = {nameRef} required={true} fullWidth={true}/>
            </Box>
            <Box sx={{width: 1/2, p:1}}>
            <TextField label="Organization" inputRef = {orgRef} defaultValue={"University of Alberta"} fullWidth={true}/>
            </Box>
            <div className="description">
              <Button
              onClick={getLocation}>
                <Tooltip title="Location">
                  <GpsFixed />              
                </Tooltip>
              </Button>
              <TextField id="Latitude" label="Laitiude" value={locationContext.lat}/>
              <TextField id="Longitude" label="Longitiude" value={locationContext.long}/>
              <Tooltip title="Capacity">
                <AccountBox />
              </Tooltip>
              <TextField label="Capacity" inputRef = {capacityRef} type="number"/>
              <TextField label="Size" inputRef = {sizeRef} type="number"/>
            </div>
            <div className="description">
              <Tooltip title="Description">
                <Description />
              </Tooltip>
              <TextField label="Description" inputRef = {descriptionRef} fullWidth={true} />
            </div>
            <IconButton className = "saveButton" onClick={saveLocation}><SaveIcon/></IconButton>
            <IconButton className = "closeButton" onClick={closeDrawer}><CloseIcon/></IconButton>
          </div> 
        </Drawer>}
        </>
    )
}
