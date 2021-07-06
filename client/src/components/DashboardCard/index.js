import React from "react";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Typography from "../../domain/Typography";
import CurrencyValue from "../CurrencyValue/index";
import dashboardCardStyles from "./styles";

const DashboardCard = ({ currency, data, label, loading }) => {
  const classes = dashboardCardStyles();

  return (
    <Card className={classes.container}>
      <CardContent className={classes.dataWrapper}>
        {currency ? (
          <CurrencyValue
            loading={loading}
            value={data}
            className={classes.value}
          />
        ) : (
          <Typography className={classes.data} loading={loading}>
            {data || 0}
          </Typography>
        )}
      </CardContent>
      <Divider />
      <CardContent className={classes.labelWrapper}>
        <Typography
          className={classes.label}
          color="textSecondary"
          loading={loading}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
