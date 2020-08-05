import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { compose, typography, spacing } from '@material-ui/system';

const Heading = styled(Typography)(compose(typography, spacing));

const SubHeading = ({ text, top }) => {
  return (
    <Heading mb={2} mt={top} variant="subtitle2">
      {text}
    </Heading>
  );
};

export default SubHeading;
