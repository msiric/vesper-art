import { useQueryParam } from "@hooks/useQueryParam";
import React from "react";
import DropdownItems from "../../components/DropdownItems";
import {
  DEFAULT_ORDERS_DISPLAY,
  SUPPORTED_ORDERS_DISPLAYS,
  useUserOrders,
} from "../../contexts/local/userOrders";
import Grid from "../../domain/Grid";
import ordersToolbarStyles from "./styles";

const OrdersToolbar = () => {
  const display = useUserOrders((state) => state.display);
  const loading = useUserOrders((state) => state[display].loading);
  const changeSelection = useUserOrders((state) => state.changeSelection);

  useQueryParam(
    "display",
    display,
    DEFAULT_ORDERS_DISPLAY,
    SUPPORTED_ORDERS_DISPLAYS.map((item) => item.value),
    (value) => changeSelection({ selection: value })
  );

  const classes = ordersToolbarStyles();

  return (
    <Grid container>
      <Grid item className={classes.wrapper}>
        <DropdownItems
          value={display}
          onChange={(e) => changeSelection({ selection: e.target.value })}
          label="Display"
          loading={loading}
          items={SUPPORTED_ORDERS_DISPLAYS}
        />
      </Grid>
    </Grid>
  );
};

export default OrdersToolbar;
