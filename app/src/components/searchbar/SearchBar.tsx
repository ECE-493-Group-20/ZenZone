import { Input, InputAdornment } from "@mui/material"
import { Search } from "@mui/icons-material";
import "./index.css"

const SearchBar = () => {
    return (
    <div className="searchBar">
        <div className="searchBarContainer">
          <Input startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>} />
        </div>
    </div>
    )
}

export default SearchBar;