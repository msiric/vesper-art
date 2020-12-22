import { Typography } from '@material-ui/core';
import React from 'react';
import SkeletonWrapper from '../SkeletonWrapper';
import subHeadingStyles from './styles';

const SubHeading = ({ text, loading, ...rest }) => {
  const classes = subHeadingStyles();

  return (
    <SkeletonWrapper variant="text" loading={loading}>
      <Typography variant="h6" {...rest}>
        {text}
      </Typography>
    </SkeletonWrapper>
  );
};

export default SubHeading;
