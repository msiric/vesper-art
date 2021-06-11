import { Card as MaterialCard } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCard = withStyles({})(MaterialCard);

const Card = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledCard ref={ref} {...props}>
          {children}
        </StyledCard>
      </SkeletonWrapper>
    );
  }
);

export default Card;
