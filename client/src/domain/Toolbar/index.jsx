import { Toolbar as MaterialToolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledToolbar = withStyles({})(MaterialToolbar);

const Toolbar = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="rect" loading={loading}>
      <StyledToolbar ref={ref} {...props}>
        {children}
      </StyledToolbar>
    </SkeletonWrapper>
  );
});

export default Toolbar;
