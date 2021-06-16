import { Box as MaterialBox } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledBox = withStyles({})(MaterialBox);

const Box = forwardRef(
  (
    {
      loading = false,
      variant = "rect",
      height = "auto",
      width = "auto",
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
