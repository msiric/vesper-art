import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "../../domain/Box";
import useProgressiveImage from "../../hooks/useProgressiveImage";
import LoadingSpinner from "../LoadingSpinner/index";
import imageWrapperStyles from "./styles";

const ImageWrapper = ({
  redirect,
  height,
  source,
  placeholder,
  cover,
  loading = false,
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
      <LoadingSpinner styles={classes.spinner} />
      <img className={`${classes.media} ${classes.opacity}`} src={cover} />
    </Box>
  ) : (
    <Box className={classes.hiddenWrapper} height={height} width="100%">
      <img className={`${classes.media} ${classes.hidden}`} src={source} />
    </Box>
  );
};

export default ImageWrapper;
