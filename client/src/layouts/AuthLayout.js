import React, { useContext } from 'react';
import { Context } from '../context/Store.js';
import { Backdrop, CircularProgress } from '@material-ui/core';
import AuthLayoutStyles from './AuthLayout.style.js';

const AuthLayout = ({ children }) => {
  const [store, dispatch] = useContext(Context);

  const classes = AuthLayoutStyles();

  return (
    <div className={classes.root}>
      {store.main.loading ? (
        <Backdrop className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className={classes.root}>{children}</div>
      )}
    </div>
  );
};

export default AuthLayout;
