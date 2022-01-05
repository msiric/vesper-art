// NEEDS ZUSTAND REFACTOR
import { makeStyles } from "@material-ui/core";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SearchPanel from "../../containers/SearchPanel/index";
import { useSearchResults } from "../../contexts/local/searchResults";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const useSearchStyles = makeStyles((muiTheme) => ({
  container: {
    width: "100%",
    margin: "0 auto",
  },
}));

const SearchResults = () => {
  const resetResults = useSearchResults((state) => state.resetResults);

  const location = useLocation();
  const history = useHistory();

  const query = queryString.parse(location.search);

  const globalClasses = globalStyles();
  const classes = useSearchStyles();

  const reinitializeState = () => {
    resetResults();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Grid
      container
      className={`${classes.container} ${globalClasses.largeContainer}`}
      spacing={3}
    >
      {query.q && (query.t === "artwork" || query.t === "users") ? (
        <Grid item xs={12}>
          <SearchPanel type={query.t} />
        </Grid>
      ) : (
        history.push("/")
      )}
    </Grid>
  );
};

export default SearchResults;
