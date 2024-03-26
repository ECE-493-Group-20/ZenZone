import {getAverage, toggleMicrophone} from './microphone';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Timestamp, getDocs, doc, getDoc, collection, where, query } from 'firebase/firestore';
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
const Locations = db.collection('Locations');
const NoiseLevel = db.collection('NoiseLevel'); 
const BusyLevel = db.collection('BusyLevel');

var recording = false;
var locString = '/Locations/';
var closest = "";
var numDocsSound = 0;
var numDocsBusy = 0;

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

export async function getMicrophoneStats() {
    // Location here should point to an existing location in the firebase
    if (!recording) {
        await toggleMicrophone();
        findCurrentLocation();
        recording = true;
        setTimeout(upload, 15000);
    } else {
        await toggleMicrophone();
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
        submitted: "server",
    }
    // ID for now is milliseconds since epoch plus loudness measure
    let id = (Timestamp.now().toMillis() + audio[0]).toString();
    NoiseLevel.doc(id).set(data);
}

export async function requestAverageSound(location) {
    const compareTimestamp = Timestamp.now().toMillis() - 3600000;  // Timestamp from one hour ago.
    var averageSound = 0;
    numDocsSound = 0;
    var loc = locString.concat(location);

    // Must use collection(...) for queries
    const q = query(collection(db, "NoiseLevel"), where("timestamp", ">", compareTimestamp), where("location", "==", loc));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
        numDocsSound++;
        averageSound += doc.data().loudnessmeasure;
    });
    console.log(numDocsSound);
    if (numDocsSound > 0) {
        averageSound /= numDocsSound;
    }
    console.log("Average sound for last hour at " + loc + ": ", averageSound);
    return averageSound;
}

export async function requestBusyMeasure(location) {
    /* Checks number of submitted sound requests, and busy requests for a given location.
    Averages the user submitted busy measures, then adds estimate based on total number of submitted requests.
    Intuition is that people using the application will make their own reports on sound level and busy measures
    which can be used to estimate current number of individuals in a given location.

    Assumes 20% of people use the application, so multiplies number of reports by 5.
    */
    const compareTimestamp = Timestamp.now().toMillis() - 3600000;  // Timestamp from one hour ago.
    var loc = locString.concat(location);
    var busyLevel = 0;  // Percentage, stored from 0-100 internally
    numDocsBusy = 0;
    if (numDocsSound == 0) {
        await requestAverageSound(location);
    }

    const q = query(collection(db, "BusyLevel"), where("timestamp", ">", compareTimestamp), where("location", "==", loc), where("submitted", "==", "user"));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
        numDocsBusy++;
        busyLevel += doc.data().busymeasure;
    });
    console.log(numDocsBusy);

    if (numDocsBusy > 0) {
        busyLevel /= numDocsBusy;
    }
    console.log("Computed busy level: ", busyLevel);

    // Total user reports. Multiplier explained above.
    var reports = (numDocsSound + numDocsBusy) * 5;
    console.log("Estimated number of users: ", reports);
    const locDoc = doc(db, "Locations", location);
    const locDocSnap = await getDoc(locDoc);
    if (reports > 0 && locDocSnap.exists()) {
        var busyComp = (reports / locDocSnap.data().capacity) * 100;
        // For now, just average user and system levels.
        busyLevel = (busyLevel + busyComp) / 2;
    }

    // Might just be no reason to actually upload this
    /*const data = {
        busymeasure: busyLevel,
        location: locString.concat(closest),
        timestamp: Timestamp.now().toMillis(),
        submitted: "server",
    }

    let id = (Timestamp.now().toMillis() + busyLevel).toString();
    BusyLevel.doc(id).set(data);*/
    console.log("The busy level at " + loc + " is: ", busyLevel, " percent.");
    return busyLevel;
}

export async function getAllLocs(org) {
    console.log(org);
    const q = query(collection(db, "Locations"), where("organization", "==", org));
    const locs = []
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
        locs.push(doc);
    })
    return locs;
}

// Example function for measuring data trends over time.
export async function getTrendAllLocs() {
    // Timestamp from last hour. Function assumed to be called on the hour, to collect the data from the
    // previous hour. The hour, in military time, is used as the index in the trend array.
    const timestamp = Timestamp.now().toMillis();
    var date = new Date(timestamp);
    var ind = date.getHours();  // Firebase seems to be in MST
    if (ind < 0) {
        ind += 24;
    }
    console.log(date);
    console.log(ind);
    var locs = await getAllLocs("University of Alberta");
    locs.forEach((loc) => {
        console.log(loc.id);
        requestAverageSound(loc.id).then((avgSound) => {
            let loudData = loc.data().loudtrend;
            loudData[ind] = avgSound;
            Locations.doc(loc.id).update({loudtrend: loudData});
            requestBusyMeasure(loc.id).then((busyLevel) => {
                let busyData = loc.data().busytrend;
                busyData[ind] = busyLevel;
                Locations.doc(loc.id).update({busytrend: busyData});
            });
        });
    });
}


export async function newLocation(name, org, pos, size, cap, desc) {
    var busy = Array(24).fill(0);
    var loud = Array(24).fill(10);
    const data = {
        name: name,
        organization: org,
        position: pos,
        size: size,
        description: desc,
        capacity: cap,
        busytrend: busy,
        loudtrend: loud
    }
    var id = name.toLowerCase().replaceAll(' ', '');
    Locations.doc(id).set(data);
}