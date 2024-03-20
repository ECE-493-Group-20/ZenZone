import { Button, Drawer, LinearProgress, ToggleButton } from "@mui/material"
import { useDashboard } from "./dashboardprovider/DashboardProvider"
import { LinePlot } from "@mui/x-charts/LineChart"
import "./index.css"
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer"
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
import LevelCard from "./LevelCard"
import { Star, TurnedIn, TurnedInNot } from "@mui/icons-material"
import { useState } from "react"

interface DashboardProps {
  locationName: string,
  location: string,
  capacity: number,
  description: string,
  busyLevel?: number,
  soundLevel?: number,
}

export const Dashboard = (props: DashboardProps) => {
    const {open, setOpen} = useDashboard()

    const [favorite, setFavorite] = useState<boolean>(false)

    return (
        <Drawer 
          className="drawer" 
          variant="temporary" 
          anchor='bottom' 
          open={open} 
          onClose={() => setOpen(false)}>
          <div className="paper">
            <h1>{props.locationName}</h1>
            <p>{props.location} | {props.capacity}</p>
            <p>{props.description}</p>
            <div className="levelCardContainer">
              <LevelCard title="Sound Level" value={props.soundLevel || 30} type="sound" />
              <LevelCard title="Busy Level" value={props.busyLevel || 80} type="busy" />
            </div>
            <div className="chartContainer">
              <div className="chart">
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
            <ToggleButton className="favoriteButton" value={favorite} onChange={() => setFavorite(!favorite)} >
              {favorite ? <TurnedIn /> : <TurnedInNot />}
            </ToggleButton>
          </div>
        </Drawer>
    )
}
