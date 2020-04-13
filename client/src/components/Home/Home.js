import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import { Grid, CircularProgress } from '@material-ui/core';
import ax from '../../axios.config';
import Gallery from './Gallery';
import HomeStyles from './Home.style';

const Home = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    alerts: [],
    artwork: [],
  });

  const classes = HomeStyles();

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get('/api/artwork');
      setState({ ...state, loading: false, artwork: data.artwork });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.grid}>
        {state.loading ? (
          <CircularProgress />
        ) : state.artwork.length ? (
          <Gallery elements={state.artwork} />
        ) : (
          'No artwork'
        )}
      </Grid>
    </Grid>
  );
};

export default Home;
