import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { HourglassEmptyRounded as EmptyIcon } from "@material-ui/icons";
import React from "react";
import SkeletonWrapper from "../SkeletonWrapper/index";
import emptySectionStyles from "./styles";

const useStyles = makeStyles({});

const EmptySection = ({ label, page, loading }) => {
  const classes = emptySectionStyles();

  const content = (
    <SkeletonWrapper loading={loading}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "126px 0",
          cursor: "default",
        }}
      >
        <EmptyIcon style={{ fontSize: 56, marginBottom: 20 }} />
        <Typography variant="body2" style={{ textTransform: "none" }}>
          {label}
        </Typography>
      </Box>
    </SkeletonWrapper>
  );

  return page ? (
    <Grid
      item
      sm={12}
      style={{
        height: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {content}
    </Grid>
  ) : (
    content
  );
};

export default EmptySection;
