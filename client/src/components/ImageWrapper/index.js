import { Box } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
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

  console.log(height, width, placeholder, cover, styles);

  const classes = imageWrapperStyles();

  return !loading && downloaded ? (
    redirect ? (
      <Box component={RouterLink} to={redirect}>
        <img className={classes.imageWrapperContent} src={source} />
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
          className={classes.imageWrapperContent}
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
        className={classes.imageWrapperContent}
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
        className={classes.imageWrapperContent}
        style={{ visibility: "hidden" }}
        src={source}
      />
    </Box>
  );
};

export default ImageWrapper;
