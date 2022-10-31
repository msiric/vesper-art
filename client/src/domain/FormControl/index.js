import { FormControl as MaterialFormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledFormControl = withStyles({})(MaterialFormControl);

const FormControl = forwardRef(
  ({ loading = false, variant = "rect", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledFormControl ref={ref} {...props}>
          {children}
        </StyledFormControl>
      </SkeletonWrapper>
    );
  }
);

export default FormControl;
