// NEEDS ZUSTAND REFACTOR
import { makeStyles } from "@material-ui/core";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SearchPanel from "../../containers/SearchPanel/index";
import { useSearchResults } from "../../contexts/local/searchResults";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const useSearchStyles = makeStyles((muiTheme) => ({}));

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
      className={`${globalClasses.gridContainer} ${globalClasses.largeContainer}`}
    >
      {query.q && (query.t === "artwork" || query.t === "users") ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchPanel type={query.t} />
          </Grid>
        </Grid>
      ) : (
        history.push("/")
      )}
    </Grid>
  );
};

export default SearchResults;
