import {getAverage, toggleMicrophone} from './microphone';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Timestamp, getDocs, collection, where, query } from 'firebase/firestore';
import { getLocation } from '../pages/Location';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRESTORE_KEY,
    authDomain: "zenzone-90b7a.firebaseapp.com",
    projectId: "zenzone-90b7a",
    storageBucket: "zenzone-90b7a.appspot.com",
    messagingSenderId: "956790020992",
    appId: process.env.REACT_APP_FIRESTORE_ID,
    measurementId: "G-VRYF87GJDY"
};
// https://stackoverflow.com/questions/43331011/firebase-app-named-default-already-exists-app-duplicate-app
var app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}
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

export function getMicrophoneStats() {
    // Location here should point to an existing location in the firebase
    if (!recording) {
        findCurrentLocation();
        toggleMicrophone();
        recording = true;
        setTimeout(upload, 15000);
    } else {
        toggleMicrophone();
        recording = false;
    }
}

export function findCurrentLocation() {
    getLocation(findLoc);
}

const findLoc = (loc) => {
    console.log(loc);
    // Loc is an array of [lat, lon]. Values below for testing purposes
    //loc[0] = 53.52716644287327;
    //loc[1] = -113.5302139343207;
    var minDist = 1000000000;
    var dist = 0;
    // https://stackoverflow.com/questions/47227550/using-await-inside-non-async-function
    const getClosest = (async() => { 
        const queryColl = await getDocs(collection(db, "Locations"));
        queryColl.forEach((doc) => {
            dist = distanceLatLon(loc[0], loc[1], doc.data().position.latitude, doc.data().position.longitude);
            console.log(dist);
            console.log(doc.data().name);
            if (dist < minDist && dist < doc.data().size) {
                closest = doc.id;
                minDist = dist;
            }
        });
    });
    getClosest();
}

export function upload() {
    var audio = getAverage();
    const data = {
        loudnessmeasure: audio[0],
        location: locString.concat(closest),
        timestamp: Timestamp.now().toMillis(),
    }
    // ID for now is milliseconds since epoch plus loudness measure
    let id = (Timestamp.now().toMillis() + audio[0]).toString();
    NoiseLevel.doc(id).set(data);
}

export async function requestAverageSound(loc) {
    const compareTimestamp = Timestamp.now().toMillis() - 3600000;  // Timestamp from one hour ago.
    var averageSound = 0;
    var numDocs = 0;

    // For debugging only. This should be replaced with just calling from a given locations "card"
    if (closest == "") {
        getLocation(findLoc);
    }
    loc = locString.concat(closest);

    // Must use collection(...) for queries
    const q = query(collection(db, "NoiseLevel"), where("timestamp", ">", compareTimestamp), where("location", "==", loc));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
        numDocs++;
        averageSound += doc.data().loudnessmeasure;
    });
    console.log(numDocs);
    if (numDocs > 0) {
        averageSound /= numDocs;
    }
    console.log("Average sound for last hour at " + loc + ": ", averageSound);
    return averageSound;
}