import { LinearProgress as MaterialLinearProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";

const StyledLinearProgress = withStyles({})(MaterialLinearProgress);

const LinearProgress = forwardRef(({ variant = "query", ...props }, ref) => {
  return (
    <StyledLinearProgress
      ref={ref}
      variant={variant}
      {...props}
    ></StyledLinearProgress>
  );
});

export default LinearProgress;
