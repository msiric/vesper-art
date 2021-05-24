import { Box, Button } from "@material-ui/core";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper";
import syncButtonStyles from "./styles";

const SyncButton = ({
  loading = false,
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
      <SkeletonWrapper variant="text" loading={loading}>
        <Button
          color={color}
          variant={variant}
          onClick={handleClick}
          className={classes.buttonItem}
          {...rest}
        >
          {children}
        </Button>
      </SkeletonWrapper>
    </Box>
  );
};

export default SyncButton;
