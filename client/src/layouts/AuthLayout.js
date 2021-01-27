import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";
import Footer from "../containers/Footer/Footer.js";
import { useTracked as useAppContext } from "../contexts/global/App.js";
import AuthLayoutStyles from "./AuthLayout.style.js";

const AuthLayout = ({ children }) => {
  const [appStore, appDispatch] = useAppContext();

  const classes = AuthLayoutStyles();

  return (
    <div className={classes.appRoot}>
      {appStore.loading ? (
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
