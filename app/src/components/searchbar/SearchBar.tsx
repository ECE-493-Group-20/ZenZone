import { Autocomplete, TextField } from "@mui/material"
import { Search } from "@mui/icons-material";
import {getAllLocs} from "../../scripts/Firebase"
import { useState, useEffect } from "react";
import "./index.css"

interface SearchBarProps {
  handleItemClick: (itemId: string) => Promise<void>;
}

const SearchBar = (props: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<{ label: string; value: number }[]>([]);
  const [filteredItems, setFilteredItems] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getAllLocs("University of Alberta");
      const updatedItems = locations.map((location, index) => ({
        label: location.data().name,
        value: index + 1,
      }));
      setItems(updatedItems);
      setFilteredItems(updatedItems.slice(0, 3));
    };

    fetchLocations();
  }, []);

  const onItemClick = async (option: string) => {
    const locs = await getAllLocs("University of Alberta");
    locs.forEach(async (loc) => {
      if (option === loc.data().name)
        await props.handleItemClick(option);
    });
  };

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