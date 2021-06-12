import { Button as MaterialButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledButton = withStyles({})(MaterialButton);

const Button = forwardRef(
  (
    {
      loading = false,
      variant = "rect",
      outline = "outlined",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SkeletonWrapper variant={variant} loading={loading}>
        <StyledButton ref={ref} variant={outline} {...props}>
          {children}
        </StyledButton>
      </SkeletonWrapper>
    );
  }
);

export default Button;
