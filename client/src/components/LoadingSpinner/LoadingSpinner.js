import React from 'react';
import { Container, Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  loadingSpinnerItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});

const LoadingSpinner = () => {
  const classes = useStyles();

  return (
    <Container fixed className={classes.loadingSpinnerContainer}>
      <Grid container className={classes.loadingSpinnerGrid} spacing={2}>
        <Grid item xs={12} className={classes.loadingSpinnerItem}>
          <CircularProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingSpinner;
