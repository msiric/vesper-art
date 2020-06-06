import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store.js';
import { Grid, CircularProgress } from '@material-ui/core';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import { withSnackbar } from 'notistack';
import Gallery from './Gallery.js';
import HomeStyles from './Home.style.js';

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
      const { data } = await axget(
        `/api/artwork?cursor=${statecursor}&ceiling=${stateceiling}`
      );
      setState({
        state,
        loading: false,
        artwork: dataartwork,
        hasMore: dataartworklength < stateceiling ? false : true,
        cursor: statecursor + stateceiling,
      });
    } catch (err) {
      setState({ state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
    if (locationstate && locationstatemessage) {
      enqueueSnackbar(locationstatemessage, {
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
      const { data } = await axget(
        `/api/artwork?cursor=${statecursor}&ceiling=${stateceiling}`
      );
      setState((prevState) => ({
        prevState,
        artwork: [prevStateartwork]concat(dataartwork),
        hasMore: dataartworklength >= prevStateceiling,
        cursor: prevStatecursor + prevStateceiling,
      }));
    } catch (err) {
      consolelog(err);
    }
  };

  return (
    <Grid container className={classescontainer}>
      <Grid item xs={12} className={classesgrid}>
        {stateloading ? (
          <CircularProgress />
        ) : stateartworklength ? (
          <Gallery
            elements={stateartwork}
            hasMore={statehasMore}
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
