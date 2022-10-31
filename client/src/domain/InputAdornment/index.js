import { InputAdornment as MaterialInputAdornment } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledInputAdornment = withStyles({})(MaterialInputAdornment);

const InputAdornment = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="text" loading={loading}>
        <StyledInputAdornment ref={ref} {...props}>
          {children}
        </StyledInputAdornment>
      </SkeletonWrapper>
    );
  }
);

export default InputAdornment;
