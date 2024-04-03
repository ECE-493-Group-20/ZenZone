import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "./firebaseSetup";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getUserFavourites } from '../../scripts/Firebase';

interface Props {
  children: React.ReactNode;
}

async function checkIsAdmin(user : any) {
  try {
    const userDoc = await db.collection('UserInformation').doc(user).get();
    if (userDoc.exists && userDoc.data()?.isAdmin) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export const AuthContext = React.createContext<any>({});

export const AuthProvider: React.FC<Props> = ({ children } ) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAdmin, setAdmin] = useState<boolean>(false);

  const [favouriteLocations, setFavouriteLocations] = useState<string[] | null>(null);

  const [refreshFavouriteLocations, setRefreshFavouriteLocations] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdmin = await checkIsAdmin(user?.uid);
      setAdmin(isAdmin);
      setRefreshFavouriteLocations(!refreshFavouriteLocations);
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const getFavouriteLocations = async () => {
      const favourites = await getUserFavourites(user?.uid);
      setFavouriteLocations(favourites);
    }

    getFavouriteLocations();
  }, [refreshFavouriteLocations]);



  return <AuthContext.Provider value={{user, isAdmin, setAdmin, favouriteLocations, refreshFavouriteLocations, setRefreshFavouriteLocations}}>{children}</AuthContext.Provider>;
};

export const useAuth= () => {
  return useContext(AuthContext);
}