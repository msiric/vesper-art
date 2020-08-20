import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { compose, typography, spacing, sizing } from '@material-ui/system';

const Heading = styled(Typography)(compose(typography, spacing, sizing));

const MainHeading = ({ text }) => {
  return (
    <Heading mb={6} variant="h6" width="100%">
      {text}
    </Heading>
  );
};

export default MainHeading;
