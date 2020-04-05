import React from 'react';
import Grid from '@material-ui/core/Grid';
import Header from '../components/Header/Header';
import MainLayoutStyles from './MainLayout.style';

const MainLayout = ({ children }) => {
  const classes = MainLayoutStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header />
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default MainLayout;
