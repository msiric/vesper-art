// NEEDS ZUSTAND REFACTOR
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import EmptySection from "../../components/EmptySection/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import ArtworkPanel from "../../containers/ArtworkPanel/index.js";
import UserPanel from "../../containers/UserPanel/index.js";
import { getSearch } from "../../services/home.js";

const initialState = {
  loading: true,
  results: [],
  type: null,
  hasMore: true,
  cursor: 0,
  ceiling: 50,
};

const SearchResults = ({ match, location, history }) => {
  const [state, setState] = useState({
    ...initialState,
  });

  const fetchResults = async () => {
    try {
      setState({ ...initialState });
      if (!state.loading)
        setState((prevState) => ({
          ...prevState,
          loading: true,
          hasMore: true,
          cursor: 0,
        }));
      const { data } = await getSearch.request({
        searchQuery: location.search,
        cursor: initialState.cursor,
        limit: initialState.ceiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        results: data.searchData,
        type: data.searchDisplay,
        hasMore: data.searchData.length < prevState.ceiling ? false : true,
        cursor: prevState.cursor + prevState.ceiling,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      const { data } = await getSearch.request({
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
  }, [location]);

  return (
    <Grid key={location.key} container>
      <Grid item xs={12} style={{ padding: "0 32px" }}>
        {state.loading ? (
          <LoadingSpinner />
        ) : state.results.length ? (
          state.type === "artwork" ? (
            <ArtworkPanel
              elements={state.results}
              hasMore={state.hasMore}
              loadMore={loadMore}
              type="version"
            />
          ) : (
            <UserPanel
              elements={state.results}
              hasMore={state.hasMore}
              loadMore={loadMore}
            />
          )
        ) : (
          <EmptySection
            label="No results matched your query"
            loading={state.loading}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default withRouter(SearchResults);
