import { createContext, useContext, useMemo, useState } from "react";


const DashboardContext = createContext<any>({})

export const DashboardProvider = ({ children }: any) => {
    const [open, setOpen] = useState<boolean>(false);

    const value = useMemo(() => ({
        open,
        setOpen,
    }), [open])
    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export const useDashboard = () => {
    return useContext(DashboardContext);
}