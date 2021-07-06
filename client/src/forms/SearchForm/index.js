import { Box, IconButton, InputAdornment } from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  ImageRounded as ArtworkIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import React from "react";
import { useEventsStore } from "../../contexts/global/events";
import TextInput from "../../controls/TextInput/index";
import useGlobalStyles from "../../styles/global";

const SearchForm = ({ handleToggle, getValues, setValue, loading }) => {
  const search = useEventsStore((state) => state.search);

  const globalClasses = useGlobalStyles();

  return (
    <Box>
      <TextInput
        name="searchQuery"
        value={getValues("searchQuery")}
        setValue={setValue}
        placeholder="Search..."
        loading={loading}
        className={globalClasses.searchQuery}
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
        className={globalClasses.searchType}
      />
    </Box>
  );
};

export default SearchForm;
