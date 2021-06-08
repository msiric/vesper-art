import { Divider as MaterialDivider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledDivider = withStyles({})(MaterialDivider);

const Divider = ({ loading = false, variant = "rect", props }) => {
  return (
    <SkeletonWrapper variant={variant} loading={loading}>
      <StyledDivider {...props} />
    </SkeletonWrapper>
  );
};

export default Divider;
