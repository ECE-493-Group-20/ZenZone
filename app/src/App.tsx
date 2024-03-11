import './App.css';
import Map from './components/map/Map';
import Logo from './logo.png'

function App() {
  return (
    <div className="App">
      <img className='logo' src={Logo}/>
      <Map />
    </div>
  );
}

export default App;
