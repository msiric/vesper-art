import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/index.js";
import imageWrapperStyles from "./styles.js";

export const useProgressiveImage = (source) => {
  const [state, setState] = useState({ downloaded: false });

  useEffect(() => {
    const image = new Image();
    image.src = source;
    image.onload = () => setState({ downloaded: true });
  }, [source]);

  return state.downloaded;
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
  const downloaded = useProgressiveImage(source);

  console.log(height, width, placeholder, cover, styles);

  const classes = imageWrapperStyles();

  return !loading && downloaded ? (
    redirect ? (
      <Box component={RouterLink} to={redirect}>
        <img className={classes.imageContent} src={source} />
      </Box>
    ) : (
      <Box
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner
          styles={{ position: "absolute", display: loading ? "flex" : "none" }}
        />
        <img
          className={classes.imageContent}
          style={{ ...styles, opacity: loading ? 0.5 : 1 }}
          src={source}
        />
      </Box>
    )
  ) : cover ? (
    <Box style={{ position: "relative" }}>
      <LoadingSpinner
        styles={{ position: "absolute", display: loading ? "flex" : "none" }}
      />
      <img
        className={classes.imageContent}
        style={{ ...styles, opacity: loading ? 0.5 : 1 }}
        src={cover}
      />
    </Box>
  ) : (
    <Box
      style={{
        ...styles,
        background: placeholder,
      }}
    >
      <img
        className={classes.imageContent}
        style={{ visibility: "hidden" }}
        src={source}
      />
    </Box>
  );
};

export default ImageWrapper;
