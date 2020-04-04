import React from 'react';
import Grid from '@material-ui/core/Grid';
import MainLayoutStyles from './MainLayout.style';

const MainLayout = ({ children }) => {
  const classes = MainLayoutStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default MainLayout;
