import { Popper as MaterialPopper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledPopper = withStyles({})(MaterialPopper);

const Popper = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledPopper ref={ref} {...props}>
          {children}
        </StyledPopper>
      </SkeletonWrapper>
    );
  }
);

export default Popper;
