import { Box, IconButton, InputAdornment } from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  ImageRounded as ArtworkIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import React from "react";
import { useEventsStore } from "../../contexts/global/events.js";
import TextInput from "../../controls/TextInput/index.js";

const SearchForm = ({ handleToggle, getValues, setValue, errors }) => {
  const search = useEventsStore((state) => state.search);

  /* const classes = AddArtworkStyles(); */
  const classes = {};

  return (
    <Box>
      <TextInput
        name="searchQuery"
        value={getValues("searchQuery")}
        setValue={setValue}
        placeholder="Search..."
        style={{ margin: 0 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                title={search === "artwork" ? "Search artwork" : "Search users"}
                onClick={handleToggle}
                className={classes.typeIcon}
                size="small"
                disableFocusRipple
                disableRipple
              >
                {search === "artwork" ? <ArtworkIcon /> : <UserIcon />}
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="submit"
                className={classes.searchIcon}
                size="small"
                disableFocusRipple
                disableRipple
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextInput name="searchType" type="hidden" style={{ display: "none" }} />
    </Box>
  );
};

export default SearchForm;
