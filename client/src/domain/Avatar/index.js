import { Avatar as MaterialAvatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";

const StyledAvatar = withStyles({})(MaterialAvatar);

const Avatar = forwardRef(
  (
    {
      loading = false,
      variant = "circle",
      shape = "circle",
      width,
      maxWidth,
      ...props
    },
    ref
  ) => {
    return (
      <SkeletonWrapper
        variant={variant}
        loading={loading}
        width={width}
        style={{ maxWidth }}
      >
        <StyledAvatar ref={ref} variant={shape} {...props} />
      </SkeletonWrapper>
    );
  }
);

export default Avatar;
