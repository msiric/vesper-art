import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store.js';
import { Grid, CircularProgress } from '@material-ui/core';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import { getArtwork } from '../../services/artwork.js';
import { withSnackbar } from 'notistack';
import Gallery from './Gallery.js';
import HomeStyles from './Home.style.js';
import mockArtwork from '../../constants/mockArtwork.json';

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
      // DATABASE DATA
      /*       const { data } = await getArtwork({
        cursor: state.cursor,
        ceiling: state.ceiling,
      });
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
        hasMore: data.artwork.length < state.ceiling ? false : true,
        cursor: state.cursor + state.ceiling,
      }); */

      // MOCK DATA
      const formattedArtwork = mockArtwork.data.map((artwork) => {
        return {
          comments: [],
          reviews: [],
          _id: artwork.id,
          created: artwork.created_utc,
          owner: { _id: artwork.id, name: artwork.author },
          active: true,
          current: {
            cover: artwork.url,
            _id: artwork.id,
            created: artwork.created_utc,
            title: artwork.title,
            type: 'commercial',
            availability: 'available',
            license: 'commercial',
            use: 'separate',
            personal: 20,
            commercial: 45,
            description: artwork.title,
            id: artwork.id,
          },
          saves: 0,
        };
      });
      setState({
        ...state,
        loading: false,
        artwork: formattedArtwork,
        hasMore: formattedArtwork.length < state.ceiling ? false : true,
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
      const { data } = await getArtwork({
        cursor: state.cursor,
        ceiling: state.ceiling,
      });
      setState((prevState) => ({
        ...prevState,
        artwork: [prevState.artwork].concat(data.artwork),
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
            type="artwork"
          />
        ) : (
          'No artwork'
        )}
      </Grid>
    </Grid>
  );
};

export default withSnackbar(Home);
