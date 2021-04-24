import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserStats } from "../../contexts/local/userStats";
import dashboardToolbarStyles from "./styles.js";

const DashboardToolbar = () => {
  const stripeId = useUserStore((state) => state.stripeId);

  const display = useUserStats((state) => state.display);
  const changeSelection = useUserStats((state) => state.changeSelection);
  const redirectDashboard = useUserStats((state) => state.redirectDashboard);

  const classes = dashboardToolbarStyles();

  return (
    <Grid container>
      <Grid item className={classes.dashboardToolbarHeader}>
        <Typography style={{ textTransform: "capitalize" }} variant="h6">
          Dashboard
        </Typography>
        {stripeId && (
          <Button
            variant="outlined"
            onClick={() => redirectDashboard({ stripeId })}
          >
            Stripe dashboard
          </Button>
        )}
      </Grid>
      <Grid item className={classes.dashboardToolbarHeader}>
        <Typography style={{ textTransform: "capitalize" }} variant="h6">
          Total stats
        </Typography>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          style={{ marginBottom: "12px" }}
        >
          <InputLabel id="data-display">Display</InputLabel>
          <Select
            labelId="data-display"
            value={display.type}
            onChange={(e) => changeSelection({ selection: e.target.value })}
            label="Display"
            margin="dense"
          >
            <MenuItem value="purchases">Purchases</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default DashboardToolbar;
