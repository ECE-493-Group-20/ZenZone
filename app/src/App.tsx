import { Button, IconButton } from '@mui/material';
import './App.css';
import { getMicrophoneStats, requestAverageSound, getTrendAllLocs, tester } from './scripts/Firebase';
import {toggleMicrophone} from './scripts/microphone';
import Logo from './components/logo/Logo';
import Map from './components/map/Map';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './components/searchbar/SearchBar';
import { DashboardProvider } from './components/dashboard/dashboardprovider/DashboardProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import {UserSignIn, UserSignUp, AdminSignUp, signOut} from './components/authentication/Authentication';
import { useContext } from 'react';
import { AuthContext } from './components/authentication/AuthContext';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { auth, db } from "./components/authentication/firebaseSetup";
import { doc, getDoc } from "firebase/firestore";
import {useEffect, useState} from "react";
import Permissions from './components/permissions/Permissions';

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
  const user =  useContext(AuthContext);

  // Used to show/hide the "plus" button depending if the user is an admin
  const [isAdmin, setShowAdminButton] = useState(false);
  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdmin = await checkIsAdmin(user?.uid);
      setShowAdminButton(isAdmin);
    };

    checkAdminStatus();
  }, [user]);
  
  /*
  Put this button back when we have a spot for it in the UI.
  <button onClick={toggleMicrophone}>Microphone</button>
  */
  return (
    <>
    <DashboardProvider>
      <div className="App">
        <Logo className="logo" />
        <SearchBar />
        <Button className='microphoneButton' onClick={() => {tester(user?.uid)}}>All Test</Button>
        {user == null ? <Button className='signinButton' component={Link} to={"/signin"}>Sign in</Button>
          : <Button className='signinButton' onClick = {signOut}>Sign Out</Button>}
        {isAdmin ? <IconButton className='addButton'><AddIcon /></IconButton> : null}
        <Map/>
        <Permissions />
        <Dashboard locationName="ELTC" location='53.527172826716836, -113.53013883407911' capacity={50} description="it's a place!" />
      </div>
    </DashboardProvider>
    </>
  );
}

export default App;
