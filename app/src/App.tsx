import { Button, IconButton } from '@mui/material';
import './App.css';
import { getStats, requestAverageSound } from './scripts/Firebase';
import Logo from './components/logo/Logo';
import Map from './components/map/Map';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './components/searchbar/SearchBar';
import { DashboardProvider } from './components/dashboard/dashboardprovider/DashboardProvider';
import { Dashboard } from './components/dashboard/Dashboard';

export function Main() {
  const isAdmin = true
  /*
  Put this button back when we have a spot for it in the UI.
  <button onClick={toggleMicrophone}>Microphone</button>
  */
  return (
    <DashboardProvider>
      <div className="App">
        <Logo className="logo" />
        <SearchBar />
        <Button className='signinButton'>Sign in</Button>
        <Button className='microphoneButton' onClick={getStats}>Upload Stats</Button>
        <Button className='averageButton' onClick={requestAverageSound}>Average Sound</Button>
        {isAdmin ? <IconButton className='addButton'><AddIcon /></IconButton> : null}
        <Map/>
        <Dashboard />
      </div>
    </DashboardProvider>
  );
}

export default Main;
