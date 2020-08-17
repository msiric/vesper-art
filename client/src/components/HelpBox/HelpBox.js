import { Box } from '@material-ui/core';
import {
  CheckBoxRounded as SuccessIcon,
  ErrorRounded as ErrorIcon,
  NewReleasesRounded as InfoIcon,
  WarningRounded as WarningIcon,
} from '@material-ui/icons';
import React from 'react';
import { Typography } from '../../constants/theme.js';

const HelpBox = ({ type, label, margin = 0 }) => {
  const renderIcon = (type) => {
    switch (type) {
      case 'alert':
        return <InfoIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'success':
        return <SuccessIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return null;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      border="1px solid"
      borderRadius={4}
      p={2}
      width="100%"
      mb={margin}
    >
      {renderIcon(type)}
      <Typography fontWeight="bold" ml={2}>
        {label}
      </Typography>
    </Box>
  );
};

export default HelpBox;
