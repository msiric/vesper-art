import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React, { useContext } from "react";
import Footer from "../containers/Footer/Footer.js";
import { AppContext } from "../contexts/App.js";
import AuthLayoutStyles from "./AuthLayout.style.js";

const AuthLayout = ({ children }) => {
  const [appStore] = useContext(AppContext);

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
