import { Card as MaterialCard } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledCard = withStyles({})(MaterialCard);

const Card = ({ loading = false, variant = "rect", children, ...props }) => {
  return (
    <SkeletonWrapper variant={variant} loading={loading}>
      <StyledCard {...props}>{children}</StyledCard>
    </SkeletonWrapper>
  );
};

export default Card;
