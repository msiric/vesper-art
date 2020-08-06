import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context/Store.js";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import { postSave, deleteSave } from "../../services/artwork.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  accordion: {
    minHeight: 80,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const FavoriteButton = ({ artwork, favorited }) => {
  const [store, dispatch] = useContext(Context);
  const classes = useStyles();

  const handleSaveArtwork = async (id) => {
    try {
      await postSave({ artworkId: id });
      dispatch({
        type: "updateSaves",
        saved: {
          [id]: true,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsaveArtwork = async (id) => {
    try {
      await deleteSave({ artworkId: id });
      dispatch({
        type: "updateSaves",
        saved: {
          [id]: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <IconButton
      aria-label={`${favorited ? "Unsave artwork" : "Save artwork"}`}
      onClick={() =>
        favorited
          ? handleUnsaveArtwork(artwork._id)
          : handleSaveArtwork(artwork._id)
      }
      className={classes.artworkColor}
    >
      {favorited ? <FavoritedIcon /> : <FavoriteIcon />}
    </IconButton>
  );
};

export default FavoriteButton;
