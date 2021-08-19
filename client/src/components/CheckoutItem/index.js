import AnimatedNumber from "animated-number-react";
import React from "react";
import NumberFormat from "react-number-format";
import { formatArtworkPrice } from "../../../../common/helpers";
import SkeletonWrapper from "../../components/SkeletonWrapper/index";
import Box from "../../domain/Box";
import ListItem from "../../domain/ListItem";
import ListItemText from "../../domain/ListItemText";
import Typography from "../../domain/Typography";
import checkoutItemStyles from "./styles";

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
  const formatValue = (value) =>
    formatArtworkPrice({ price: value, withPrecision: true });

  const classes = checkoutItemStyles();

  return (
    <ListItem key={key} disableGutters>
      <ListItemText
        primary={<Typography loading={loading}>{label}</Typography>}
        secondary={
          <Typography loading={loading} className={classes.description}>
            {description}
          </Typography>
        }
      />
      <ListItemText
        primary={<Typography loading={loading}>{amount}</Typography>}
        secondary={
          <Box>
            <SkeletonWrapper variant="text" loading={loading}>
              {prefix && <span className={classes.price}>{prefix}</span>}
              {animate ? (
                <AnimatedNumber
                  value={price}
                  formatValue={formatValue}
                  duration="500"
                  className={classes.price}
                />
              ) : (
                <NumberFormat
                  value={price}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={2}
                  prefix={"$"}
                  className={classes.price}
                />
              )}
            </SkeletonWrapper>
          </Box>
        }
        className={classes.wrapper}
      />
    </ListItem>
  );
};

export default CheckoutItem;
