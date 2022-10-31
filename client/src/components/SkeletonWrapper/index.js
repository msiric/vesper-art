import React from "react";
import Skeleton from "../../domain/Skeleton";
import skeletonWrapperStyles from "./styles";

const SkeletonWrapper = ({
  animation = "wave",
  variant = "text",
  style,
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
      className={classes.wrapper}
      style={{ ...style }}
    >
      {children}
    </Skeleton>
  ) : (
    children
  );
};

export default SkeletonWrapper;
