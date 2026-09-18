import { Tab as MaterialTab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledTab = withStyles({})(MaterialTab);

const Tab = forwardRef(
  ({ loading = false, variant = "text", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledTab ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default Tab;
