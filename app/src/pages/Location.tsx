import React, { useState, useEffect } from "react";

export const getLocation = (getLoc: (loc: any) => any) => {
  if ("geolocation" in navigator) {
    var loc = null;
    navigator.geolocation.getCurrentPosition(function (position) {
      getLoc([position.coords.latitude, position.coords.longitude]);
    }, null, {enableHighAccuracy: true} );
  } else {
    console.log("Geolocation is not available in your browser.");
  }
}

function Location(getLoc: (loc: any) => any) {
  const [position, setPosition] = useState({
    latitude: null as unknown as number,
    longitude: null as unknown as number,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        getLoc([position.coords.latitude, position.coords.longitude, position.coords.altitude]);
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);
  return (
    <div>
      <h2>You are located at:</h2>
      {position.latitude && position.longitude ? (
        <p>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Location;
