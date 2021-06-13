import { FormControlLabel as MaterialFormControlLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledFormControlLabel = withStyles({})(MaterialFormControlLabel);

const FormControlLabel = forwardRef(
  ({ loading = false, variant = "text", ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledFormControlLabel ref={ref} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default FormControlLabel;
