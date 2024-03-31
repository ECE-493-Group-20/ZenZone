import React from 'react';

interface coordinates {
    lat: number,
    long: number
}

export const LocationContext = React.createContext<coordinates>({lat: 0, long: 0});

