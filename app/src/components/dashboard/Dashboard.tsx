/**
 * FR7 - User.ViewDashboard
 * FR8 - User.AddFavoriteLocation
 */
import {
  Drawer,
  IconButton,
  Modal,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import { useDashboard } from "./dashboardprovider/DashboardProvider";
import "./index.css";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import LevelCard from "./LevelCard";
import {
  AccountBox,
  Description,
  GpsFixed,
  TurnedIn,
  TurnedInNot,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { BarPlot, ChartsLegend, ChartsYAxis } from "@mui/x-charts";
import EditIcon from "@mui/icons-material/Edit";
import { useAdminFeat } from "../admin/AdminFeatProvider";
import { useAuth } from "../authentication/AuthProvider";
import {
  addFavourite,
  getLocData,
  removeFavourite,
} from "../../scripts/Firebase";
import { useLocationPicker } from "../map/LocationPickerProvider";
import AddIcon from "@mui/icons-material/Add";
import Form from "../form/Form";
import { useEffect } from "react";

export const Dashboard = () => {
  const { open, setOpen, currentLocation, locations } = useDashboard();
  const {
    user,
    userInfo,
  } = useAuth();
  const [favorite, setFavorite] = useState<boolean>(false);
  const { setOpenAdmin, setLocationId, locationId } = useAdminFeat();
  const data = locations[currentLocation || ""];
  const [openForm, setOpenForm] = useState(false);

  // Check if location is a favourite
  useEffect(() => {
    if (currentLocation && userInfo) {
      setFavorite(userInfo.favourites.includes(currentLocation!));
    }
  }, [currentLocation]);

  const { setCoordinates } = useLocationPicker();
  const openEditLocation = async () => {
    // Set up the ManageLocation drawer
    setLocationId(currentLocation);
    setCoordinates({
      lat: data.position.latitude,
      long: data.position.longitude,
    });
    setOpen(false);
    setOpenAdmin(true);
    console.log(locationId);
  };

  return data ? (
    <Drawer
      className="drawer"
      variant="temporary"
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
    >
      <div id="locationProfile" className="paper" >
        <h1>{data.name}</h1>
        <div className="description">
          <Tooltip title="Location">
            <GpsFixed />
          </Tooltip>
          <p>
            {data.position.latitude} {data.position.longitude}
          </p>
          <Tooltip title="Capacity">
            <AccountBox />
          </Tooltip>
          <p>{data.capacity}</p>
        </div>
        <div className="description">
          <Tooltip title="Description">
            <Description />
          </Tooltip>
          <p>{data.description}</p>
        </div>
        <div className="description">
          <Tooltip title="Floors">
            <Description />
          </Tooltip>
          <p>{data.floors}</p>
        </div>
        <div className="levelCardContainer">
          <LevelCard
            title="Sound Level"
            value={data.loudtrend[new Date().getHours()]}
            type="sound"
          />
          <LevelCard
            title="Busy Level"
            value={data.busytrend[new Date().getHours()]}
            type="busy"
          />
        </div>
        <div className="chartContainer">
          <div className="chart">
            <ResponsiveChartContainer
              xAxis={[
                {
                  data: [
                    "12am",
                    "1am",
                    "2am",
                    "3am",
                    "4am",
                    "5am",
                    "6am",
                    "7am",
                    "8am",
                    "9am",
                    "10am",
                    "11am",
                    "12pm",
                    "1pm",
                    "2pm",
                    "3pm",
                    "4pm",
                    "5pm",
                    "6pm",
                    "7pm",
                    "8pm",
                    "9pm",
                    "10pm",
                    "11pm",
                  ],
                  scaleType: "band",
                  id: "x-axis-id",
                },
              ]}
                  yAxis={[
                    {
                      data: [0, 20, 40, 60, 80, 100],
                      scaleType: 'linear',
                      id: 'y-axis-id',
                    }
                  ]}
              series={[
                {
                  type: "bar",
                  data: data.loudtrend,
                  label: "Sound Level",
                  color: "#3C4F76",
                },
                {
                  type: "bar",
                  data: data.busytrend,
                  label: "Busy Level",
                  color: "#DDDBF1",
                },
              ]}
              title="PLOT"
            >
              <ChartsLegend />
              <BarPlot />
              <ChartsXAxis position="bottom" />
                      <ChartsYAxis position="left" />
            </ResponsiveChartContainer>
          </div>
        </div>
        <div className="dashboardButtonContainer">
          {userInfo && userInfo.isAdmin ? (
            <IconButton id="editButton" className="addButton" onClick={openEditLocation}>
              <EditIcon />
            </IconButton>
          ) : null}
          <IconButton className="addButton" onClick={() => setOpenForm(true)}>
            <AddIcon />
          </IconButton>
          {user ? (
            <ToggleButton
              id = "favoriteButton"
              className="favoriteButton"
              value={favorite}
              onClick={() => {
                favorite
                  ? removeFavourite(user.uid, currentLocation!)
                  : addFavourite(user.uid, currentLocation!);
              }} // TODO: Need these as actual location ids
              onChange={() => {
                setFavorite(!favorite);
              }}
            >
              {" "}
              {favorite ? <TurnedIn /> : <TurnedInNot />}
            </ToggleButton>
          ) : null}
        </div>
      </div>
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Form id={currentLocation!} close={() => setOpenForm(false)} />
      </Modal>
    </Drawer>
  ) : null;
};
