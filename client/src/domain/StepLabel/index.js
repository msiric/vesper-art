import { StepLabel as MaterialStepLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledStepLabel = withStyles({})(MaterialStepLabel);

const StepLabel = forwardRef(
  ({ loading = false, variant = "rect", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledStepLabel ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default StepLabel;
