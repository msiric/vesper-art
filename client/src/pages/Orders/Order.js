import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef } from "react";
import DownloadCard from "../../containers/DownloadCard/index";
import LicenseCard from "../../containers/LicenseCard/index";
import OrderCard from "../../containers/OrderCard/index";
import OrderPreview from "../../containers/OrderPreview/index";
import RatingWrapper from "../../containers/RatingWrapper/index";
import ReviewCard from "../../containers/ReviewCard/index";
import UserSection from "../../containers/UserSection/index";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const useOrderStyles = makeStyles((muiTheme) => ({
  container: {
    position: "relative",
  },
  stickyWrapper: {
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    [muiTheme.breakpoints.down("sm")]: {
      position: "static",
      flexDirection: "row",
    },
    [muiTheme.breakpoints.down("xs")]: {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} md={8}>
          <Box className={classes.stickyWrapper}>
            <OrderPreview paramId={paramId} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={classes.stickyWrapper}>
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
          </Box>
        </Grid>
        <Grid item xs={12} className={globalClasses.elementWidth}>
          <Box className={globalClasses.bottomSpacing}>
            <OrderCard />
          </Box>
          <LicenseCard />
        </Grid>
        <RatingWrapper paramId={paramId} />
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default Order;
