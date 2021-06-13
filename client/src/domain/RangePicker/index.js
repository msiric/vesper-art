import { DateRangePicker as MaterialRangePicker } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledRangePicker = withStyles({})(MaterialRangePicker);

const RangePicker = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledRangePicker ref={ref} {...props}>
          {children}
        </StyledRangePicker>
      </SkeletonWrapper>
    );
  }
);

export default RangePicker;
