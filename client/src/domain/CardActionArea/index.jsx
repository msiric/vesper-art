import { CardActionArea as MaterialCardActionArea } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardActionArea = withStyles({})(MaterialCardActionArea);

const CardActionArea = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledCardActionArea ref={ref} {...props}>
          {children}
        </StyledCardActionArea>
      </SkeletonWrapper>
    );
  }
);

export default CardActionArea;
