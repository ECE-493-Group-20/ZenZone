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

function App() {
  const isAdmin = true;
  const user = useContext(AuthContext);

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
        {user == null ? <Button className='signinButton'>Sign in</Button>
         : <Button className='signinButton' onClick = {signOut}>Sign Out</Button>}

        {isAdmin ? <IconButton className='addButton'><AddIcon /></IconButton> : null}
        <Map/>
        <Dashboard />
      </div>
    </DashboardProvider>
    </>
  );
}

export default App;
