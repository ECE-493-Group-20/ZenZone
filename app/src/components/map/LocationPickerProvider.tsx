/**
 * FR14 - Admin.CreateLocation
 * FR15 - Admin.UpdateLocation
 * 
 * This is used to get the point selected on the map when admin users are creating
 * and modifying locations.
 */

import { createContext, useContext, useState } from "react";

interface coordinates {
    lat: number,
    long: number
}

export const LocationPickerContext = createContext<any>({});

export const LocationPickerProvider = ({ children }: any) => {
    const [coordinates, setCoordinates] = useState<coordinates>({lat: 0, long: 0});

    return <LocationPickerContext.Provider value={{coordinates, setCoordinates}}>{children}</LocationPickerContext.Provider>
}

export const useLocationPicker = () => {
    return useContext(LocationPickerContext);
}