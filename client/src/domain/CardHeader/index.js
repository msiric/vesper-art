import { CardHeader as MaterialCardHeader } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardHeader = withStyles({})(MaterialCardHeader);

const CardHeader = ({ loading = false, variant = "text", children, props }) => {
  return (
    <SkeletonWrapper variant={variant} loading={loading}>
      <StyledCardHeader {...props}>{children}</StyledCardHeader>
    </SkeletonWrapper>
  );
};

export default CardHeader;
