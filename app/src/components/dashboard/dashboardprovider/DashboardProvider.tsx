/**
 * FR7 - User.ViewDashboard
 * FR16 - Display.Map
 * FR17 - Display.Historical Trend
 * FR18 - Display.CurrentData
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LocationData, getAllLocs, getLocData, getTrendLoc } from "../../../scripts/Firebase";

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
        const getLocs = (async() => {      
            await getAllLocs("University of Alberta",
            (location) => {
                locations[location.id] = location;
                setLocations({...locations}) //create new object to change ref to cause refresh
                setIsLocations(true)
            },
            (location) => {
                locations[location.id] = location;
                setLocations({...locations})
            },
            (location) => {
                delete locations[location.id]
                setLocations({...locations})
            });
        });
        getLocs();
        console.log("Done data");
    }, [])

    /*useEffect(() => {
        console.log("Updating data!");
        const updateData = (async() => {
            if (currentLocation) {
                console.log("CURRENT LOCATION UPDATE: ", currentLocation);
                await getTrendLoc(locations[currentLocation], -1);
                await getLocData(currentLocation).then(dat => {
                    locations[currentLocation] = {id: dat?.id,
                        busytrend: dat?.busytrend,
                        capacity: dat?.capacity,
                        description: dat?.description,
                        loudtrend: dat?.loudtrend,
                        name: dat?.name,
                        position: dat?.position,
                        size: dat?.size,}
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
        refreshLocations,
        setRefreshLocations,
    }), [open, locations, isLocations, currentLocation, refreshLocations, setRefreshLocations])
    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export const useDashboard = () => {
    return useContext<DashboardProviderProps>(DashboardContext);
}