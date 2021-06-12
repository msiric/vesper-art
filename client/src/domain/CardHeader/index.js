import { CardHeader as MaterialCardHeader } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardHeader = withStyles({})(MaterialCardHeader);

const CardHeader = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledCardHeader ref={ref} {...props}>
          {children}
        </StyledCardHeader>
      </SkeletonWrapper>
    );
  }
);

export default CardHeader;
