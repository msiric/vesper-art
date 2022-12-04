import { Chip as MaterialChip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledChip = withStyles({})(MaterialChip);

const Chip = forwardRef(
  ({ loading = false, variant = "rect", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledChip ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default Chip;
