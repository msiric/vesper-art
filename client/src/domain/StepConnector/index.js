import { StepConnector as MaterialStepConnector } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledStepConnector = withStyles({})(MaterialStepConnector);

const StepConnector = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledStepConnector ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default StepConnector;
