import { TextField as MaterialTextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledTextField = withStyles({})(MaterialTextField);

const TextField = forwardRef(({ loading = false, children, ...props }, ref) => {
  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <StyledTextField ref={ref} {...props}>
        {children}
      </StyledTextField>
    </SkeletonWrapper>
  );
});

export default TextField;
