import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAllLocs } from "../../../scripts/Firebase";
import { GeoPoint } from "@firebase/firestore-types";


interface LocationData {
    id: string,
    busytrend: number[],
    capacity: number,
    description: string,
    loudtrend: number[],
    name: string,
    position: GeoPoint,
    size: string,
}

interface DashboardProviderProps {
    open: boolean;
    locations: {
        [id: string]: LocationData;
    };
    isLocations: boolean;
    currentLocation: string | null;
    setCurrentLocation: React.Dispatch<React.SetStateAction<string | null>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
    refreshLocations : boolean;
    setRefreshLocations: React.Dispatch<React.SetStateAction<boolean>>
}

const DashboardContext = createContext<any>({})

export const DashboardProvider = ({ children }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isLocations, setIsLocations] = useState<boolean>(false)
    const [locations, setLocations] = useState<{[id: string]: LocationData}>({});
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);
    // Used to trigger refreshing the location information after modifying/creating locations
    const [refreshLocations, setRefreshLocations] = useState<boolean>(false);
    

    useEffect(() => {
        console.log("Refreshing data");
        const getLocs = (async() => {
            const locs = await getAllLocs("University of Alberta");
            locs.forEach((doc) => {
                locations[doc.id] = {id: doc.id, ...doc.data()}
            })
            setLocations(locations)
            setIsLocations(true)
        });
        getLocs();
        console.log("Done data");
    }, [refreshLocations])

    const value = useMemo(() => ({
        open,
        locations,
        currentLocation,
        isLocations,
        setCurrentLocation,
        setOpen,
        refreshLocations,
        setRefreshLocations,
    }), [open, locations, isLocations, currentLocation, refreshLocations, setRefreshLocations])
    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export const useDashboard = () => {
    return useContext<DashboardProviderProps>(DashboardContext);
}