import React, { useContext } from 'react';
import { Context } from '../context/Store.js';
import { Backdrop, CircularProgress } from '@material-ui/core';
import Header from '../shared/Header/Header.js';
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
          {children}
        </>
      )}
    </div>
  );
};

export default MainLayout;
