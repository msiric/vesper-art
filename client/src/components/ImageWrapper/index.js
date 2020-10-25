import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/index.js";
import imageWrapperStyles from "./styles.js";

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
  cover,
  styles,
  loading,
}) => {
  const loaded = useProgressiveImage(source);

  const classes = imageWrapperStyles();

  return !loading && loaded ? (
    redirect ? (
      <Box component={RouterLink} to={redirect}>
        <img className={classes.imageContent} src={source} />
      </Box>
    ) : (
      <Box style={{ position: "relative" }}>
        <img
          className={classes.imageContent}
          style={{ ...styles }}
          src={source}
        />
      </Box>
    )
  ) : cover ? (
    <Box style={{ position: "relative" }}>
      <LoadingSpinner styles={{ position: "absolute" }} />
      <img className={classes.imageContent} style={{ ...styles }} src={cover} />
    </Box>
  ) : (
    <Box
      style={{
        height: `${height / (width / 500)}px`,
        width: `${500}px`,
        display: "block",
        background: placeholder,
      }}
    ></Box>
  );
};

export default ImageWrapper;
