import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import skeletonWrapperStyles from "./styles";

const SkeletonWrapper = ({
  animation = "wave",
  variant = "rect",
  loading,
  children,
  styles,
  ...rest
}) => {
  const classes = skeletonWrapperStyles();

  return loading ? (
    variant === "circle" ? (
      <Box className={classes.skeletonWrapperContainer} style={{ ...styles }}>
        <Skeleton
          variant={variant}
          animation={animation}
          {...rest}
          className={classes.skeletonWrapperIndicator}
        >
          {children}
        </Skeleton>
      </Box>
    ) : (
      <Skeleton variant={variant} animation={animation} {...rest}>
        {children}
      </Skeleton>
    )
  ) : (
    children
  );
};

export default SkeletonWrapper;
