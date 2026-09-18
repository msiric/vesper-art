import { Divider as MaterialDivider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledDivider = withStyles({})(MaterialDivider);

const Divider = forwardRef(
  ({ loading = false, variant = "rect", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledDivider ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default Divider;
