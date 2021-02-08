import { Container, Grid } from "@material-ui/core";
import React from "react";
import OrdersDatatable from "../../containers/OrdersDatatable/index.js";
import OrdersToolbar from "../../containers/OrdersToolbar/index.js";
import globalStyles from "../../styles/global.js";

const Orders = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <OrdersToolbar />
          <OrdersDatatable />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Orders;
