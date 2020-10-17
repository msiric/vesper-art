import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { HourglassEmptyRounded as EmptyIcon } from "@material-ui/icons";
import React from "react";
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper";

const useStyles = makeStyles({});

const EmptySection = ({ label, loading }) => {
  const classes = useStyles();

  return (
    <SkeletonWrapper loading={loading}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "126px 0",
        }}
      >
        <EmptyIcon style={{ fontSize: 56, marginBottom: 20 }} />
        <Typography variant="body2">{label}</Typography>
      </Box>
    </SkeletonWrapper>
  );
};

export default EmptySection;
