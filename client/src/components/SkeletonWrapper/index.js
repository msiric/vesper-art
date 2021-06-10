import { Skeleton } from "@material-ui/lab";
import React from "react";
import skeletonWrapperStyles from "./styles";

const SkeletonWrapper = ({
  animation = "wave",
  variant = "text",
  loading,
  children,
  ...props
}) => {
  const classes = skeletonWrapperStyles();

  return loading ? (
    <Skeleton
      variant={variant}
      animation={animation}
      {...props}
      className={classes.skeletonWrapperIndicator}
    >
      {children}
    </Skeleton>
  ) : (
    children
  );
};

export default SkeletonWrapper;
