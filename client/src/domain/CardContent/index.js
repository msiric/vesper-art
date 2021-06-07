import { CardContent as MaterialCardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardContent = withStyles({})(MaterialCardContent);

const CardContent = ({
  loading = false,
  variant = "text",
  children,
  ...props
}) => {
  return (
    <SkeletonWrapper variant={variant} loading={loading}>
      <StyledCardContent {...props}>{children}</StyledCardContent>
    </SkeletonWrapper>
  );
};

export default CardContent;
