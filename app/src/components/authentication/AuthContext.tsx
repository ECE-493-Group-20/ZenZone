import React from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const AuthContext = React.createContext<firebase.User | null>(null);
// firebase.User ==> User is signed in; null ==> User is not signed in