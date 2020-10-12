import { Backdrop, Box, CircularProgress } from '@material-ui/core';
import React, { useContext } from 'react';
import Footer from '../components/Footer/Footer.js';
import Header from '../components/Header/Header.js';
import { Context } from '../context/Store.js';
import MainLayoutStyles from './MainLayout.style.js';

const MainLayout = ({ children }) => {
  const [store, dispatch] = useContext(Context);

  const classes = MainLayoutStyles();

  return (
    <div className={classes.appRoot}>
      {store.main.loading ? (
        <Backdrop className={classes.appBackdrop} open={store.main.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      ) : (
          [
            <Header />,
            <Box className={classes.appContainer}>{children}</Box>,
            <Footer />
          ]
      )}
    </div>
  );
};

export default MainLayout;
