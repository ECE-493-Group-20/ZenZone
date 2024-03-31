import { createContext, useContext, useMemo, useState } from "react";


export const AdminFeatContext = createContext<any>(false)

export const AdminFeatProvider = ({ children }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    
    return <AdminFeatContext.Provider value={{open, setOpen}}>{children}</AdminFeatContext.Provider>
}

export const useAdminFeat= () => {
    return useContext(AdminFeatContext);
}