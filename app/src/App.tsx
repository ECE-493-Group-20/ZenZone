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


function App() {
  const { user, userInfo }=  useContext(AuthContext);
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
            <SearchMap heatmap={heatmapToggle} />
            {user == null ? (
              <Button id="signInButton" className="signinButton" component={Link} to={"/signin"}>
                Sign in
              </Button>
            ) : (
              <Button id="signOutButton" className="signinButton" onClick={signOut}>
                Sign Out
              </Button>
            )}
            <div className="buttonContainer">
              {userInfo && userInfo.isAdmin ? (
                <IconButton id="addLocationButton" className="addButton" onClick={() => { setOpenAdmin(true); setLocationId(null)}}>
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
