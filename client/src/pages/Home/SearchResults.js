// NEEDS ZUSTAND REFACTOR
import { Grid } from "@material-ui/core";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import SearchPanel from "../../containers/SearchPanel/index.js";
import { useSearchResults } from "../../contexts/local/searchResults";

const SearchResults = () => {
  const resetResults = useSearchResults((state) => state.resetResults);

  const location = useLocation();
  const history = useHistory();

  const query = queryString.parse(location.search);

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
      style={{ width: "100%", margin: 0, padding: "0 32px" }}
      spacing={3}
    >
      {query.s && (query.t === "artwork" || query.t === "users") ? (
        <Grid item xs={12} style={{ padding: "0 32px" }}>
          <SearchPanel type={query.t} />
        </Grid>
      ) : (
        history.push("/")
      )}
    </Grid>
  );
};

export default withRouter(SearchResults);
