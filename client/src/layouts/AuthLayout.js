import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";
import Footer from "../containers/Footer/Footer.js";
import { useAppStore } from "../contexts/global/app.js";
import AuthLayoutStyles from "./AuthLayout.style.js";

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
