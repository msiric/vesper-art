import { Typography } from "@material-ui/core";
import React from "react";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import mainHeadingStyles from "./styles.js";

const MainHeading = ({ text, loading, style, ...rest }) => {
  const classes = mainHeadingStyles();

  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <Typography variant="h5" style={{ ...style }} {...rest}>
        {text}
      </Typography>
    </SkeletonWrapper>
  );
};

export default MainHeading;
