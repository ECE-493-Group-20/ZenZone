/**
 * FR2 - User.Authenticate
 * FR13 - Admin.Authenticate
 * FR8 - User.AddFavouriteLocation
 * FR9 - User.UpdateFavouriteLocation
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

  // useEffect(() => {
  //   const checkAdminStatus = async () => {
  //     const isAdmin = await checkIsAdmin(user?.uid);
  //     setAdmin(isAdmin);
  //     setRefreshFavouriteLocations(!refreshFavouriteLocations);
  //   };

  //   checkAdminStatus();
  // }, [user]);

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