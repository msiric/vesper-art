import { CircularProgress as MaterialCircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";

const StyledCircularProgress = withStyles({})(MaterialCircularProgress);

const CircularProgress = forwardRef((props, ref) => {
  return <StyledCircularProgress ref={ref} {...props}></StyledCircularProgress>;
});

export default CircularProgress;
