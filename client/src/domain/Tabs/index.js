import { Tabs as MaterialTabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledTabs = withStyles({})(MaterialTabs);

const Tabs = forwardRef(
  (
    {
      loading = false,
      variant = "rect",
      type = "fullWidth",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledTabs ref={ref} variant={type} {...props}>
          {children}
        </StyledTabs>
      </SkeletonWrapper>
    );
  }
);

export default Tabs;
