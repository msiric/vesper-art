import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import { Grid, CircularProgress } from '@material-ui/core';
import { ax } from '../../shared/Interceptor/Interceptor';
import { withSnackbar } from 'notistack';
import Gallery from './Gallery';
import HomeStyles from './Home.style';

const Home = ({ location, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    alerts: [],
    artwork: [],
    hasMore: true,
    cursor: 0,
    ceiling: 50,
  });

  const classes = HomeStyles();

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get(
        `/api/artwork?cursor=${state.cursor}&ceiling=${state.ceiling}`
      );
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
        hasMore: data.artwork.length < state.ceiling ? false : true,
        cursor: state.cursor + state.ceiling,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
    if (location.state && location.state.message) {
      enqueueSnackbar(location.state.message, {
        variant: 'success',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    }
  }, []);

  const loadMore = async () => {
    try {
      const { data } = await ax.get(
        `/api/artwork?cursor=${state.cursor}&ceiling=${state.ceiling}`
      );
      setState((prevState) => ({
        ...prevState,
        artwork: [...prevState.artwork].concat(data.artwork),
        hasMore: data.artwork.length >= prevState.ceiling,
        cursor: prevState.cursor + prevState.ceiling,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.grid}>
        {state.loading ? (
          <CircularProgress />
        ) : state.artwork.length ? (
          <Gallery
            elements={state.artwork}
            hasMore={state.hasMore}
            loadMore={loadMore}
          />
        ) : (
          'No artwork'
        )}
      </Grid>
    </Grid>
  );
};

export default withSnackbar(Home);
