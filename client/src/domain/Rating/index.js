import { withStyles } from "@material-ui/core/styles";
import { Rating as MaterialRating } from "@material-ui/lab";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledRating = withStyles({})(MaterialRating);

const Rating = forwardRef(
  ({ loading = false, variant = "text", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledRating ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default Rating;
