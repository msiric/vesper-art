import React from "react";
import LogoItem from "../../components/LogoItem";
import { useAppStore } from "../../contexts/global/app";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
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
        <Box className={classes.appWrapper}>
          <LogoItem style={classes.appLogo} />
          <Card className={classes.appContainer}>{children}</Card>
        </Box>
      )}
    </Box>
  );
};

export default AuthLayout;
