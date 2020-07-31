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
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import NumberFormat from "react-number-format";
import { getStatistics, getSelection } from "../../services/user.js";
import DashboardCard from "../../components/DashboardCard/DashboardCard.js";
import { styled } from "@material-ui/core/styles";
import { compose, flexbox, typography, spacing } from "@material-ui/system";
import { artepunktTheme } from "../../constants/theme.js";

const GridContainer = styled(Grid)(compose(spacing, flexbox));
const GridItem = styled(Grid)(compose(flexbox));

const DashboardStatistics = ({ loading, cards, layout }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

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
