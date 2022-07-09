import React, { memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "../../domain/Box";
import useProgressiveImage from "../../hooks/useProgressiveImage";
import { randomizeHeight } from "../../utils/helpers";
import imageWrapperStyles from "./styles";

const ImageWrapper = memo(
  ({
    redirect,
    height,
    source,
    placeholder,
    caption = "",
    addOverlay = false,
    shouldRandomize = true,
    shouldCover = false,
    shouldBlur = false,
    isBlocked = false,
    loading = false,
    callbackFn = () => null,
  }) => {
    const downloaded = useProgressiveImage(source, callbackFn);

    const classes = imageWrapperStyles({
      height,
      loading,
      placeholder,
      source,
    });

    return loading || isBlocked ? (
      <Box
        height={shouldRandomize ? randomizeHeight() : undefined}
        className={classes.wrapper}
        loading
        width="100%"
      />
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
          {shouldBlur && <Box className={classes.blur} />}
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
  }
);

export default ImageWrapper;
