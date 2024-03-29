import { Drawer, ToggleButton, Tooltip } from "@mui/material"
import { useDashboard } from "./dashboardprovider/DashboardProvider"
import "./index.css"
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer"
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis'
import LevelCard from "./LevelCard"
import { AccountBox, Description, GpsFixed, TurnedIn, TurnedInNot } from "@mui/icons-material"
import { useState } from "react"
import { BarPlot, ChartsLegend } from "@mui/x-charts"

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
            <div className="description">
              <Tooltip title="Location">
                <GpsFixed />              
              </Tooltip>
              <p>{props.location}</p>
              <Tooltip title="Capacity">
                <AccountBox />
              </Tooltip>
              <p>{props.capacity}</p>
            </div>
            <div className="description">
              <Tooltip title="Description">
                <Description />
              </Tooltip>
              <p>{props.description}</p>
            </div>
            <div className="levelCardContainer">
              <LevelCard title="Sound Level" value={props.soundLevel || 30} type="sound" />
              <LevelCard title="Busy Level" value={props.busyLevel || 80} type="busy" />
            </div>
            <div className="chartContainer">
              <div className="chart">
                <ResponsiveChartContainer 
                  xAxis={[
                    {
                      data: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
                      scaleType: 'band',
                      id: 'x-axis-id',
                    },
                  ]}
                  series={[{
                      type: 'bar',
                      data: [1,2,3,4,5],
                      label: 'Sound Level',
                      color: '#3C4F76',
                    }, {
                      type: 'bar',
                      data: [5,4,3,2,1],
                      label: 'Busy Level',
                      color: '#DDDBF1',
                    }]}
                  title="PLOT"> 
                      <ChartsLegend />
                      <BarPlot/>
                      <ChartsXAxis position="bottom" />
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
