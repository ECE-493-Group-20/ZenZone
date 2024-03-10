import React from 'react';
import logo from './logo.svg';
import './App.css';
import {getMicrophonePermissions, stopRecording} from './microphone';

// Start of microphone code
// https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
let state: MediaStream | null;
state = null;

function getMicrophone() {
  navigator.mediaDevices
  .getUserMedia({audio:true, video:false})
  .then((str) => {state = str})
  .catch((err) => {
    alert("Microphone permissions denied or closed. Please grant microphone permissions to use the microphone.");
  });
}

function stopMicrophone() {
  state?.getTracks().forEach(track => track.stop());
  state = null;
}

function toggleMicrophone() {
  if (state) {
    stopMicrophone();
  } else {
    getMicrophone();
  }
}
// End of microphone code

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
        <div className='micButton'>
          <button onClick={toggleMicrophone}>Microphone</button>
        </div>
      </header>
    </div>
  );
}

export default App;
