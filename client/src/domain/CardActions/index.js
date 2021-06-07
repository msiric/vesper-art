import { CardActions as MaterialCardActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardActions = withStyles({})(MaterialCardActions);

const CardActions = ({
  loading = false,
  variant = "text",
  children,
  ...props
}) => {
  return (
    <SkeletonWrapper variant={variant} loading={loading}>
      <StyledCardActions {...props}>{children}</StyledCardActions>
    </SkeletonWrapper>
  );
};

export default CardActions;
