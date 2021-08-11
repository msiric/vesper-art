import React from "react";
import DropdownItems from "../../components/DropdownItems";
import { useUserOrders } from "../../contexts/local/userOrders";
import Grid from "../../domain/Grid";
import ordersToolbarStyles from "./styles";

const OrderToolbar = () => {
  const display = useUserOrders((state) => state.display);
  const loading = useUserOrders((state) => state.orders.loading);
  const changeSelection = useUserOrders((state) => state.changeSelection);

  const menuItems = [
    { value: "purchases", text: "Purchases" },
    { value: "sales", text: "Sales" },
  ];

  const classes = ordersToolbarStyles();

  return (
    <Grid container>
      <Grid item className={classes.wrapper}>
        <DropdownItems
          value={display}
          onChange={(e) => changeSelection({ selection: e.target.value })}
          label="Display"
          loading={loading}
          items={menuItems}
        />
      </Grid>
    </Grid>
  );
};

export default OrderToolbar;
