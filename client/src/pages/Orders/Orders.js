import React, { useEffect } from "react";
import OrdersDatatable from "../../containers/OrdersDatatable/index";
import OrdersToolbar from "../../containers/OrdersToolbar/index";
import { useUserOrders } from "../../contexts/local/userOrders";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const Orders = () => {
  const retry = useUserOrders((state) => state.orders.error.retry);
  const redirect = useUserOrders((state) => state.orders.error.redirect);
  const message = useUserOrders((state) => state.orders.error.message);
  const resetOrders = useUserOrders((state) => state.resetOrders);

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetOrders();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={globalClasses.elementWidth}>
          <OrdersToolbar />
          <OrdersDatatable />
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default Orders;
