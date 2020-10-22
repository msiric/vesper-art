import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import SkeletonWrapper from '../SkeletonWrapper/index.js';
import imageWrapperStyles from './styles.js';

const useProgressiveImage = (source) => {
  const [state, setState] = useState({ loaded: false });

  useEffect(() => {
    const image = new Image();
    image.src = source;
    image.onload = () => setState({ loaded: true });
  }, [source]);

  return state.loaded;
};

const ImageWrapper = ({
  redirect,
  height,
  width,
  source,
  placeholder,
  loading,
}) => {
  const loaded = useProgressiveImage(source);

  const classes = imageWrapperStyles();

  return (
    <SkeletonWrapper loading={loading}>
      {loaded ? (
        redirect ? (
          <Box component={RouterLink} to={redirect}>
            <img className={classes.imageContent} src={source} />
          </Box>
        ) : (
          <img className={classes.imageContent} src={source} />
        )
      ) : (
        <Box
          style={{
            height: `${height / (width / 500)}px`,
            width: `${500}px`,
            display: 'block',
            background: placeholder,
          }}
        ></Box>
      )}
    </SkeletonWrapper>
  );
};

export default ImageWrapper;
