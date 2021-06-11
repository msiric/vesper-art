import { Box as MaterialIcon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledIcon = withStyles({})(MaterialIcon);

const Icon = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="circle" loading={loading}>
      <StyledIcon ref={ref} {...props}>
        {children}
      </StyledIcon>
    </SkeletonWrapper>
  );
});

export default Icon;
