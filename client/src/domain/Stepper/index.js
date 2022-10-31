import { Stepper as MaterialStepper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledStepper = withStyles({})(MaterialStepper);

const Stepper = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledStepper ref={ref} {...props}>
          {children}
        </StyledStepper>
      </SkeletonWrapper>
    );
  }
);

export default Stepper;
