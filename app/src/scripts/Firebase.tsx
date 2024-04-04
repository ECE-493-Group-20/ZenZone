/*
This file primarily covers FR20 and FR21, however also covers all non-authentication database actions. This includes
getting locations for FR7, sending data for FR10 and FR11, storing and updating locations for FR14 and FR15, and
getting all location data for FR17, FR18 and FR19.
*/

import {getAverage, toggleMicrophone} from './microphone';
import firebase from 'firebase/compat/app';
import { Timestamp, getDocs, doc, getDoc, collection, where, query, deleteDoc, GeoPoint, onSnapshot} from 'firebase/firestore';
import 'firebase/compat/firestore';


/* -------- INTERFACES ----------------- */


export interface BusyLevelData {
    id: string;
    busymeasure: number;
    location: string;
    submitted: string;
    timestamp: EpochTimeStamp;
}

export interface NoiseLevelData {
    id: string;
    location: string;
    loudnessmeasure: string;
    timestamp: EpochTimeStamp;
}

export interface LocationData {
    id: string;
    busytrend: number[];
    capacity: number;
    description: string;
    loudtrend: number[];
    name: string;
    organization: string;
    position: GeoPoint;
    size: number;
}

export interface UserInformationData {
    id: string;
    favourites: string[];
    isAdmin: boolean;
}

/* ------------------------------------- */

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
const Users = db.collection('UserInformation');

var recording = false;
var locString = '/Locations/';
var closest = "";
var numDocsSound = 0;
var numDocsBusy = 0;

// Helper function to reduce code copying
function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}

// Calculates distance between two (lat, lon) points
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distanceLatLon(lat1: number, lon1: number, lat2: number, lon2: number) {
    let earthRad = 6371000;  // radius of earth in m
    let diffLat = degToRad(lat1-lat2);
    let diffLon = degToRad(lon1-lon2);
    let a = Math.sin(diffLat/2) * Math.sin(diffLat/2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(diffLon/2) * Math.sin(diffLon/2);
    return earthRad * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Gets 
export async function getMicrophoneStats() {
    if (!recording) {
        // Await microphone to ensure permissions are requested separately
        await toggleMicrophone();
        //findCurrentLocation();
        recording = true;
        //setTimeout(uploadLoudness, 15000);  // Upload microphone data after 15 seconds
    } else {
        await toggleMicrophone();
        recording = false;
    }
}

export const getLocation = (getLoc: (loc: GeoPoint) => void) => {
    if ("geolocation" in navigator) {
      var loc = null;
      navigator.geolocation.getCurrentPosition(function (position) {
        getLoc(new GeoPoint(position.coords.latitude, position.coords.longitude));
      }, null, {enableHighAccuracy: true} );
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }

export function findCurrentLocation(locations: LocationData[]) {
    getLocation((point) => {
        findLoc(point, locations)
    });
}

const findLoc = (userLocation: GeoPoint, locations: LocationData[]) => {
    console.log(userLocation);
    // Loc is an array of [lat, lon]. Values below for testing purposes
    var minDist = 1000000000;
    var dist = 0;
    // Check user position against each location, here we specify University of Alberta locations only.
    locations.forEach((location) => {
        dist = distanceLatLon(userLocation.latitude, userLocation.longitude, location.position.latitude, location.position.longitude)
        if (dist < minDist && dist < location.size) {
            closest = location.id
            minDist = dist
        }
    })

    // https://stackoverflow.com/questions/47227550/using-await-inside-non-async-function
    // const getClosest = (async() => { 
        // const locs = await getAllLocs("University of Alberta");
        // locs.forEach((doc) => {
        //     dist = distanceLatLon(loc[0], loc[1], doc.data().position.latitude, doc.data().position.longitude);
        //     console.log(dist);
        //     console.log(doc.data().name);
        //     if (dist < minDist && dist < doc.data().size) {
        //         closest = doc.id;
        //         minDist = dist;
        //     }
        // });
    // });
    // getClosest();
}

// Send last 15s of microphone data to the database.
export function uploadLoudness() {
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
    if (closest != "") {
        const calcTrend = (async() => {
            await getTrendLoc(closest, -1);
        });
        calcTrend();
    }
}

// Upload user loudness data for a location. usrData should be loudness data in dB, location should be id of a location.
export async function userLoudUpload(usrData: number, location: string) {
    if (typeof usrData == "string") {
        usrData = parseFloat(usrData);
    }
    const data = {
        loudnessmeasure: usrData,
        location: locString.concat(location),
        timestamp: Timestamp.now().toMillis(),
        submitted: "user",
    }
    let id = (Timestamp.now().toMillis() + usrData).toString();
    NoiseLevel.doc(id).set(data);
}

// Upload user busy data for a location. usrData should be busy level, a value in [0, 100], and location should
// be the id of a location.
export async function userBusyUpload(usrData: number, location: string) {
    if (typeof usrData == "string") {
        usrData = parseFloat(usrData);
    }
    const data = {
        busymeasure: usrData,
        location: locString.concat(location),
        timestamp: Timestamp.now().toMillis(),
        submitted: "user",
    }

    let id = (Timestamp.now().toMillis() + usrData).toString();
    BusyLevel.doc(id).set(data);
}

// Computes the average sound at a given location
export async function requestAverageSound(location: string) {
    const compareTimestamp = Timestamp.now().toMillis() - 3600000;  // Timestamp from one hour ago.
    var averageSound = 0;
    numDocsSound = 0;
    var loc = locString.concat(location);

    // Must use collection(...) for queries. Averages all noise data from a given location for the last hour.
    const q = query(collection(db, "NoiseLevel"), where("timestamp", ">", compareTimestamp), where("location", "==", loc));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
        numDocsSound++;
        averageSound += doc.data().loudnessmeasure;
    });
    console.log("Num docs sound: ", numDocsSound);
    if (numDocsSound > 0) {
        averageSound /= numDocsSound;
    }
    console.log("Average sound for last hour at " + loc + ": ", averageSound);
    return averageSound;
}

export async function requestBusyMeasure(location: string) {
    /* Checks number of submitted sound requests, and busy requests for a given location.
    Averages the user submitted busy measures, then adds estimate based on total number of submitted requests.
    Intuition is that people using the application will make their own reports on sound level and busy measures
    which can be used to estimate current number of individuals in a given location.

    Assumes 20% of people use the application, each submit two reports (busy / loud), so multiplies number of reports by 2.5.

    Does not independently upload data.
    */
    const compareTimestamp = Timestamp.now().toMillis() - 3600000;  // Timestamp from one hour ago.
    var loc = locString.concat(location);
    var busyLevel = 0;  // Percentage, stored from 0-100 internally
    numDocsBusy = 0;

    // Only check reports at the given location from the last hour
    const q = query(collection(db, "BusyLevel"), where("timestamp", ">", compareTimestamp), where("location", "==", loc), where("submitted", "==", "user"));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
        numDocsBusy++;
        busyLevel += doc.data().busymeasure;
    });
    console.log("Number of docs for busy: ", numDocsBusy);

    if (numDocsBusy > 0) {
        busyLevel /= numDocsBusy;
    }
    console.log("Computed busy level: ", busyLevel);

    // Total user reports. Multiplier explained above.
    var reports = (numDocsSound + numDocsBusy) * 2.5;
    console.log("Estimated number of users: ", reports);
    const locDocQuery = doc(db, "Locations", location);
    const locDoc = await getDoc(locDocQuery);
    if (reports > 0 && locDoc.exists()) {
        var busyComp = (reports / locDoc.data().capacity) * 100;
        // For now, just average user and system levels.
        busyLevel = (busyLevel + busyComp) / 2;
    }
    if (busyLevel > 100) {
        busyLevel = 100
    }
    console.log("The busy level at " + loc + " is: ", busyLevel, " percent.");
    return busyLevel;
}

// Get every location for a given organization
export async function getAllLocs(org: string, add: (location: LocationData) => void, modify: (location: LocationData) => void, remove: (location: LocationData) => void) {
    const q = query(collection(db, "Locations"), where("organization", "==", org));
    onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const data = change.doc.data()
          if (change.type === "added") {
            add({
                id: change.doc.id,
                busytrend: data.busytrend,
                capacity: data.capacity,
                description: data.description,
                loudtrend: data.loudtrend,
                name: data.name,
                organization: data.organization,
                position: data.position,
                size: data.size
            })
          }
          if (change.type === "modified") {
            modify({
                id: change.doc.id,
                busytrend: data.busytrend,
                capacity: data.capacity,
                description: data.description,
                loudtrend: data.loudtrend,
                name: data.name,
                organization: data.organization,
                position: data.position,
                size: data.size
            })
          }
          if (change.type === "removed") {
            remove({
                id: change.doc.id,
                busytrend: data.busytrend,
                capacity: data.capacity,
                description: data.description,
                loudtrend: data.loudtrend,
                name: data.name,
                organization: data.organization,
                position: data.position,
                size: data.size
            })
          }
        });
      })
    // const locs = []
    // const queryColl = await getDocs(q);
    // queryColl.forEach((doc) => {
    //     locs.push(doc);
    // })
    // return locs;
}

// Example function for measuring data trends over time.
export async function getTrendAllLocs(org: string) {
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
    
    // Compute average sound and busy levels for all locations in a given organization.
    // var locs = await getAllLocs(org);
    // locs.forEach((loc) => {
    //     console.log(loc.id);
    //     getTrendLoc(loc.id, ind);
    // });
    // return locs;
}

// Similar to the above function, although only gets data for one location. Location should be a document id.
// Ind should not be passed, or should be -1, unless called by getTrendAllLocs()
export async function getTrendLoc(loc: string, ind=-1) {
    console.log("LOCATION:", loc);
    var data = await(getLocData(loc));
    if (ind == -1) {
        // Timestamp from last hour. Function assumed to be called on the hour, to collect the data from the
        // previous hour. The hour, in military time, is used as the index in the trend array.
        const timestamp = Timestamp.now().toMillis();
        var date = new Date(timestamp);
        ind = date.getHours();  // Firebase seems to be in MST
        if (ind < 0) {
            ind += 24;
        }
    }
    requestAverageSound(loc).then((avgSound) => {
        console.log("After sound");
        let loudData = data?.loudtrend;
        loudData[ind] = avgSound;
        Locations.doc(loc).update({loudtrend: loudData});
        requestBusyMeasure(loc).then((busyLevel) => {
            console.log("After busy");
            let busyData = data?.busytrend;
            busyData[ind] = busyLevel;
            Locations.doc(loc).update({busytrend: busyData});
        });
    });
}

// Helper function for dashboard to allow data to update on reopening.
export async function getLocData(id: string) {
    const locDocQuery = doc(db, "Locations", id);
    const locDoc = await getDoc(locDocQuery);
    return locDoc.data();
}

// Upload new location to the database. Busy and loud data are prefilled.
// pos should be a GeoPoint. Returns true if the location did not previously
// exist and is now created. Returns false if location already existed, and the
// location will not be recreated.
export async function newLocation(name: string, org: string, pos: GeoPoint, size: number, cap: number, desc: string) {
    var busy = Array(24).fill(0);
    var loud = Array(24).fill(10);
    if (typeof cap == "string") {
        cap = parseInt(cap);
    }
    if (typeof size == "string") {
        size = parseInt(size);
    }
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
    const locDocQuery = doc(db, "Locations", id);
    const locDoc = await getDoc(locDocQuery);
    if (!locDoc.exists()) {
        Locations.doc(id).set(data);
        return true;
    }
    return false;
}

// Function to update a location at the given document id. Any default values will remain unchanged.
// Returns false if location doesn't exist, true otherwise
export async function updateLocation(id: string, name: string, org: string, pos: GeoPoint, size: number, cap: number, desc: string) {
    // Get individual location
    const locDocQuery = doc(db, "Locations", id);
    const locDoc = await getDoc(locDocQuery);
    if (typeof cap == "string") {
        cap = parseInt(cap);
    }
    if (typeof size == "string") {
        size = parseInt(size);
    }
    if (locDoc.exists()) {
        // Always update entire document, so make sure to set any values we don't want to change.
        const data = {
            name: name,
            organization: org,
            position: pos,
            size: size,
            description: desc,
            capacity: cap
        }
        await Locations.doc(id).update(data);
    } else {
        console.log("Location ", id, " does not exist.");
        return false;
    }
    return true;
}

// Allow admins to delete a location from the database
export async function deleteLoc(id: string) {
    deleteDoc(doc(db, "Locations", id));
}

// Adds favourite location for the user (usr). Pass location id to be added.
// usr should be the uid of the signed in user.
export async function addFavourite(usr: string, id: string) {
    const usrDocQuery = doc(db, "UserInformation", usr);
    const usrDoc = await getDoc(usrDocQuery);
    if (usrDoc.exists()) {
        await Users.doc(usr).update({favourites : firebase.firestore.FieldValue.arrayUnion(id)});
    }
}

// Removes favourite location from a user (usr) with the provided location id
// usr should be the uid of the signed in user.
export async function removeFavourite(usr: string, id: string) {
    const usrDocQuery = doc(db, "UserInformation", usr);
    const usrDoc = await getDoc(usrDocQuery);
    if (usrDoc.exists()) {
        await Users.doc(usr).update({favourites : firebase.firestore.FieldValue.arrayRemove(id)});
    }
}

// TS: For debugging purposes for all functions that don't have corresponding frontend implementations.
// User it tests with: 4EyDNDXRXFfggZEQrlUwfFYZfJi1 (testuser@email.com)
// export async function tester(usr: string) {
//     console.log("New loc");
//     deleteLoc("test");
//     removeFavourite(usr, "test");
//     await newLocation("Test", "University of Alberta", new GeoPoint(53.53,-113.53), 100, 10, "Hello!");
//     console.log("Loc doesn't exist");
//     updateLocation("fake", );
//     console.log("Actual update");
//     await updateLocation("test", "Test!", "University of Alberta", new GeoPoint(53.53,-113.53), 200, 2, "Bye!");
//     const locDocQuery = doc(db, "Locations", "test");
//     const locDoc = await getDoc(locDocQuery);
//     if (locDoc.exists()) {
//         console.log("Trend single location");
//         getTrendLoc(locDoc);
//     }
//     userLoudUpload(63.432432, "test");
//     userBusyUpload(45, "test");
//     console.log(usr);
//     addFavourite(usr, 'test');
// }

export function getUserInformation(user: string, callback: (user: UserInformationData) => void) {
    try {
        const userDoc = db.collection('UserInformation').doc(user);
        onSnapshot(userDoc, (snapshot) => {
            const data = snapshot.data()
            if (!data) {
                return
            }
            callback({
                id: snapshot.id,
                favourites: data.favourites,
                isAdmin: data.isAdmin
            })
        })
    } catch (error) {
      console.error("Error checking admin status:", error);
      return null;
    }
  }