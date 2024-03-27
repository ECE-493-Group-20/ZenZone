import { Drawer, ToggleButton, Tooltip, Button, IconButton } from "@mui/material"
import { useRef, useEffect } from "react";

import "./index.css"
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer"
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
//import LevelCard from "./LevelCard"
import { AccountBox, Description, GpsFixed, TurnedIn, TurnedInNot } from "@mui/icons-material"
import { useState } from "react"
import { BarPlot, ChartsLegend } from "@mui/x-charts"
import TextField from '@mui/material/TextField';
import Map from '../map/Map';

import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface DashboardProps {
  locationName: string,
  location: string,
  capacity: number,
  description: string,
  busyLevel?: number,
  soundLevel?: number,
}

export const CreateLocation = () => {
    const nameRef = useRef<HTMLInputElement>();
    const descriptionRef = useRef<HTMLInputElement>();
    const capacityRef = useRef<HTMLInputElement>();

    let lat = "Hello";
    let long = "World";

    // used to indicate when the admin user is picking the coordinates of a new location
    const [locationPicker, setLocation] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    //const [favorite, setFavorite] = useState<boolean>(false);
    function openAddLocation () : void {
      setOpen(true);
    }

    const getLocation = async () => {
      if (locationPicker==false) {
        // open location prompt
        setLocation(true);
        // get the location from the map
        
      } else {
        // close location prompt
        setLocation(false);
      }
    }

    const saveLocation = async () => {
      // preform necessary checks and save to firebase
    }

    const closeDrawer = async () => {
      // close the drawer
      setOpen(false);
    }

    return (
      <>
      {open == false ? <IconButton className='addButton' onClick={openAddLocation}><AddIcon /></IconButton> : 
        <Drawer 
          id="createLocation"
          className="drawer" 
          anchor='bottom' 
          open={open} 
          variant = "persistent"
          >
            {locationPicker==true ? <p>{"Click on the map to select the location"}</p> : null}

          <div className="paper">
            <TextField label="Location Name" inputRef = {nameRef}/>
            <div className="description">
              <Button
              onClick={getLocation}>
                <Tooltip title="Location">
                  <GpsFixed />              
                </Tooltip>
              </Button>
              <TextField label="Latitude" disabled={true}>{lat}</TextField>
              <TextField label="Longitude" disabled={true}>{long}</TextField>
              <Tooltip title="Capacity">
                <AccountBox />
              </Tooltip>
              <TextField label="Capacity" inputRef = {capacityRef} type="number"/>
            </div>
            <div className="description">
              <Tooltip title="Description">
                <Description />
              </Tooltip>
              <TextField label="Description" inputRef = {descriptionRef} fullWidth={true}/>
            </div>
            <IconButton className = "saveButton" onClick={saveLocation}><SaveIcon/></IconButton>
            <IconButton className = "closeButton" onClick={closeDrawer}><CloseIcon/></IconButton>
          </div> 
        </Drawer>}
        </>
    )
}
