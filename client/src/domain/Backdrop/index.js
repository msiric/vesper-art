import { Backdrop as MaterialBackdrop } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledBackdrop = withStyles({})(MaterialBackdrop);

const Backdrop = forwardRef(
  ({ loading = false, variant = "rect", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledBackdrop ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default Backdrop;
