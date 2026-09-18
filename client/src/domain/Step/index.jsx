import { Step as MaterialStep } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledStep = withStyles({})(MaterialStep);

const Step = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledStep ref={ref} {...props}>
          {children}
        </StyledStep>
      </SkeletonWrapper>
    );
  }
);

export default Step;
