import { Skeleton } from "@material-ui/lab";
import React from "react";
import skeletonWrapperStyles from "./styles";

const SkeletonWrapper = ({
  animation = "wave",
  variant = "rect",
  loading,
  children,
  ...rest
}) => {
  const classes = skeletonWrapperStyles();

  return loading ? (
    <Skeleton variant={variant} animation={animation} {...rest}>
      {children}
    </Skeleton>
  ) : (
    children
  );
};

export default SkeletonWrapper;
