import { Paper as MaterialPaper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledPaper = withStyles({})(MaterialPaper);

const Paper = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledPaper ref={ref} {...props}>
          {children}
        </StyledPaper>
      </SkeletonWrapper>
    );
  }
);

export default Paper;
