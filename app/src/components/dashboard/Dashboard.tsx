import { Drawer, LinearProgress } from "@mui/material"
import { useDashboard } from "./dashboardprovider/DashboardProvider"
import { LinePlot } from "@mui/x-charts/LineChart"
import "./index.css"
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer"
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'

export const Dashboard = () => {
    const {open, setOpen} = useDashboard()

    // #7765AC (25dB) FAINT
    // #4D74B2 (40dB) SOFT
    // #659360 (60dB) MODERATE
    // #FCB955 (80dB) LOUD (long periods past 85 is dangerous)
    // #E95658 (120dB) VERY LOUD

    return (
        <Drawer 
          className="drawer" 
          variant="temporary" 
          anchor='bottom' 
          open={open} 
          onClose={() => setOpen(false)}>
          <div className="paper">
            <h1>{"{LOCATION NAME}"}</h1>
            <p>{"{LOCATION}"}</p>
            <div className="levelCardContainer">
              <div className="levelCard">
                <h4>Busy Level</h4>
                <LinearProgress title="Busy Level" variant="determinate" value={50} sx={{'& .MuiLinearProgress-bar': {backgroundColor: 'red'}}}/>
              </div>
              <div className="levelCard">
                <h4>Sound Level</h4>
                <LinearProgress title="Sound Level" variant="determinate" value={80}/>
              </div>
            </div>
            
            <div style={{width: '100vw', height: '40vh'}}>
            <ResponsiveChartContainer 
              xAxis={[
                {
                  data: ['A', 'B', 'C', 'D', 'E'],
                  scaleType: 'band',
                  id: 'x-axis-id',
                },
              ]}
              series={[{
                  type: 'line',
                  data: [1,2,3,4,5]
                }, {
                  type: 'line',
                  data: [5,4,3,2,1]
                }]}>
                  <LinePlot/>
                  <ChartsXAxis label="X axis" position="bottom" axisId="x-axis-id" />
            </ResponsiveChartContainer>
            </div>  
          </div>
        </Drawer>
    )
}
