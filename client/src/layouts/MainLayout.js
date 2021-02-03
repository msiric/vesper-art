import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";
import Footer from "../containers/Footer/Footer.js";
import Header from "../containers/Header/Header.js";
import { useAppStore } from "../contexts/global/app.js";
import MainLayoutStyles from "./MainLayout.style.js";

const MainLayout = ({ children }) => {
  const loading = useAppStore((state) => state.loading);

  const classes = MainLayoutStyles();

  return (
    <div className={classes.appRoot}>
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
    </div>
  );
};

export default MainLayout;
