import { CircularProgress, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import ArtworkPanel from "../../containers/ArtworkPanel/ArtworkPanel.js";
import { Context } from "../../context/Store.js";
import { getSearch } from "../../services/home.js";

const SearchResults = ({ match, location, history }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    results: [],
    type: null,
    hasMore: true,
    cursor: 0,
    ceiling: 50,
  });

  console.log(state);

  const classes = {};

  const fetchResults = async () => {
    try {
      if (!state.loading)
        setState((prevState) => ({
          ...prevState,
          loading: true,
          hasMore: true,
          cursor: 0,
        }));
      const { data } = await getSearch({
        searchQuery: location.search,
        dataCursor: state.cursor,
        dataCeiling: state.ceiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        results: data.searchData,
        type: data.searchDisplay,
        hasMore: data.searchData.length < state.ceiling ? false : true,
        cursor: state.cursor + state.ceiling,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      const { data } = await getSearch({
        query: location.search,
        cursor: state.cursor,
        ceiling: state.ceiling,
      });
      setState((prevState) => ({
        ...prevState,
        results: [...prevState.results].concat(data.searchResults),
        hasMore: data.searchResults.length >= prevState.ceiling,
        cursor: prevState.cursor + prevState.ceiling,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [history.location]);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.grid}>
        {state.loading ? (
          <CircularProgress />
        ) : state.results.length ? (
          state.type === "artwork" ? (
            <ArtworkPanel
              elements={state.results}
              hasMore={state.hasMore}
              loadMore={loadMore}
              type="version"
            />
          ) : (
            {
              /* <Group
              elements={state.results}
              hasMore={state.hasMore}
              loadMore={loadMore}
            /> */
            }
          )
        ) : (
          "No results"
        )}
      </Grid>
    </Grid>
  );
};

export default withRouter(SearchResults);
