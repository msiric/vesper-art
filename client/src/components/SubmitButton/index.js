import { Box, Button, CircularProgress } from "@material-ui/core";
import React from "react";
import submitButtonStyles from "./styles";

const SubmitButton = ({
  text,
  loading,
  variant = "outlined",
  color = "primary",
  handleClick,
  ...rest
}) => {
  const classes = submitButtonStyles();

  return (
    <Box className={classes.buttonContainer}>
      <Button
        color={color}
        variant={variant}
        onClick={handleClick}
        disabled={loading}
        className={classes.buttonItem}
        {...rest}
      >
        {text}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </Box>
  );
};

export default SubmitButton;
