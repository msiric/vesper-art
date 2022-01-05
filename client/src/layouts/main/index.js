import React from "react";
import Footer from "../../containers/Footer/index";
import Header from "../../containers/Header/index";
import { useAppStore } from "../../contexts/global/app";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import CircularProgress from "../../domain/CircularProgress";
import mainStyles from "./styles";

const MainLayout = ({ children }) => {
  const loading = useAppStore((state) => state.loading);

  const classes = mainStyles();

  return (
    <Box className={classes.appRoot}>
      {loading ? (
        <Backdrop className={classes.appBackdrop} open={loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      ) : (
        [
          <Header />,
          <Box className={classes.appContainer}>{children}</Box>,
          <Footer />,
        ]
      )}
    </Box>
  );
};

export default MainLayout;
