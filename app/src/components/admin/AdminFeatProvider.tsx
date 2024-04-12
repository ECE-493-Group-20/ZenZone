/**
 * FR14 - Admin.CreateLocation
 * FR15 - Admin.UpdateLocation
 */
import { createContext, useContext, useMemo, useState } from "react";

interface locationAttr {
    locationName?: string,
    location?: string,
    capacity?: number,
    description?: string,
    busyLevel?: number,
    soundLevel?: number,
    locationId: string | null,
    size?: string
    organization?: string
  }

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