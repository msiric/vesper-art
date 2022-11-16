import React from "react";
import Box from "../../domain/Box";
import Button from "../../domain/Button";
import syncButtonStyles from "./styles";

const SyncButton = ({
  loading = false,
  variant = "outlined",
  color = "primary",
  size = "medium",
  handleClick,
  padding,
  fullWidth,
  children,
  ...props
}) => {
  const classes = syncButtonStyles({ padding: padding ? 16 : "" });

  return (
    <Box className={classes.container}>
      <Button
        color={color}
        outline={variant}
        onClick={handleClick}
        fullWidth={fullWidth}
        loading={loading}
        size={size}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
};

export default SyncButton;
