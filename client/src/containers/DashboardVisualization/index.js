import { Box, Grid } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, flexbox, spacing, typography } from "@material-ui/system";
import { format } from "date-fns";
import React, { useEffect } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardCard from "../../components/DashboardCard/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserStats } from "../../contexts/local/userStats";
import { artepunktTheme, Card } from "../../styles/theme.js";
import dashboardVisualizationStyles from "./styles.js";

const GridContainer = styled(Grid)(compose(spacing, flexbox));
const GridItem = styled(Grid)(compose(typography));

const DashboardVisualization = () => {
  const userId = useUserStore((state) => state.id);

  const selectedStats = useUserStats((state) => state.selectedStats.data);
  const loading = useUserStats((state) => state.selectedStats.loading);
  const graphData = useUserStats((state) => state.graphData);
  const display = useUserStats((state) => state.display);
  const range = useUserStats((state) => state.range);
  const fetchSelectedData = useUserStats((state) => state.fetchSelectedData);

  const cards = [
    {
      data: selectedStats[display.label],
      label: display.label,
      currency: true,
    },
    {
      data: selectedStats.licenses.personal,
      label: "Personal licenses",
      currency: false,
    },
    {
      data: selectedStats.licenses.commercial,
      label: "Commercial licenses",
      currency: false,
    },
  ];

  useEffect(() => {
    if (range[0] && range[1]) {
      const dateFrom = format(new Date(range[0]), "MM/dd/yyyy");
      const dateTo = format(new Date(range[1]), "MM/dd/yyyy");
      fetchSelectedData({ userId, display, dateFrom, dateTo });
    }
  }, [range, display.type]);

  const classes = dashboardVisualizationStyles();

  return (
    <Grid container spacing={2} className={classes.graphArea}>
      <GridItem item xs={12} md={8} mb={artepunktTheme.margin.spacing}>
        <Box className={classes.graph}>
          <Card p={2}>
            <SkeletonWrapper loading={loading} width="100%">
              <Box className={classes.dashboardVisualizationChart}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphData}
                    margin={{
                      top: 5,
                      left: 5,
                      bottom: 5,
                      right: 5,
                    }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis tick={false} width={1} />
                    <Tooltip />
                    <Legend />
                    <Line
                      name="Personal licenses"
                      type="monotone"
                      dataKey="pl"
                      stroke="#8884d8"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      name="Commercial licenses"
                      type="monotone"
                      dataKey="cl"
                      stroke="#82ca9d"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </SkeletonWrapper>
          </Card>
        </Box>
      </GridItem>
      <GridItem item xs={12} md={4} className={classes.grid}>
        <GridContainer
          container
          mb={artepunktTheme.margin.spacing}
          display="flex"
          flexDirection="row"
          spacing={2}
        >
          {cards.map((card) => (
            <GridItem item xs={12} md={12}>
              <DashboardCard
                currency={card.currency}
                data={card.data}
                label={card.label}
                loading={loading}
              />
            </GridItem>
          ))}
        </GridContainer>
      </GridItem>
    </Grid>
  );
};

export default DashboardVisualization;
