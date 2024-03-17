import {getAverage, toggleMicrophone} from './microphone';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
//import { initializeApp } from 'firebase/app';
import { Timestamp, getDocs, collection } from 'firebase/firestore';
import { getLocation } from './pages/Location';

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
//const Locations = db.collection('Locations');
const NoiseLevel = db.collection('NoiseLevel'); 
const BusyLevel = db.collection('BusyLevel');

var recording = false;
var locString = '/Locations/';
var closest = "";

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distanceLatLon(lat1, lon1, lat2, lon2) {
    let earthRad = 6371000;  // radius of earth in m
    let diffLat = degToRad(lat1-lat2);
    let diffLon = degToRad(lon1-lon2);
    let a = Math.sin(diffLat/2) * Math.sin(diffLat/2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(diffLon/2) * Math.sin(diffLon/2);
    return earthRad * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function getStats() {
    // Location here should point to an existing location in the firebase
    getLocation(findLoc);
    if (!recording) {
        recording = true;
        toggleMicrophone();
        setTimeout(upload, 15000);
    }
}

const findLoc = (loc) => {
    console.log(loc);
    // Loc is an array of [lat, lon]. Values below for testing purposes
    loc[0] = 53.52716644287327;
    loc[1] = -113.5302139343207;
    var minDist = 1000000000;
    var dist = 0;
    // https://stackoverflow.com/questions/47227550/using-await-inside-non-async-function
    const getClosest = (async() => { 
        const query = await getDocs(collection(db, "Locations"));
        query.forEach((doc) => {
            dist = distanceLatLon(loc[0], loc[1], doc.data().position.latitude, doc.data().position.longitude);
            if (dist < minDist && dist < doc.data().size) {
                closest = doc.id;
                minDist = dist;
            }
        });
    });
    getClosest();
}

function upload() {
    recording = false;
    var audio = getAverage();
    toggleMicrophone();
    const data = {
        loudnessmeasure: audio[0],
        location: locString.concat(closest),
        time: Timestamp.now(),
    }
    // ID for now is milliseconds since epoch plus loudness measure
    let id = (Timestamp.now().toMillis() + audio[0]).toString();
    NoiseLevel.doc(id).set(data);
}