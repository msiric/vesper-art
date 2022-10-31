import { Typography as MaterialTypography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledTypography = withStyles({})(MaterialTypography);

const Typography = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="text" loading={loading}>
        <StyledTypography ref={ref} {...props}>
          {children}
        </StyledTypography>
      </SkeletonWrapper>
    );
  }
);

export default Typography;
