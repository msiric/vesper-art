import { useQueryState } from "@hooks/useUrlQueryParams";
import React from "react";
import DropdownItems from "../../components/DropdownItems";
import {
  SUPPORTED_ORDERS_DISPLAYS,
  useUserOrders,
} from "../../contexts/local/userOrders";
import Grid from "../../domain/Grid";
import ordersToolbarStyles from "./styles";

const OrderToolbar = () => {
  const display = useUserOrders((state) => state.display);
  const loading = useUserOrders((state) => state[display].loading);
  const changeSelection = useUserOrders((state) => state.changeSelection);
  // const [queryParams, setQueryParams] = useQueryParams({
  //   display,
  // });
  const [queryParams] = useQueryState({
    display,
  });

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

export default OrderToolbar;
