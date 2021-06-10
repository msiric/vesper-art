import React from "react";
import AsyncButton from "../../components/AsyncButton/index.js";
import DropdownItems from "../../components/DropdownItems/index.js";
import MainHeading from "../../components/MainHeading/index.js";
import SubHeading from "../../components/SubHeading/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserStats } from "../../contexts/local/userStats";
import Grid from "../../domain/Grid";
import dashboardToolbarStyles from "./styles.js";

const DashboardToolbar = () => {
  const stripeId = useUserStore((state) => state.stripeId);

  const display = useUserStats((state) => state.display);
  const loading = useUserStats((state) => state.aggregateStats.loading);
  const changeSelection = useUserStats((state) => state.changeSelection);
  const redirectDashboard = useUserStats((state) => state.redirectDashboard);

  const menuItems = [
    { value: "purchases", text: "Purchases" },
    { value: "sales", text: "Sales" },
  ];

  const classes = dashboardToolbarStyles();

  return (
    <Grid container>
      <Grid item className={classes.dashboardToolbarHeader}>
        <MainHeading text="Dashboard" />
        {stripeId && (
          <AsyncButton
            variant="outlined"
            onClick={() => redirectDashboard({ stripeId })}
          >
            Stripe dashboard
          </AsyncButton>
        )}
      </Grid>
      <Grid item className={classes.dashboardToolbarHeader}>
        <SubHeading text="Total stats" />
        <DropdownItems
          value={display.type}
          onChange={(e) => changeSelection({ selection: e.target.value })}
          label="Display"
          loading={loading}
          items={menuItems}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardToolbar;
