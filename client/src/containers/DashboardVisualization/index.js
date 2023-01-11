import Box from "@domain/Box";
import Typography from "@domain/Typography";
import { artepunktTheme } from "@styles/theme";
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
import DashboardCard from "../../components/DashboardCard/index";
import { useUserStore } from "../../contexts/global/user";
import { useUserStats } from "../../contexts/local/userStats";
import Card from "../../domain/Card";
import Grid from "../../domain/Grid";
import dashboardVisualizationStyles from "./styles";

const ChartTooltip = ({ payload }) => {
  const classes = dashboardVisualizationStyles();

  return (
    <Box>
      {payload.map((item) => (
        <Box key={item.name} className={classes.content}>
          <Typography>{`${item.name}:\u00A0`}</Typography>
          <Typography style={{ color: item.color }}>{item.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const DashboardVisualization = () => {
  const userId = useUserStore((state) => state.id);

  const selectedStats = useUserStats((state) => state.selectedStats.data);
  const loading = useUserStats((state) => state.selectedStats.loading);
  const graphData = useUserStats((state) => state.graphData);
  const display = useUserStats((state) => state.display);
  const range = useUserStats((state) => state.range);
  const fetchSelectedData = useUserStats((state) => state.fetchSelectedData);

  const classes = dashboardVisualizationStyles();

  const cards = [
    {
      data: selectedStats[display],
      label: display === "purchases" ? "Spent" : "Earned",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, range, display]);

  return (
    <Grid container spacing={2}>
      <Grid className={classes.container} item xs={12} md={8}>
        <Card className={classes.card}>
          <Box className={classes.chart} loading={loading}>
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
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line
                  name="Personal licenses"
                  type="monotone"
                  dataKey="pl"
                  stroke={artepunktTheme.palette.primary.main}
                  activeDot={{ r: 6 }}
                />
                <Line
                  name="Commercial licenses"
                  type="monotone"
                  dataKey="cl"
                  stroke={artepunktTheme.palette.secondary.main}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2} className={classes.wrapper}>
          {cards.map((card, index) => (
            <Grid
              key={card.label}
              item
              xs={12}
              sm={index !== cards.length - 1 ? 6 : 8}
              md={12}
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
      </Grid>
    </Grid>
  );
};

export default DashboardVisualization;
