import { Autocomplete, TextField } from "@mui/material"
import { Search } from "@mui/icons-material";
import {getAllLocs} from "../../scripts/Firebase"
import { useState, useEffect } from "react";
import "./index.css"

const SearchBar = () => {

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
  // solved border issues with: https://github.com/mui/material-ui/issues/30597
  return (
    <div className="searchBar">
      <Autocomplete
        id="search-bar"
        options={items}
        getOptionLabel={(option) => option.label}
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
              "& .MuiOutlinedInput-notchedOutline":{ border: 'none' },
             }}
          />
        )}
      />
    </div>
  );
}

export default SearchBar;