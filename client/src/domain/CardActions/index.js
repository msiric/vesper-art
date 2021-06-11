import { CardActions as MaterialCardActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardActions = withStyles({})(MaterialCardActions);

const CardActions = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledCardActions ref={ref} {...props}>
          {children}
        </StyledCardActions>
      </SkeletonWrapper>
    );
  }
);

export default CardActions;
