import { Badge as MaterialBadge } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledBadge = withStyles({})(MaterialBadge);

const Badge = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledBadge ref={ref} {...props}>
          {children}
        </StyledBadge>
      </SkeletonWrapper>
    );
  }
);

export default Badge;
