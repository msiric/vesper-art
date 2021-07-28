import React from "react";
import Footer from "../../containers/Footer/index";
import { useAppStore } from "../../contexts/global/app";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import CircularProgress from "../../domain/CircularProgress";
import authStyles from "./styles";

const AuthLayout = ({ children }) => {
  const loading = useAppStore((state) => state.loading);

  const classes = authStyles();

  return (
    <Box className={classes.appRoot}>
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
    </Box>
  );
};

export default AuthLayout;
