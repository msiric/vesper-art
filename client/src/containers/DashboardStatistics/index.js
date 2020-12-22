import { Grid } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, flexbox, spacing } from "@material-ui/system";
import React from "react";
import DashboardCard from "../../components/DashboardCard/index.js";
import { artepunktTheme } from "../../styles/theme.js";
import dashboardStatisticsStyles from "./styles.js";

const GridContainer = styled(Grid)(compose(spacing, flexbox));
const GridItem = styled(Grid)(compose(flexbox));

const DashboardStatistics = ({ loading, cards, layout }) => {
  const classes = dashboardStatisticsStyles();

  return (
    <GridContainer
      container
      mb={artepunktTheme.margin.spacing}
      display="flex"
      flexDirection={layout}
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
