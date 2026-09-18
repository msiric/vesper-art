import { withStyles } from "@material-ui/core/styles";
import { DateRangeDelimiter as MaterialRangeDelimiter } from "@material-ui/pickers";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledRangeDelimiter = withStyles({
  root: { margin: "0 10px" },
})(MaterialRangeDelimiter);

const RangeDelimiter = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledRangeDelimiter ref={ref} {...props}>
          {children}
        </StyledRangeDelimiter>
      </SkeletonWrapper>
    );
  }
);

export default RangeDelimiter;
