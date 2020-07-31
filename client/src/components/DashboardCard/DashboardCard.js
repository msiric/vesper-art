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
import { styled } from "@material-ui/core/styles";
import {
  compose,
  flexbox,
  typography,
  border,
  sizing,
} from "@material-ui/system";

const DashboardCard = ({ currency, data, label, loading }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      border={1}
      height={150}
    >
      {currency
        ? [
            ,
            <Box className={classes.boxData}>
              {loading ? (
                <CircularProgress />
              ) : (
                <NumberFormat
                  value={data}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={2}
                  prefix={"$"}
                  style={{ fontSize: "3.5rem" }}
                />
              )}
            </Box>,
            <Divider />,
            <Box className={classes.boxFooter}>
              <Typography
                className={classes.boxAlt}
                color="textSecondary"
                style={{ textTransform: "capitalize" }}
              >
                {label}
              </Typography>
            </Box>,
          ]
        : [
            <Box className={classes.boxData}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography
                  className={classes.boxMain}
                  style={{ fontSize: "3.5rem" }}
                >
                  {data}
                </Typography>
              )}
            </Box>,
            <Divider />,
            <Box className={classes.boxFooter}>
              <Typography className={classes.text} color="textSecondary">
                {label}
              </Typography>
            </Box>,
          ]}
    </Box>
  );
};

export default DashboardCard;
