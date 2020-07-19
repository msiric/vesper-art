import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import SwipeCard from '../../components/SwipeCard/SwipeCard.js';

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

const UserArtworkPanel = ({
  tabs,
  user,
  loadMoreArtwork,
  loadMoreSaves,
  handleTabsChange,
  handleChangeIndex,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={8} className={classes.grid}>
      {user.editable ? (
        <Paper className={classes.paper} variant="outlined">
          <SwipeCard
            tabs={{
              value: tabs.value,
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
                  type: 'artwork',
                  error: 'You have no artwork to display',
                },
                {
                  display: true,
                  content: user.savedArtwork,
                  type: 'artwork',
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
              value: tabs.value,
              hasMore: '',
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
                  type: 'artwork',
                  error: 'This user has no artwork to display',
                },
                {
                  display: user.displaySaves,
                  content: user.savedArtwork,
                  type: 'artwork',
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
