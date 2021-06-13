import { Select as MaterialSelect } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledSelect = withStyles({})(MaterialSelect);

const Select = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledSelect ref={ref} {...props}>
        {children}
      </StyledSelect>
    </SkeletonWrapper>
  );
});

export default Select;
