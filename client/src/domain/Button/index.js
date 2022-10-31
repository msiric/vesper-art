import { Button as MaterialButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";
import { artepunktTheme } from "../../styles/theme";

const StyledButton = withStyles({})(MaterialButton);

const Button = forwardRef(
  (
    {
      loading = false,
      variant = "rect",
      outline = "outlined",
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SkeletonWrapper
        variant={variant}
        loading={loading}
        width={fullWidth && "100%"}
        style={{ borderRadius: artepunktTheme.shape.borderRadius }}
      >
        <StyledButton
          ref={ref}
          variant={outline}
          fullWidth={fullWidth}
          {...props}
        >
          {children}
        </StyledButton>
      </SkeletonWrapper>
    );
  }
);

export default Button;
