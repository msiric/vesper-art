import React from "react";
import Box from "../../domain/Box";
import Button from "../../domain/Button";
import CircularProgress from "../../domain/CircularProgress";
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
  ...props
}) => {
  const classes = asyncButtonStyles({ padding: padding ? 16 : "" });

  return (
    <Box className={classes.container}>
      <Button
        color={color}
        variant={variant}
        onClick={handleClick}
        disabled={submitting || disabled}
        loading={loading}
        {...props}
      >
        {children}
      </Button>
      {submitting && (
        <CircularProgress size={24} className={classes.progress} />
      )}
    </Box>
  );
};

export default AsyncButton;
