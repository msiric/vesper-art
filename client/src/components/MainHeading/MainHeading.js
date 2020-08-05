import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { compose, typography, spacing } from '@material-ui/system';

const Heading = styled(Typography)(compose(typography, spacing));

const MainHeading = ({ text }) => {
  return (
    <Heading mb={6} variant="h6">
      {text}
    </Heading>
  );
};

export default MainHeading;
