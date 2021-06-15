import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef } from "react";
import DownloadCard from "../../containers/DownloadCard/index.js";
import LicenseCard from "../../containers/LicenseCard/index.js";
import OrderCard from "../../containers/OrderCard/index.js";
import OrderPreview from "../../containers/OrderPreview/index.js";
import RatingWrapper from "../../containers/RatingWrapper/index.js";
import ReviewCard from "../../containers/ReviewCard/index.js";
import UserSection from "../../containers/UserSection/index.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global.js";
import { containsErrors, renderError } from "../../utils/helpers.js";

const useOrderStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    [muiTheme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
    [muiTheme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  ownerWrapper: {
    [muiTheme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
  actions: {
    [muiTheme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
}));

const Order = ({ match }) => {
  const retry = useOrderDetails((state) => state.order.error.retry);
  const redirect = useOrderDetails((state) => state.order.error.redirect);
  const message = useOrderDetails((state) => state.order.error.message);
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

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <OrderPreview paramId={paramId} />
        </Grid>
        <Grid item xs={12} md={4} className={classes.container}>
          <Box
            className={`${classes.ownerWrapper} ${globalClasses.responsiveSpacing}`}
          >
            <UserSection />
          </Box>
          <Box className={classes.actions}>
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
  ) : (
    renderError({ retry, redirect, message })
  );
};

export default Order;
