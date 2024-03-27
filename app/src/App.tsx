import { Button, IconButton } from '@mui/material';
import './App.css';
import {toggleMicrophone} from './scripts/microphone';
import Logo from './components/logo/Logo';
import Map from './components/map/Map';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './components/searchbar/SearchBar';
import { DashboardProvider } from './components/dashboard/dashboardprovider/DashboardProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import {UserSignIn, UserSignUp, AdminSignIn, AdminSignUp} from './components/authentication/Authentication';
import { CreateLocation } from './components/admin/CreateLocation';

function App() {
  const isAdmin = true;

  /*
  Put this button back when we have a spot for it in the UI.
  <button onClick={toggleMicrophone}>Microphone</button>
  */
  return (
    <>
    <DashboardProvider>
      <div className="App">
        <Logo className="logo"/>
        <SearchBar />
        <Button className='signinButton'>Sign in</Button>
        <Map/>
        {isAdmin ?  <CreateLocation/>: null}
        </div>
    </DashboardProvider>
    </>
  );
}

export default App;
