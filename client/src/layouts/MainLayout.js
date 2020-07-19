import React, { useContext } from 'react';
import { Context } from '../context/Store.js';
import { Backdrop, CircularProgress, Box } from '@material-ui/core';
import Header from '../shared/Header/Header.js';
import Footer from '../components/Footer/Footer.js';
import MainLayoutStyles from './MainLayout.style.js';

const MainLayout = ({ children }) => {
  const [store, dispatch] = useContext(Context);

  const classes = MainLayoutStyles();

  return (
    <div className={classes.root}>
      {store.main.loading ? (
        <Backdrop className={classes.backdrop} open={store.main.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      ) : (
        <>
          <Header />
          <Box className={classes.appContainer}>{children}</Box>
          <Footer />
        </>
      )}
    </div>
  );
};

export default MainLayout;
