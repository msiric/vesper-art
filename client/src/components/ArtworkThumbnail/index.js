import React from "react";
import artworkThumbnailStyles from "./styles.js";

const ArtworkThumbnail = ({ source }) => {
  const classes = artworkThumbnailStyles();

  return <img className={classes.thumbnail} src={source} />;
};

export default ArtworkThumbnail;
