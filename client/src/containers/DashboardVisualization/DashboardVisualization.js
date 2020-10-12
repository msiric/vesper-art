import { Box, Grid } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, typography } from "@material-ui/system";
import React, { useContext } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Context } from "../../context/Store.js";
import { artepunktTheme, Card } from "../../styles/theme.js";
import DashboardStatistics from "../DashboardStatistics/DashboardStatistics.js";

const GridItem = styled(Grid)(compose(typography));

const DashboardVisualization = ({
  display,
  graphData,
  selectedStats,
  loading,
}) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Grid container className={classes.graphArea} spacing={6}>
      <GridItem item xs={12} md={8} mb={artepunktTheme.margin.spacing}>
        <Box className={classes.graph}>
          <Card m={1} p={2}>
            <SkeletonWrapper loading={loading} width="100%">
              <Box height={540}>
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
        <DashboardStatistics
          loading={loading}
          cards={[
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
          ]}
          layout="column"
        />
      </GridItem>
    </Grid>
  );
};

export default DashboardVisualization;
