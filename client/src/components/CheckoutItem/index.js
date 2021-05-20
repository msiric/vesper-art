import { ListItem, ListItemText, Typography } from "@material-ui/core";
import AnimatedNumber from "animated-number-react";
import React from "react";
import NumberFormat from "react-number-format";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import checkoutItemStyles from "./styles.js";

const CheckoutItem = ({
  label,
  description,
  prefix,
  amount,
  price,
  key,
  animate,
  loading,
}) => {
  const formatValue = (value) => `$${value.toFixed(2)}`;

  const classes = checkoutItemStyles();

  return (
    <ListItem className={classes.listItem} key={key} disableGutters>
      <ListItemText
        primary={
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography>{label}</Typography>
          </SkeletonWrapper>
        }
        secondary={
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography className={classes.checkoutItemDescription}>
              {description}
            </Typography>
          </SkeletonWrapper>
        }
      />
      <ListItemText
        primary={
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography className={classes.rightList}>{amount}</Typography>
          </SkeletonWrapper>
        }
        secondary={
          <div className={classes.rightList}>
            <SkeletonWrapper variant="text" loading={loading}>
              {prefix && (
                <span className={classes.checkoutItemPrice}>{prefix}</span>
              )}
              {animate ? (
                <AnimatedNumber
                  value={price}
                  formatValue={formatValue}
                  duration="500"
                  className={classes.checkoutItemPrice}
                />
              ) : (
                <NumberFormat
                  value={price}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={2}
                  prefix={"$"}
                  className={classes.checkoutItemPrice}
                />
              )}
            </SkeletonWrapper>
          </div>
        }
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      />
    </ListItem>
  );
};

export default CheckoutItem;
