import React from "react";
import Box from "../../domain/Box";
import Button from "../../domain/Button";
import syncButtonStyles from "./styles";

const SyncButton = ({
  loading = false,
  variant = "outlined",
  color = "primary",
  handleClick,
  padding,
  children,
  ...props
}) => {
  const classes = syncButtonStyles();

  return (
    <Box>
      <Button
        color={color}
        outline={variant}
        onClick={handleClick}
        loading={loading}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
};

export default SyncButton;
