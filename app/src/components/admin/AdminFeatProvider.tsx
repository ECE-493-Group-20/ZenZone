/*
Functional Requirements Comments:

FR14 - Admin.CreateLocation
FR14 - Admin.UpdateLocation

This file creates a context for creating and editing locations. It is used to
open the ModifyLocation drawer and to pass information on which location is 
being modified.
*/
import { createContext, useContext, useState } from "react";

export const AdminFeatContext = createContext<any>(false)

export const AdminFeatProvider = ({ children }: any) => {
    const [open, setOpenAdmin] = useState<boolean>(false);
    // used to load location data
    const [locationId, setLocationId] = useState<string | null>(null);
    
    return <AdminFeatContext.Provider value={{open, setOpenAdmin, locationId, setLocationId}}>{children}</AdminFeatContext.Provider>
}

export const useAdminFeat= () => {
    return useContext(AdminFeatContext);
}