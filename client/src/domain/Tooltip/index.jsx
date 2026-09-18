import { Tooltip as MaterialTooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledTooltip = withStyles({
  tooltipPlacementTop: {
    margin: "4px 0",
  },
})(MaterialTooltip);

const Tooltip = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="rect" loading={loading}>
      <StyledTooltip ref={ref} {...props}>
        {children}
      </StyledTooltip>
    </SkeletonWrapper>
  );
});

export default Tooltip;
