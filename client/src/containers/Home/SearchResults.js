import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Store/Store.js';
import { Grid, CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { getSearch } from '../../services/home.js';
import Gallery from './Gallery.js';
import Group from './Group.js';
import SearchResultsStyles from './SearchResults.style.js';

const SearchResults = ({ match, location, history }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    results: [],
    type: null,
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 50,
  });

  const classes = SearchResultsStyles();

  const fetchResults = async () => {
    try {
      if (!state.loading)
        setState((prevState) => ({
          ...prevState,
          loading: true,
          hasMore: true,
          dataCursor: 0,
        }));
      const { data } = await getSearch({
        query: location.search,
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        results: data.searchResults,
        type: data.searchType,
        hasMore: data.searchResults.length < state.dataCeiling ? false : true,
        dataCursor: state.dataCursor + state.dataCeiling,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      const { data } = await getSearch({
        query: location.search,
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        results: [...prevState.results].concat(data.searchResults),
        hasMore: data.searchResults.length >= prevState.dataCeiling,
        dataCursor: prevState.dataCursor + prevState.dataCeiling,
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
          state.type === 'artwork' ? (
            <Gallery
              elements={state.results}
              hasMore={state.hasMore}
              loadMore={loadMore}
              type="version"
            />
          ) : (
            <Group
              elements={state.results}
              hasMore={state.hasMore}
              loadMore={loadMore}
            />
          )
        ) : (
          'No results'
        )}
      </Grid>
    </Grid>
  );
};

export default withRouter(SearchResults);
