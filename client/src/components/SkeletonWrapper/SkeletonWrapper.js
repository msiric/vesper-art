import { Skeleton } from "@material-ui/lab";
import React from "react";

const SkeletonWrapper = ({
  animation = "wave",
  variant = "rect",
  loading,
  children,
  ...rest
}) => {
  return loading ? (
    <Skeleton variant={variant} animation={animation} {...rest}>
      {children}
    </Skeleton>
  ) : (
    children
  );
};

export default SkeletonWrapper;
