import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef } from "react";
import DownloadCard from "../../components/DownloadCard/index.js";
import OrderCard from "../../components/OrderCard/index.js";
import RatingWrapper from "../../components/RatingWrapper/index.js";
import LicenseCard from "../../containers/LicenseCard/index.js";
import OrderPreview from "../../containers/OrderPreview/index.js";
import ReviewCard from "../../containers/ReviewCard/index.js";
import UserSection from "../../containers/UserSection/index.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import globalStyles from "../../styles/global.js";

const useOrderStyles = makeStyles((muiTheme) => ({
  orderContainerLg: {
    display: "flex",
    flexDirection: "column",
    [muiTheme.breakpoints.down("sm")]: {
      display: "none",
    },
    [muiTheme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  orderContainerMd: {
    display: "flex",
    [muiTheme.breakpoints.down("xs")]: {
      display: "none",
    },
    [muiTheme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  userSection: {
    flex: 1,
  },
  actionSection: {
    flex: 1,
  },
}));

const Order = ({ match }) => {
  const resetOrder = useOrderDetails((state) => state.resetOrder);

  const globalClasses = globalStyles();
  const classes = useOrderStyles();

  const paramId = match.params.id;
  const highlightRef = useRef(null);

  const reinitializeState = () => {
    resetOrder();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <OrderPreview paramId={paramId} />
        </Grid>
        <Grid item xs={12} md={4} className={classes.orderContainerLg}>
          <Box className={globalClasses.bottomSpacing}>
            <UserSection />
          </Box>
          <Box className={globalClasses.bottomSpacing}>
            <ReviewCard paramId={paramId} highlightRef={highlightRef} />
          </Box>
          <Box>
            <DownloadCard />
          </Box>
        </Grid>
        <Grid item xs={12} md={4} className={classes.orderContainerMd}>
          <Box
            className={`${classes.userSection} ${globalClasses.rightSpacing}`}
          >
            <UserSection />
          </Box>
          <Box className={classes.actionSection}>
            <Box className={globalClasses.bottomSpacing}>
              <ReviewCard paramId={paramId} highlightRef={highlightRef} />
            </Box>
            <Box>
              <DownloadCard />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} className={globalClasses.elementWidth}>
          <Box className={globalClasses.bottomSpacing}>
            <OrderCard />
          </Box>
          <LicenseCard />
        </Grid>
      </Grid>
      <RatingWrapper paramId={paramId} />
    </Container>
  );
};

export default Order;
