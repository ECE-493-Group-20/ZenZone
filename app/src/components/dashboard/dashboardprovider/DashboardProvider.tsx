import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAllLocs, getLocData } from "../../../scripts/Firebase";
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
    setOpen: React.Dispatch<React.SetStateAction<boolean | null>>
}

const DashboardContext = createContext<any>({})

export const DashboardProvider = ({ children }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isLocations, setIsLocations] = useState<boolean>(false)
    const [locations, setLocations] = useState<{[id: string]: LocationData}>({});
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);

    useEffect(() => {
        console.log("Updating locations array");
        const getLocs = (async() => {
            const locs = await getAllLocs("University of Alberta");
            locs.forEach((doc) => {
                locations[doc.id] = {id: doc.id, ...doc.data()}
                console.log(doc.description);
            })
            setLocations(locations)
            setIsLocations(true)
        });
        getLocs();
    })

    /*useEffect(() => {
        console.log("Updating data!");
        const updateData = (async() => {
            if (currentLocation) {
                await getLocData(currentLocation).then(dat => {
                    if (dat) {
                    locations[currentLocation] = {id: dat?.id,
                        busytrend: dat?.busytrend,
                        capacity: dat?.capacity,
                        description: dat?.description,
                        loudtrend: dat?.loudtrend,
                        name: dat?.name,
                        position: dat?.position,
                        size: dat?.size,}
                    }
                });
            }
        })
        updateData();
    }, [currentLocation])*/

    const value = useMemo(() => ({
        open,
        locations,
        currentLocation,
        isLocations,
        setCurrentLocation,
        setOpen,
    }), [open, locations, isLocations, currentLocation])
    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export const useDashboard = () => {
    return useContext<DashboardProviderProps>(DashboardContext);
}