import { withStyles } from "@material-ui/core/styles";
import { DateRangePicker as MaterialRangePicker } from "@material-ui/pickers";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledRangePicker = withStyles({})(MaterialRangePicker);

const RangePicker = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
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
