import { Box as MaterialBox } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledBox = withStyles({})(MaterialBox);

const Box = ({ loading = false, children, ...props }) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledBox {...props}>{children}</StyledBox>
    </SkeletonWrapper>
  );
};

export default Box;
