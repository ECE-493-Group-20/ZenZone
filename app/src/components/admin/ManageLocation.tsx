/**
 * FR14 - Admin.CreateLocation
 * FR14 - Admin.UpdateLocation
 */
import { Drawer, Tooltip, IconButton, Box} from "@mui/material"
import { useRef } from "react";

import "./index.css"
import { AccountBox, Description, GpsFixed, TurnedIn, TurnedInNot, WidthFull } from "@mui/icons-material"
import TextField from '@mui/material/TextField';
// Button Icons
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
// Firebase functions
import { newLocation, updateLocation } from '../../scripts/Firebase'
import { GeoPoint } from "firebase/firestore";

import { useLocationPicker } from "../map/LocationPickerProvider";
import { useAdminFeat } from "./AdminFeatProvider";
import { useDashboard } from "../dashboard/dashboardprovider/DashboardProvider";


export const ManageLocation = () => {
    const nameRef = useRef<HTMLInputElement>();
    const descriptionRef = useRef<HTMLInputElement>();
    const capacityRef = useRef<HTMLInputElement>();
    const sizeRef = useRef<HTMLInputElement>();
    const orgRef = useRef<HTMLInputElement>();
    const floorRef = useRef<HTMLInputElement>();

    // used to get the location clicked on the map
    const { coordinates } = useLocationPicker();

    // used to open/close the drawer
    const{open, setOpenAdmin, locationId} = useAdminFeat();  

    // reuse location information from DashboardProvider
    const { locations } = useDashboard();
    const data = locations[locationId || ''];

    const saveLocation = async () => {
      // Creating a new location
      if (locationId == null) {
      // preform necessary checks and save to firebase
        const position = new GeoPoint(coordinates.lat, coordinates.long);
        const result = await newLocation(nameRef.current!.value, orgRef.current!.value, position, Number.parseInt(sizeRef.current!.value), Number.parseInt(capacityRef.current!.value), descriptionRef.current!.value, floorRef.current!.value);


        // display error message if location already exits in map
        if (!result) {
          alert("This location already exists.");
        }
      }
      // modifying a location
      else {
        const position = new GeoPoint(coordinates.lat, coordinates.long);
        const result = updateLocation(locationId, nameRef.current!.value, orgRef.current!.value, position, Number.parseInt(sizeRef.current!.value), Number.parseInt(capacityRef.current!.value), descriptionRef.current!.value, floorRef.current!.value);

        
        if (!result) {
          alert("Error saving location information");
        }
      }
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
            <TextField label="Location Name" inputRef = {nameRef} required={true} fullWidth={true} defaultValue={data?.name}/>
            </Box>
            <Box sx={{width: 1/2, p:1}}>
            <TextField label="Organization" inputRef = {orgRef} defaultValue={"University of Alberta"} fullWidth={true}/>
            </Box>
            <div className="description">
                <Tooltip title="Location">
                  <GpsFixed />              
                </Tooltip>
              <TextField id="Latitude" label="Latitude" value={coordinates.lat} />
              <TextField id="Longitude" label="Longitiude" value={coordinates.long} />
              <Tooltip title="Capacity">
                <AccountBox />
              </Tooltip>
              <TextField label="Capacity" inputRef = {capacityRef} type="number" defaultValue={data?.capacity}/>
              <TextField label="Size" inputRef = {sizeRef} type="number" defaultValue={data?.size}/>
            </div>
            <div className="description">
              <Tooltip title="Description">
                <Description />
              </Tooltip>
              <TextField label="Description" inputRef = {descriptionRef} fullWidth={true} defaultValue={data?.description}/>
            </div>
            <div className="description">
              <Tooltip title="Floors">
                <Description />
              </Tooltip>
              <TextField label="Floors" inputRef = {floorRef} fullWidth={true} defaultValue={data?.floors}/>
            </div>
            <IconButton className = "saveButton" onClick={saveLocation}><SaveIcon/></IconButton>
            <IconButton className = "closeButton" onClick={closeDrawer}><CloseIcon/></IconButton>
          </div> 
        </Drawer>
        : null}
        </>
    )
}
