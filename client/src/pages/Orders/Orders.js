import React, { useEffect } from "react";
import OrdersDatatable from "../../containers/OrdersDatatable/index.js";
import OrdersToolbar from "../../containers/OrdersToolbar/index.js";
import { useUserOrders } from "../../contexts/local/userOrders";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global.js";
import { containsErrors, renderError } from "../../utils/helpers.js";

const Orders = () => {
  const retry = useUserOrders((state) => state.orders.error.retry);
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
  }, []);

  return !containsErrors(retry) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12} className={globalClasses.elementWidth}>
          <OrdersToolbar />
          <OrdersDatatable />
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, message })
  );
};

export default Orders;
