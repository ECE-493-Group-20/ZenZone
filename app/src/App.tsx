import { Button, IconButton } from '@mui/material';
import './App.css';
import {toggleMicrophone} from './microphone';
import Logo from './components/logo/Logo';
import Map from './components/map/Map';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './components/searchbar/SearchBar';
import { DashboardProvider } from './components/dashboard/dashboardprovider/DashboardProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import {UserSignIn, UserSignUp, AdminSignIn, AdminSignUp, signOut} from './components/authentication/Authentication';
import { useContext } from 'react';
import { AuthContext } from './components/authentication/AuthContext';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { auth, db } from "./components/authentication/firebaseSetup";
import { doc, getDoc } from "firebase/firestore";
import {useEffect, useState} from "react";

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
    <Typography component="h1" variant="h5">
        {user?.email}
      </Typography>
      <div className="App">
        <Logo className="logo"/>
        <SearchBar />
        {user == null ? <Button className='signinButton' component={Link} to={"/signin"}>Sign in</Button>
          : <Button className='signinButton' onClick = {signOut}>Sign Out</Button>}
        {isAdmin ? <IconButton className='addButton'><AddIcon /></IconButton> : null}
        <Dashboard />
      </div>
    </DashboardProvider>
    </>
  );
}

export default App;
