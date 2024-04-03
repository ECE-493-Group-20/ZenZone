import { Autocomplete, TextField } from "@mui/material"
import { Search } from "@mui/icons-material";
import {getAllLocs} from "../../scripts/Firebase"
import { useState, useEffect } from "react";
import "./index.css"

interface SearchBarProps {
  handleItemClick: (itemId: string) => Promise<void>;
}

const SearchBar = (props: SearchBarProps) => {
  const [items, setItems] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations: any[] = await getAllLocs("University of Alberta");
      const updatedItems = locations.map((location, index) => ({
        label: `${location.data().name}`,
        value: index + 1,
      }));
      setItems(updatedItems);
    };

    fetchLocations();
  }, []);

  const onItemClick = async (option: string) => {
    const locs = await getAllLocs("University of Alberta");
    locs.forEach(async (loc) => {
      if (option === loc.data().name)
        // console.log(loc.data().position.latitude);
        await props.handleItemClick(option);
    });
  };
  // solved border issues with: https://github.com/mui/material-ui/issues/30597
  return (
    <div className="searchBar">
      <Autocomplete
        id="search-bar"
        options={items}
        getOptionLabel={(option) => option.label}
        onChange={(event, newValue) => {
          if (newValue) {
            onItemClick(newValue.label);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <Search />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          />
        )}
      />
    </div>
  );
};

export default SearchBar;