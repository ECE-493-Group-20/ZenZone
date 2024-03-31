import { useState } from "react";
import SearchBar from "../searchbar/SearchBar"
import Map from "../map/Map";
import { getAllLocs } from "../../scripts/Firebase";

interface SearchMapProps {
  heatmap: boolean;
}

const SearchMap = (props: SearchMapProps) => {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [map, setMap] = useState<google.maps.Map | null>();

  const handleItemClick = async (itemId: string) => {
    const locs = await getAllLocs("University of Alberta");
    locs.forEach((loc) => {
      if (itemId === loc.data().name)
        map?.setCenter({
          lat: loc.data().position.latitude,
          lng: loc.data().position.longitude,
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
