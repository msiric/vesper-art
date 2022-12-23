import { AccountBalanceRounded as StripeIcon } from "@material-ui/icons";
import React from "react";
import AsyncButton from "../../components/AsyncButton/index";
import DropdownItems from "../../components/DropdownItems/index";
import MainHeading from "../../components/MainHeading/index";
import SubHeading from "../../components/SubHeading/index";
import { useUserStore } from "../../contexts/global/user";
import {
  SUPPORTED_STATS_DISPLAYS,
  useUserStats,
} from "../../contexts/local/userStats";
import Grid from "../../domain/Grid";
import dashboardToolbarStyles from "./styles";

const DashboardToolbar = () => {
  const stripeId = useUserStore((state) => state.stripeId);
  const onboarded = useUserStore((state) => state.onboarded);

  const display = useUserStats((state) => state.display);
  const loading = useUserStats((state) => state.aggregateStats.loading);
  const changeSelection = useUserStats((state) => state.changeSelection);
  const redirectDashboard = useUserStats((state) => state.redirectDashboard);
  const redirecting = useUserStats((state) => state.redirecting);

  const classes = dashboardToolbarStyles();

  return (
    <Grid container>
      <Grid item className={classes.wrapper}>
        <MainHeading text="Dashboard" />
        {onboarded && (
          <AsyncButton
            variant="outlined"
            onClick={() => redirectDashboard({ stripeId })}
            startIcon={<StripeIcon />}
            disabled={redirecting}
            submitting={redirecting}
          >
            Stripe dashboard
          </AsyncButton>
        )}
      </Grid>
      <Grid item className={classes.wrapper}>
        <SubHeading text="Aggregate data" />
        <DropdownItems
          value={display}
          onChange={(e) => changeSelection({ selection: e.target.value })}
          label="Display"
          loading={loading}
          items={SUPPORTED_STATS_DISPLAYS}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardToolbar;
