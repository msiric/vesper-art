import { withStyles } from "@material-ui/core/styles";
import { Skeleton as MaterialSkeleton } from "@material-ui/lab";
import React, { forwardRef } from "react";

const StyledSkeleton = withStyles({})(MaterialSkeleton);

const Skeleton = forwardRef(({ children, ...props }, ref) => {
  return (
    <StyledSkeleton ref={ref} {...props}>
      {children}
    </StyledSkeleton>
  );
});

export default Skeleton;
