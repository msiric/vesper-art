import { Box as MaterialIcon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledIcon = withStyles({})(MaterialIcon);

const Icon = ({ loading = false, children, ...props }) => {
  return (
    <SkeletonWrapper variant="circle" loading={loading}>
      <StyledIcon {...props}>{children}</StyledIcon>
    </SkeletonWrapper>
  );
};

export default Icon;
