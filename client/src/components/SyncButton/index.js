import { Box, Button } from "@material-ui/core";
import React from "react";
import syncButtonStyles from "./styles";

const SyncButton = ({
  variant = "outlined",
  color = "dark",
  handleClick,
  padding,
  children,
  ...rest
}) => {
  const classes = syncButtonStyles({ padding: padding ? 16 : "" });

  return (
    <Box className={classes.buttonContainer}>
      <Button
        color={color}
        variant={variant}
        onClick={handleClick}
        className={classes.buttonItem}
        {...rest}
      >
        {children}
      </Button>
    </Box>
  );
};

export default SyncButton;
