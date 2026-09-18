// NEEDS ZUSTAND REFACTOR
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SearchPanel from "../../containers/SearchPanel/index";
import { useSearchResults } from "../../contexts/local/searchResults";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const SearchResults = () => {
  const resetResults = useSearchResults((state) => state.resetResults);

  const location = useLocation();
  const history = useHistory();

  const query = queryString.parse(location.search);

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetResults();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
