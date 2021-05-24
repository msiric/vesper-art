import { IconButton as MaterialIconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledIconButton = withStyles({})(MaterialIconButton);

const IconButton = ({ loading = false, children, ...props }) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledIconButton {...props}>{children}</StyledIconButton>
    </SkeletonWrapper>
  );
};

export default IconButton;
