import React from 'react';
import { GeoPoint } from 'firebase/firestore';

interface coordinates {
    lat: number,
    long: number
}

export const LocationContext = React.createContext<coordinates>({lat: 0, long: 0});

