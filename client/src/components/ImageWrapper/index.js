import { Box } from "@material-ui/core";
import React, { useState } from "react";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import imageWrapperStyles from "./styles.js";

const ImageWrapper = ({ source, placeholder, loading }) => {
  const [state, setState] = useState({ loaded: false });

  const classes = imageWrapperStyles();

  const handleImageLoad = () => {
    setState({ loaded: true });
  };

  return (
    <SkeletonWrapper loading={loading}>
      {state.loaded ? (
        <img
          className={classes.imageContent}
          src={source}
          onLoad={handleImageLoad}
        />
      ) : (
        <Box style={{ background: placeholder }}></Box>
      )}
    </SkeletonWrapper>
  );
};

export default ImageWrapper;
