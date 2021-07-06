import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";
import Footer from "../containers/Footer/index";
import { useAppStore } from "../contexts/global/app";
import AuthLayoutStyles from "./AuthLayout.style";

const AuthLayout = ({ children }) => {
  const loading = useAppStore((state) => state.loading);

  const classes = AuthLayoutStyles();

  return (
    <div className={classes.appRoot}>
      {loading ? (
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
