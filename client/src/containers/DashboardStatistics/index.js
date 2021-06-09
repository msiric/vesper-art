import React, { useEffect } from "react";
import DashboardCard from "../../components/DashboardCard/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserStats } from "../../contexts/local/userStats";
import Grid from "../../domain/Grid";
import dashboardStatisticsStyles from "./styles.js";

const DashboardStatistics = ({ layout }) => {
  const userId = useUserStore((state) => state.id);

  const aggregateStats = useUserStats((state) => state.aggregateStats.data);
  const loading = useUserStats((state) => state.aggregateStats.loading);
  const display = useUserStats((state) => state.display);
  const fetchAggregateStats = useUserStats(
    (state) => state.fetchAggregateStats
  );

  const cards = [
    {
      data:
        display.type === "purchases"
          ? aggregateStats.favorites
          : aggregateStats.rating || "/",
      label: display.type === "purchases" ? "Favorites" : "Rating",
      currency: false,
    },
    {
      data: aggregateStats.orders,
      label: "Orders",
      currency: false,
    },
    {
      data: aggregateStats[display.label],
      label: display.label,
      currency: true,
    },
  ];

  const classes = dashboardStatisticsStyles();

  useEffect(() => {
    fetchAggregateStats({ userId, display });
  }, [display.type]);

  return (
    <Grid
      container
      spacing={2}
      className={classes.dashboardStatisticsContainer}
    >
      {cards.map((card, index) => (
        <Grid
          item
          xs={12}
          sm={index !== cards.length - 1 ? 6 : 8}
          md={layout === "row" ? 12 / cards.length : 12}
        >
          <DashboardCard
            currency={card.currency}
            data={card.data}
            label={card.label}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStatistics;
