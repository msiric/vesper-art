import { Box as MaterialBox } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";
import { artepunktTheme } from "../../styles/theme";

const StyledBox = withStyles({})(MaterialBox);

const Box = forwardRef(
  (
    {
      loading = false,
      variant = "rect",
      height = "auto",
      width = "auto",
      customRadius = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SkeletonWrapper
        variant={variant}
        height={height}
        width={width}
        style={{
          borderRadius: customRadius && artepunktTheme.shape.borderRadius,
        }}
        loading={loading}
      >
        <StyledBox ref={ref} {...props}>
          {children}
        </StyledBox>
      </SkeletonWrapper>
    );
  }
);

export default Box;
