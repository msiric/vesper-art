import { MenuItem as MaterialMenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledMenuItem = withStyles({})(MaterialMenuItem);

const MenuItem = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledMenuItem ref={ref} {...props}>
        {children}
      </StyledMenuItem>
    </SkeletonWrapper>
  );
});

export default MenuItem;
