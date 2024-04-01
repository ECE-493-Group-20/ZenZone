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
// Firebase functions
import { newLocation } from '../../scripts/Firebase'
import { GeoPoint } from "firebase/firestore";

import { useLocationPicker } from "../map/LocationPickerProvider";
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

export const ManageLocation = (props : adminProps) => {
    const nameRef = useRef<HTMLInputElement>();
    const descriptionRef = useRef<HTMLInputElement>();
    const capacityRef = useRef<HTMLInputElement>();
    const sizeRef = useRef<HTMLInputElement>();
    const orgRef = useRef<HTMLInputElement>();

    // used to get the location clicked on the map
    const { coordinates} = useLocationPicker();

    // used to open/close the drawer
    const{open, setOpenAdmin, locationId} = useAdminFeat();  

    const saveLocation = async () => {
      // preform necessary checks and save to firebase
      const position = new GeoPoint(coordinates.lat, coordinates.long);
      newLocation(nameRef.current!.value, orgRef.current!.value, position, sizeRef.current!.value, capacityRef.current!.value, descriptionRef.current!.value);
      // display error message if location already exits in map
    }

    const closeDrawer = async () => {
      // close the drawer
      setOpenAdmin(false);
    }

    return (
      <>
      {open?
        <Drawer 
          id="createLocation"
          className="drawer" 
          anchor='bottom' 
          open={open} 
          variant = "persistent"
          >
          <div className="paper">
            <Box sx={{width: 1/2, p:1}}>
            <TextField label="Location Name" inputRef = {nameRef} required={true} fullWidth={true}/>
            </Box>
            <Box sx={{width: 1/2, p:1}}>
            <TextField label="Organization" inputRef = {orgRef} defaultValue={"University of Alberta"} fullWidth={true}/>
            </Box>
            <div className="description">
                <Tooltip title="Location">
                  <GpsFixed />              
                </Tooltip>
              <TextField id="Latitude" label="Laitiude" value={coordinates.lat}/>
              <TextField id="Longitude" label="Longitiude" value={coordinates.long}/>
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
        </Drawer>
        : null}
        </>
    )
}
