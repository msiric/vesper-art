import { Fade as MaterialFade } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledFade = withStyles({})(MaterialFade);

const Fade = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledFade ref={ref} {...props}>
          {children}
        </StyledFade>
      </SkeletonWrapper>
    );
  }
);

export default Fade;
