import { FormHelperText as MaterialFormHelperText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledFormHelperText = withStyles({})(MaterialFormHelperText);

const FormHelperText = forwardRef(
  ({ loading = false, variant = "text", children, ...props }, ref) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledFormHelperText ref={ref} {...props}>
          {children}
        </StyledFormHelperText>
      </SkeletonWrapper>
    );
  }
);

export default FormHelperText;
