import { Input, InputAdornment, Autocomplete, TextField } from "@mui/material"
import { BorderAll, Search } from "@mui/icons-material";
import {app, auth, db} from "../authentication/firebaseSetup"
import {getAllLocs} from "../../scripts/Firebase"
import { useState, useEffect } from "react";
import "./index.css"

const SearchBar = () => {

  const [items, setItems] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations: any[] = await getAllLocs("University of Alberta");
      const updatedItems = locations.map((location, index) => ({
        label: `${location.id}`,
        value: index + 1,
      }));
      setItems(updatedItems);
    };

    fetchLocations();
  }, []);
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
              // inputProps: {
              //   style: {
              //     border: "none", // Remove the border
              //   },
              // },
            }}
            sx={{ border: "none" }}
          />
        )}
      />
    </div>
  );
}

export default SearchBar;