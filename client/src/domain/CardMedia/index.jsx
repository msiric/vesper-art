import { CardMedia as MaterialCardMedia } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCardMedia = withStyles({})(MaterialCardMedia);

const CardMedia = forwardRef(
  ({ loading = false, variant = "rect", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledCardMedia ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default CardMedia;
