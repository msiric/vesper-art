import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "../../domain/Box";
import useProgressiveImage from "../../hooks/useProgressiveImage";
import imageWrapperStyles from "./styles";

const ImageWrapper = ({
  redirect,
  height,
  source,
  placeholder,
  cover,
  caption = "",
  addOverlay = false,
  shouldCover = false,
  loading = false,
}) => {
  const downloaded = useProgressiveImage(source);

  const classes = imageWrapperStyles({ height, loading, placeholder });

  return loading ? (
    <Box className={classes.wrapper} loading={true} width="100%" />
  ) : downloaded ? (
    redirect ? (
      <Box
        component={RouterLink}
        to={redirect}
        className={`${addOverlay && classes.overlay}`}
      >
        <img
          className={`${classes.media} ${shouldCover && classes.coverParent}`}
          src={source}
        />
      </Box>
    ) : (
      <Box className={`${classes.wrapper} ${addOverlay && classes.overlay}`}>
        <img
          className={`${classes.media} ${shouldCover && classes.coverParent}`}
          src={source}
          alt={caption}
        />
      </Box>
    )
  ) : (
    <Box className={classes.hiddenWrapper} width="100%">
      <img className={`${classes.media} ${classes.hidden}`} src={source} />
    </Box>
  );
};

export default ImageWrapper;
