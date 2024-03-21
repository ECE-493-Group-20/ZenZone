import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC1-JnK0jceEmz7_-XqjaLv2qh9qzqBFdg",
    authDomain: "zenzone-90b7a.firebaseapp.com",
    projectId: "zenzone-90b7a",
    storageBucket: "zenzone-90b7a.appspot.com",
    messagingSenderId: "956790020992",
    appId: "1:956790020992:web:fa7a6337be4d0ea911bf65",
    measurementId: "G-VRYF87GJDY"
}; //this is where your firebase app values you copied will go


const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = firebase.firestore(app);

export {app, auth, db};