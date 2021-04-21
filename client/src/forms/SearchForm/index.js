import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@material-ui/core";
import {
  AccountBoxRounded as UserIcon,
  ImageRounded as ArtworkIcon,
  SearchRounded as SearchIcon,
} from "@material-ui/icons";
import React from "react";
import { useEventsStore } from "../../contexts/global/events.js";

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
      <OutlinedInput
        name="searchInput"
        value={getValues("searchInput")}
        setValue={setValue}
        placeholder="Search..."
        errors={errors}
        margin="dense"
        variant="outlined"
        fullWidth
        startAdornment={
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
        }
        endAdornment={
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
        }
      />
    </Box>
  );
};

export default SearchForm;
