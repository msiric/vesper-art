import React, { useContext } from 'react';
import { Context } from '../context/Store.js';
import { Backdrop, CircularProgress, Box } from '@material-ui/core';
import Footer from '../components/Footer/Footer.js';
import AuthLayoutStyles from './AuthLayout.style.js';

const AuthLayout = ({ children }) => {
  const [store, dispatch] = useContext(Context);

  const classes = AuthLayoutStyles();

  return (
    <div className={classes.appRoot}>
      {store.main.loading ? (
        <Backdrop className={classes.appBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Box className={classes.appContainer}>{children}</Box>
          <Footer />
        </>
      )}
    </div>
  );
};

export default AuthLayout;
