import { Box, Button, CircularProgress } from "@material-ui/core";
import React from "react";
import SkeletonWrapper from "../SkeletonWrapper";
import asyncButtonStyles from "./styles";

const AsyncButton = ({
  submitting = false,
  loading = false,
  disabled = false,
  variant = "outlined",
  color = "primary",
  handleClick,
  padding,
  children,
  ...rest
}) => {
  const classes = asyncButtonStyles({ padding: padding ? 16 : "" });

  return (
    <Box className={classes.buttonContainer}>
      <SkeletonWrapper variant="text" loading={loading}>
        <Button
          color={color}
          variant={variant}
          onClick={handleClick}
          disabled={submitting || disabled}
          className={classes.buttonItem}
          {...rest}
        >
          {children}
        </Button>
      </SkeletonWrapper>

      {submitting && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </Box>
  );
};

export default AsyncButton;
