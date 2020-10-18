import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React, { useContext } from "react";
import Footer from "../components/Footer/Footer.js";
import Header from "../components/Header/Header.js";
import { AppContext } from "../contexts/App.js";
import MainLayoutStyles from "./MainLayout.style.js";

const MainLayout = ({ socket, children }) => {
  const [appStore] = useContext(AppContext);

  const classes = MainLayoutStyles();

  return (
    <div className={classes.appRoot}>
      {appStore.loading ? (
        <Backdrop className={classes.appBackdrop} open={appStore.loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      ) : (
        [
          <Header socket={socket} />,
          <Box className={classes.appContainer}>{children}</Box>,
          <Footer />,
        ]
      )}
    </div>
  );
};

export default MainLayout;
