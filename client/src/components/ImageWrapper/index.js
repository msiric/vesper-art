import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "../../domain/Box";
import useProgressiveImage from "../../hooks/useProgressiveImage";
import LoadingSpinner from "../LoadingSpinner/index.js";
import imageWrapperStyles from "./styles.js";

const ImageWrapper = ({
  redirect,
  height,
  source,
  placeholder,
  cover,
  loading,
}) => {
  const downloaded = useProgressiveImage(source);

  const classes = imageWrapperStyles({ height, placeholder });

  return !loading && downloaded ? (
    redirect ? (
      <Box component={RouterLink} to={redirect}>
        <img className={classes.media} src={source} />
      </Box>
    ) : (
      <Box className={classes.wrapper}>
        <img className={classes.media} src={source} />
      </Box>
    )
  ) : cover ? (
    <Box className={classes.wrapper}>
      <LoadingSpinner className={classes.spinner} />
      <img className={classes.media} src={cover} />
    </Box>
  ) : (
    <Box className={classes.hiddenWrapper} loading={true}>
      <img className={`${classes.media} ${classes.hidden}`} src={source} />
    </Box>
  );
};

export default ImageWrapper;
