import { AppBar as MaterialAppBar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledAppBar = withStyles({})(MaterialAppBar);

const AppBar = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledAppBar ref={ref} {...props}>
          {children}
        </StyledAppBar>
      </SkeletonWrapper>
    );
  }
);

export default AppBar;
