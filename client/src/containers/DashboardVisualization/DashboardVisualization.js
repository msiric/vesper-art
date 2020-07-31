import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context/Store.js";
import {
  Container,
  Grid,
  CircularProgress,
  Paper,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import DateRangePicker from "../../shared/DateRangePicker/DateRangePicker.js";
import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import { format, eachDayOfInterval, subDays } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Text,
} from "recharts";
import NumberFormat from "react-number-format";
import { getStatistics, getSelection } from "../../services/user.js";
import SelectInput from "@material-ui/core/Select/SelectInput";
import DashboardCard from "../../components/DashboardCard/DashboardCard.js";
import DashboardStatistics from "../DashboardStatistics/DashboardStatistics.js";
import { styled } from "@material-ui/core/styles";
import { compose, flexbox, typography } from "@material-ui/system";
import { artepunktTheme } from "../../constants/theme.js";

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
    <Grid container className={classes.graphArea}>
      <GridItem item xs={12} md={8} mb={artepunktTheme.margin.spacing}>
        <Box className={classes.graph}>
          <Box className={classes.graphContainer}>
            {loading ? (
              <Grid item xs={12} className={classes.loader}>
                <CircularProgress />
              </Grid>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
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
            )}
          </Box>
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
