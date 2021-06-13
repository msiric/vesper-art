import { DateRangeDelimiter as MaterialRangeDelimiter } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledRangeDelimiter = withStyles({})(MaterialRangeDelimiter);

const RangePicker = forwardRef(
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

export default RangePicker;
