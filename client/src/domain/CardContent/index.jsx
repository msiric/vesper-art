import { CardContent as MaterialCardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardContent = withStyles({})(MaterialCardContent);

const CardContent = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledCardContent ref={ref} {...props}>
          {children}
        </StyledCardContent>
      </SkeletonWrapper>
    );
  }
);

export default CardContent;
