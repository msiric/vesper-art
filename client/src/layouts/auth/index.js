import React from "react";
import { useHistory } from "react-router-dom";
import LogoDesktop from "../../assets/images/logo/logo4.svg";
import { useAppStore } from "../../contexts/global/app";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CircularProgress from "../../domain/CircularProgress";
import authStyles from "./styles";

const AuthLayout = ({ children }) => {
  const loading = useAppStore((state) => state.loading);

  const history = useHistory();
  const classes = authStyles();

  return (
    <Box className={classes.appRoot}>
      {loading ? (
        <Backdrop className={classes.appBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box className={classes.appWrapper}>
          <img
            src={LogoDesktop}
            alt="Logo"
            onClick={() => history.push("/")}
            className={classes.appLogo}
          />
          <Card className={classes.appContainer}>{children}</Card>
        </Box>
      )}
    </Box>
  );
};

export default AuthLayout;
