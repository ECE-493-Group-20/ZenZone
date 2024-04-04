import { Autocomplete, TextField } from "@mui/material"
import { Search } from "@mui/icons-material";
import {getAllLocs} from "../../scripts/Firebase"
import { useState, useEffect } from "react";
import "./index.css"
import { useDashboard } from "../dashboard/dashboardprovider/DashboardProvider";

interface SearchBarProps {
  handleItemClick: (itemId: string) => Promise<void>;
}

const SearchBar = (props: SearchBarProps) => {
  const [items, setItems] = useState<{ label: string; value: number }[]>([]);
  const {locations} = useDashboard();

  useEffect(() => {
    const updatedItems = Object.values(locations).map((location, index) => ({
      label: `${location.name}`,
      value: index + 1,
    }));
    setItems(updatedItems);
  }, [locations]);

  const onItemClick = async (option: string) => {
    Object.values(locations).forEach(async (location) => {
      location.name === option ? await props.handleItemClick(option) : null
    })
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