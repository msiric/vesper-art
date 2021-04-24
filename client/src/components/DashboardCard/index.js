import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, flexbox, sizing, spacing } from "@material-ui/system";
import React from "react";
import NumberFormat from "react-number-format";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import dashboardCardStyles from "./styles.js";

const CardContainer = styled(Card)(compose(spacing, flexbox, sizing));
const CardItem = styled(CardContent)(compose(spacing, flexbox, sizing));

const DashboardCard = ({ currency, data, label, loading }) => {
  const classes = dashboardCardStyles();

  return (
    <CardContainer
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      border={1}
      height={180}
      className={classes.dashboardCardContainer}
    >
      <CardItem
        style={{ display: "flex" }}
        justifyContent="center"
        alignItems="center"
        height={120}
      >
        {currency ? (
          <SkeletonWrapper loading={loading} width="100%">
            <NumberFormat
              value={data || "0"}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={2}
              prefix={"$"}
              style={{
                fontSize: "3.5rem",
                textAlign: "center",
                display: "block",
                height: 84,
              }}
            />
          </SkeletonWrapper>
        ) : (
          <SkeletonWrapper variant="text" loading={loading} width="100%">
            <Typography
              className={classes.boxMain}
              style={{ fontSize: "3.5rem" }}
              align="center"
            >
              {data || 0}
            </Typography>
          </SkeletonWrapper>
        )}
      </CardItem>
      <Divider />
      <CardItem
        style={{ display: "flex" }}
        justifyContent="center"
        alignItems="center"
        height={60}
      >
        <SkeletonWrapper variant="text" loading={loading} width="100%">
          <Typography
            className={classes.boxAlt}
            color="textSecondary"
            style={{ textTransform: "capitalize" }}
            align="center"
          >
            {label}
          </Typography>
        </SkeletonWrapper>
      </CardItem>
    </CardContainer>
  );
};

export default DashboardCard;
