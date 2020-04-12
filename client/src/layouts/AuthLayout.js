import React from 'react';
import AuthLayoutStyles from './AuthLayout.style';

const AuthLayout = ({ children }) => {
  const classes = AuthLayoutStyles();

  return <div className={classes.root}>{children}</div>;
};

export default AuthLayout;
