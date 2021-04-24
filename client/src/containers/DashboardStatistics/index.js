import { Grid } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, flexbox, spacing } from "@material-ui/system";
import React, { useEffect } from "react";
import DashboardCard from "../../components/DashboardCard/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserStats } from "../../contexts/local/userStats";
import { artepunktTheme } from "../../styles/theme.js";
import dashboardStatisticsStyles from "./styles.js";

const GridContainer = styled(Grid)(compose(spacing, flexbox));
const GridItem = styled(Grid)(compose(flexbox));

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
    <GridContainer
      container
      mb={artepunktTheme.margin.spacing}
      display="flex"
      flexDirection="row"
      spacing={2}
    >
      {cards.map((card) => (
        <GridItem item xs={12} md={layout === "row" ? 12 / cards.length : 12}>
          <DashboardCard
            currency={card.currency}
            data={card.data}
            label={card.label}
            loading={loading}
          />
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default DashboardStatistics;
