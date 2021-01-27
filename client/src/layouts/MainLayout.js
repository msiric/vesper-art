import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";
import Footer from "../containers/Footer/Footer.js";
import Header from "../containers/Header/Header.js";
import { useTracked as useAppContext } from "../contexts/global/App.js";
import MainLayoutStyles from "./MainLayout.style.js";

const MainLayout = ({ socket, children }) => {
  const [appStore, appDispatch] = useAppContext();

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
