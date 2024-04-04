import { useState } from "react";
import SearchBar from "../searchbar/SearchBar"
import Map from "../map/Map";
import { useDashboard } from "../dashboard/dashboardprovider/DashboardProvider";

interface SearchMapProps {
  heatmap: boolean;
}

const SearchMap = (props: SearchMapProps) => {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [map, setMap] = useState<google.maps.Map | null>();
  const {locations} = useDashboard()

  const handleItemClick = async (itemId: string) => {
    Object.values(locations).forEach((loc) => {
      if (itemId === loc.name)
        map?.setCenter({
          lat: loc.position.latitude,
          lng: loc.position.longitude,
        });
        map?.setZoom(30);
    });
  };

  return (
    <div>
      <SearchBar handleItemClick={handleItemClick} />
      <Map
        heatmap={props.heatmap}
        handleItemClick={handleItemClick}
        position={position}
        map={map!}
        setMap={setMap}
      />
    </div>
  );
};

export default SearchMap;
