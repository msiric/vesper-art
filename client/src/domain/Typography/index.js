import { Typography as MaterialTypography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledTypography = withStyles({})(MaterialTypography);

const Typography = ({ loading = false, children, ...props }) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledTypography {...props}>{children}</StyledTypography>
    </SkeletonWrapper>
  );
};

export default Typography;
