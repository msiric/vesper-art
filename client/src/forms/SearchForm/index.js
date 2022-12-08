import { Box, IconButton, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  AccountBoxRounded as UserIcon,
  ImageRounded as ArtworkIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import React from "react";
import { useEventsStore } from "../../contexts/global/events";
import TextInput from "../../controls/TextInput/index";

const searchFormStyles = makeStyles(() => ({
  searchQuery: {
    margin: 0,
  },
  searchType: {
    display: "none !important",
  },
}));

const SearchForm = ({ handleToggle, getValues, setValue, loading }) => {
  const search = useEventsStore((state) => state.search);

  const classes = searchFormStyles();

  return (
    <Box>
      <TextInput
        name="searchQuery"
        value={getValues("searchQuery")}
        setValue={setValue}
        placeholder="Search..."
        loading={loading}
        className={classes.searchQuery}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                title={search === "artwork" ? "Search artwork" : "Search users"}
                onClick={handleToggle}
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
      <TextInput
        name="searchType"
        type="hidden"
        className={classes.searchType}
      />
    </Box>
  );
};

export default SearchForm;
