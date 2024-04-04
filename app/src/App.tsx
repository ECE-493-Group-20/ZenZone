import { Button, IconButton, Modal, ToggleButton } from '@mui/material';
import './App.css';
import Logo from './components/logo/Logo';
import Map from './components/map/Map';
import SearchBar from './components/searchbar/SearchBar';
import { DashboardProvider, useDashboard } from './components/dashboard/dashboardprovider/DashboardProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import { signOut } from './components/authentication/Authentication';
import { useContext } from 'react';
import { AuthContext } from './components/authentication/AuthProvider';
import { Link } from "react-router-dom";
import { auth, db } from "./components/authentication/firebaseSetup";
import {useEffect, useState} from "react";
import Form from './components/form/Form';
import Permissions from './components/permissions/Permissions';
import { AddLocation, Map as MapIcon } from '@mui/icons-material';
import { AdminFeatContext, AdminFeatProvider, useAdminFeat } from './components/admin/AdminFeatProvider';
import { ManageLocation } from './components/admin/ManageLocation';
import { LocationPickerProvider } from './components/map/LocationPickerProvider';
import SearchMap from './components/searchmap/SearchMap';

// Checks if the current user is an admin. Returns true if isAdmin = true and 
// false if isAdmin = false or user is not in table
async function checkIsAdmin(user : any) {
  try {
    const userDoc = await db.collection('UserInformation').doc(user).get();
    if (userDoc.exists && userDoc.data()?.isAdmin) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

function App() {
  const { user, isAdmin, setAdmin }=  useContext(AuthContext);
  const [heatmapToggle, setHeatmapToggle] = useState<boolean>(false)
  const { setOpenAdmin, setLocationId } = useAdminFeat(); 

  /*
  Put this button back when we have a spot for it in the UI.
  <button onClick={toggleMicrophone}>Microphone</button>
  */
  return (
    <>
      <DashboardProvider>
        <LocationPickerProvider>
          <div className="App">
            <Logo className="logo" />
            <SearchMap heatmap={heatmapToggle}></SearchMap>
            {user == null ? (
              <Button className="signinButton" component={Link} to={"/signin"}>
                Sign in
              </Button>
            ) : (
              <Button className="signinButton" onClick={signOut}>
                Sign Out
              </Button>
            )}
            <div className="buttonContainer">
              {isAdmin ? (
                <IconButton className="addButton" onClick={() => { setOpenAdmin(true); setLocationId(null)}}>
                  <AddLocation />
                </IconButton>
              ) : null}
              <ManageLocation/>
            <ToggleButton
                value={heatmapToggle}
                onClick={() => setHeatmapToggle(!heatmapToggle)}
                className="addButton"
              >
                <MapIcon />
              </ToggleButton>
            </div>
            <Permissions />
            <Dashboard />
          </div>
      </LocationPickerProvider>
    </DashboardProvider>
    </>
  );
}

export default App;
