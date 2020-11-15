import { Box, IconButton } from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  ImageRounded as ArtworkIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import React from "react";
import { useTracked as useEventsContext } from "../../contexts/Events.js";
import InputBase from "../../controls/InputBase";

const SearchForm = ({
  handleToggle,
  handleSubmit,
  getValues,
  setValue,
  errors,
  other,
}) => {
  const [eventsStore, eventsDispatch] = useEventsContext();
  /* const classes = AddArtworkStyles(); */
  const classes = {};

  return (
    <Box>
      <IconButton
        title={
          eventsStore.search === "artwork" ? "Search artwork" : "Search users"
        }
        onClick={handleToggle}
        className={classes.typeIcon}
        disableFocusRipple
        disableRipple
      >
        {eventsStore.search === "artwork" ? <ArtworkIcon /> : <UserIcon />}
      </IconButton>
      <InputBase
        name="searchInput"
        value={getValues("searchInput")}
        setValue={setValue}
        placeholder="Search..."
        errors={errors}
      />
      <IconButton
        type="submit"
        className={classes.searchIcon}
        disableFocusRipple
        disableRipple
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchForm;
