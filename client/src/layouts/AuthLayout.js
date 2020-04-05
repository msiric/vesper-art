import React from 'react';
import Grid from '@material-ui/core/Grid';
import AuthLayoutStyles from './AuthLayout.style';

const AuthLayout = ({ children }) => {
  const classes = AuthLayoutStyles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default AuthLayout;
