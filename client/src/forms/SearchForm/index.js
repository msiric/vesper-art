import { Box, IconButton } from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  ImageRounded as ArtworkIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import React from "react";
import { useEventsStore } from "../../contexts/global/events.js";
import InputBase from "../../controls/InputBase";

const SearchForm = ({
  handleToggle,
  handleSubmit,
  getValues,
  setValue,
  errors,
  other,
}) => {
  const search = useEventsStore((state) => state.search);

  /* const classes = AddArtworkStyles(); */
  const classes = {};

  return (
    <Box>
      <IconButton
        title={search === "artwork" ? "Search artwork" : "Search users"}
        onClick={handleToggle}
        className={classes.typeIcon}
        disableFocusRipple
        disableRipple
      >
        {search === "artwork" ? <ArtworkIcon /> : <UserIcon />}
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
