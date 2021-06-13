import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "../../domain/Box";
import useProgressiveImage from "../../hooks/useProgressiveImage";
import LoadingSpinner from "../LoadingSpinner/index.js";
import imageWrapperStyles from "./styles.js";

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

  console.log(loading, downloaded, height, width, placeholder, cover, styles);

  const classes = imageWrapperStyles();

  return !loading && downloaded ? (
    redirect ? (
      <Box component={RouterLink} to={redirect}>
        <img className={classes.media} src={source} />
      </Box>
    ) : (
      <Box className={classes.loader}>
        <LoadingSpinner
          styles={{ position: "absolute", display: loading ? "flex" : "none" }}
        />
        <img
          className={classes.media}
          style={{ ...styles, opacity: loading ? 0.5 : 1 }}
          src={source}
        />
      </Box>
    )
  ) : cover ? (
    <Box className={classes.wrapper}>
      <LoadingSpinner
        styles={{ position: "absolute", display: loading ? "flex" : "none" }}
      />
      <img
        className={classes.media}
        style={{ ...styles, opacity: loading ? 0.5 : 1 }}
        src={cover}
      />
    </Box>
  ) : (
    <Box
      style={{
        ...styles,
        height: height,
        background: placeholder,
        width: "100%",
        filter: "blur(8px)",
      }}
    >
      <img
        className={classes.media}
        style={{ visibility: "hidden" }}
        src={source}
      />
    </Box>
  );
};

export default ImageWrapper;
