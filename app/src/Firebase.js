import {getAverage, toggleMicrophone} from './microphone';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
//import { initializeApp } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1-JnK0jceEmz7_-XqjaLv2qh9qzqBFdg",
    authDomain: "zenzone-90b7a.firebaseapp.com",
    projectId: "zenzone-90b7a",
    storageBucket: "zenzone-90b7a.appspot.com",
    messagingSenderId: "956790020992",
    appId: "1:956790020992:web:fa7a6337be4d0ea911bf65",
    measurementId: "G-VRYF87GJDY"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const locations = db.collection('Locations');
const NoiseLevel = db.collection('NoiseLevel'); 
const busyLevel = db.collection('BusyLevel');

var recording = false;
var loc = '/Locations/etlctest';

export function getStats() {
    // Location here should point to an existing location in the firebase.
    
    if (!recording) {
        recording = true;
        toggleMicrophone();
        setTimeout(upload, 15000);
    }
}

function upload() {
    recording = false;
    var audio = getAverage();
    toggleMicrophone();
    const data = {
        loudnessmeasure: audio[0],
        location: loc,
        time: Timestamp.now(),
    }
    // ID for now is milliseconds since epoch plus loudness measure
    let id = (Timestamp.now().toMillis() + audio[0]).toString();
    NoiseLevel.doc(id).set(data);
}