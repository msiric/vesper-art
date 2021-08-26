import React from "react";
import { formatArtworkPrice } from "../../../../common/helpers";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Typography from "../../domain/Typography";
import dashboardCardStyles from "./styles";

const DashboardCard = ({ currency, data, label, loading }) => {
  const classes = dashboardCardStyles();

  return (
    <Card className={classes.container}>
      <CardContent className={classes.dataWrapper}>
        <Typography className={classes.data} loading={loading}>
          {formatArtworkPrice({
            price: data,
            prefix: currency ? "$" : "",
            freeFormat: currency ? "$0" : 0,
            withPrecision: currency,
            withAbbreviation: currency,
          })}
        </Typography>
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
