import { Typography } from "@material-ui/core";
import React from "react";
import mainHeadingStyles from "./styles.js";

const MainHeading = ({ text, ...rest }) => {
  const classes = mainHeadingStyles();

  return (
    <Typography variant="h6" {...rest}>
      {text}
    </Typography>
  );
};

export default MainHeading;
