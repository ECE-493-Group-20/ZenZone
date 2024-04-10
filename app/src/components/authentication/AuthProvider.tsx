/*
Functional Requirements Comments:

FR2 - User.Authenticate
FR13 - Admin.Authenticate
FR8 - User.AddFavouriteLocation
FR9 - User.UpdateFavouriteLocation

This file creates a context for the authenticated user's information, which is
used throughout the app. If a user is authenticated, it will change the "Sign in"
button to a "Sign out" button. This is used to enable and disable admin user only 
features (creating and updating features). This file is also used for fetching 
the favourite locations of the user, which is used in the Map and Dashboard components.   
*/
import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "./firebaseSetup";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { UserInformationData, getUserInformation } from '../../scripts/Firebase';

interface Props {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<any>({});

export const AuthProvider: React.FC<Props> = ({ children } ) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformationData>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return
    }
    getUserInformation(user.uid, (userInfo) => {
      setUserInfo({...userInfo});
    });
  }, [user]);



  return <AuthContext.Provider value={{user, userInfo}}>{children}</AuthContext.Provider>;
};

export const useAuth= () => {
  return useContext(AuthContext);
}