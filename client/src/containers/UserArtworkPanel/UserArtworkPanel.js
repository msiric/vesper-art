import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import SwipeCard from '../../components/SwipeCard/SwipeCard.js';
import { getSaves } from '../../services/user.js';
import { getArtwork } from '../../services/artwork.js';

const useStyles = makeStyles({
  paper: {
    height: '100%',
  },
  profileArtworkContainer: {
    '&> div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
  },
});

const UserArtworkPanel = ({ user, scroll }) => {
  const [state, setState] = useState({
    loading: true,
    tabs: { value: 0, revealed: false },
  });

  const classes = useStyles();

  const loadMoreArtwork = async () => {
    try {
      const { data } = await getArtwork({
        userId: state.user._id,
        dataCursor: scroll.artwork.dataCursor,
        dataCeiling: scroll.artwork.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        user: {
          ...prevState.user,
          artwork: [...prevState.user.artwork].concat(data.artwork),
        },
        scroll: {
          ...scroll,
          artwork: {
            ...scroll.artwork,
            hasMore:
              data.artwork.length < scroll.artwork.dataCeiling ? false : true,
            dataCursor: scroll.artwork.dataCursor + scroll.artwork.dataCeiling,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreSaves = async (newValue) => {
    try {
      const { data } = await getSaves({
        userId: state.user._id,
        dataCursor: scroll.saves.dataCursor,
        dataCeiling: scroll.saves.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        user: {
          ...prevState.user,
          savedArtwork: [...prevState.user.savedArtwork].concat(data.saves),
        },
        tabs: { ...prevState.tabs, value: newValue, revealed: true },
        scroll: {
          ...scroll,
          saves: {
            ...scroll.saves,
            hasMore:
              data.saves.length < scroll.saves.dataCeiling ? false : true,
            dataCursor: scroll.saves.dataCursor + scroll.saves.dataCeiling,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleTabsChange = (e, newValue) => {
    if (!state.tabs.revealed) loadMoreSaves(newValue);
    else
      setState((prevState) => ({
        ...prevState,
        tabs: { ...prevState.tabs, value: newValue },
      }));
  };

  const handleChangeIndex = (index) => {
    setState((prevState) => ({
      ...prevState,
      tabs: { ...prevState.tabs, value: index },
    }));
  };

  return (
    <Grid item xs={12} md={8} className={classes.grid}>
      {user.editable ? (
        <Paper className={classes.paper} variant="outlined">
          <SwipeCard
            tabs={{
              value: state.tabs.value,
              hasMore: '',
              type: 'artwork',
              headings: [
                { display: true, label: 'User artwork', props: {} },
                { display: true, label: 'Saved artwork', props: {} },
              ],
              items: [
                {
                  display: true,
                  content: user.artwork,
                  error: 'You have no artwork to display',
                },
                {
                  display: true,
                  content: user.savedArtwork,
                  error: 'You have no saved artwork',
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            handleLoadMore={loadMoreArtwork}
          />
        </Paper>
      ) : (
        <Paper className={classes.artwork} variant="outlined">
          <SwipeCard
            tabs={{
              value: state.tabs.value,
              hasMore: '',
              type: 'artwork',
              headings: [
                { display: true, label: 'User artwork', props: {} },
                {
                  display: user.displaySaves,
                  label: 'Saved artwork',
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  content: user.artwork,
                  error: 'This user has no artwork to display',
                },
                {
                  display: user.displaySaves,
                  content: user.savedArtwork,
                  error: 'This user has no saved artwork',
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            handleLoadMore={loadMoreSaves}
          />
        </Paper>
      )}
    </Grid>
  );
};

export default UserArtworkPanel;
