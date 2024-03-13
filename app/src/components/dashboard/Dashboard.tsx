import { Drawer } from "@mui/material"
import { useDashboard } from "./dashboardprovider/DashboardProvider"

export const Dashboard = () => {
    const {open, setOpen} = useDashboard()

    return (
        <Drawer variant="temporary" anchor='bottom' open={open} onClose={() => setOpen(false)}>
          <div>TEST</div>
        </Drawer>
    )
}
