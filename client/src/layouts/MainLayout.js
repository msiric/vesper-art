import React from 'react';
import Header from '../shared/Header/Header';
import MainLayoutStyles from './MainLayout.style';

const MainLayout = ({ children }) => {
  const classes = MainLayoutStyles();

  return (
    <div className={classes.root}>
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
