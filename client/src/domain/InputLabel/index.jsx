import { InputLabel as MaterialInputLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledInputLabel = withStyles({})(MaterialInputLabel);

const InputLabel = forwardRef(
  ({ loading = false, children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant="text" loading={loading}>
        <StyledInputLabel ref={ref} {...props}>
          {children}
        </StyledInputLabel>
      </SkeletonWrapper>
    );
  }
);

export default InputLabel;
