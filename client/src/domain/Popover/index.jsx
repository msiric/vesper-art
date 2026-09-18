import { Popover as MaterialPopover } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledPopover = withStyles({})(MaterialPopover);

const Popover = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="rect" loading={loading}>
      <StyledPopover ref={ref} {...props}>
        {children}
      </StyledPopover>
    </SkeletonWrapper>
  );
});

export default Popover;
