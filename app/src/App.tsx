import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={getMicrophonePermissions}>Microphone</button>
      </header>
    </div>
  );
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission
function getMicrophonePermissions() {
  // Chrome saves this permission and handles the querying as well.
  navigator.mediaDevices
  .getUserMedia({video:false, audio:true})
  .catch((err) => {
    alert("Microphone permissions denied or closed. Please grant microphone permissions to use the microphone.");
    alert(err);
  });
}

export default App;
