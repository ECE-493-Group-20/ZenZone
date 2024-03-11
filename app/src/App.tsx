import { Button, Drawer, IconButton } from '@mui/material';
import './App.css';
import Logo from './components/logo/Logo';
import Map from './components/map/Map';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './components/searchbar/SearchBar';
import { useState } from 'react';
import { DashboardProvider } from './components/dashboard/dashboardprovider/DashboardProvider';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  const isAdmin = true

  return (
    <DashboardProvider>
      <div className="App">
        <Logo className="logo"/>
        <SearchBar />
        <Button className='signinButton'>Sign in</Button>
        {isAdmin ? <IconButton className='addButton'><AddIcon /></IconButton> : null}
        <Map/>
        <Dashboard />
      </div>
    </DashboardProvider>
  );
}

export default App;
