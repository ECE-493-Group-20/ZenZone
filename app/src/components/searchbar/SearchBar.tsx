import { Autocomplete, TextField } from "@mui/material"
import { Search } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDashboard } from "../dashboard/dashboardprovider/DashboardProvider";
import "./index.css"

interface SearchBarProps {
  handleItemClick: (itemId: string) => Promise<void>;
}

const SearchBar = (props: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<{ label: string; value: number }[]>([]);
  const [filteredItems, setFilteredItems] = useState<{ label: string; value: number }[]>([]);
  const {locations} = useDashboard();

  useEffect(() => {
    const updatedItems = Object.values(locations).map((location, index) => ({
      label: `${location.name}`,
      value: index + 1,
    }));
    setItems(updatedItems);
    setFilteredItems(updatedItems.slice(0, 3));
  }, [locations]);

  const onItemClick = async (option: string) => {
    Object.values(locations).forEach(async (location) => {
      if (location.name === option) await props.handleItemClick(option)
    })
  }

  const handleSearch = (e: any) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setFilteredItems(items.slice(0, 3));
    } else {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <div className="searchBar">
      <Autocomplete
        id="search-bar"
        options={filteredItems}
        getOptionLabel={(option) => option.label}
        onChange={(event, newValue) => {
          if (newValue) {
            onItemClick(newValue.label);
          }
        }}
        renderOption={(props: object, option: any, state: object) => (
          <div className="suggestionCard" {...props}>
            {option.label}
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={handleSearch}
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
}

export default SearchBar;