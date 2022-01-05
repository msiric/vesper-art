import {
  CheckBoxRounded as SuccessIcon,
  ErrorRounded as ErrorIcon,
  NewReleasesRounded as InfoIcon,
  WarningRounded as WarningIcon,
} from "@material-ui/icons";
import React from "react";
import Box from "../../domain/Box";
import Typography from "../../domain/Typography";
import helpBoxStyles from "./styles";

const HelpBox = ({ type, label, margin = 0, children }) => {
  const classes = helpBoxStyles();

  const renderIcon = (type) => {
    switch (type) {
      case "alert":
        return <InfoIcon />;
      case "error":
        return <ErrorIcon />;
      case "success":
        return <SuccessIcon />;
      case "warning":
        return <WarningIcon />;
      default:
        return null;
    }
  };

  return (
    <Box className={classes.container} style={{ margin }}>
      <Box className={classes.wrapper}>
        {renderIcon(type)}
        <Typography className={classes.label}>{label}</Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default HelpBox;
