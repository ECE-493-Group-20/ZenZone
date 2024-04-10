/*
Functional Requirements Comments:

FR1 - User.Register
FR2 - User.Authenticate
FR12 - Admin.Register
FR13 - Admin.Authenticate

This file is used to establish the connection to Firebase Authentication, which
is used for the above functional requirments 
*/

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRESTORE_KEY,
    authDomain: "zenzone-90b7a.firebaseapp.com",
    projectId: "zenzone-90b7a",
    storageBucket: "zenzone-90b7a.appspot.com",
    messagingSenderId: "956790020992",
    appId: process.env.REACT_APP_FIRESTORE_ID,
    measurementId: "G-VRYF87GJDY"
};


const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = firebase.firestore(app);

export {app, auth, db};