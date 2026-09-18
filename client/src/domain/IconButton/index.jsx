import { IconButton as MaterialIconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledIconButton = withStyles({})(MaterialIconButton);

const IconButton = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="text" loading={loading}>
        <StyledIconButton ref={ref} {...props}>
          {children}
        </StyledIconButton>
      </SkeletonWrapper>
    );
  }
);

export default IconButton;
