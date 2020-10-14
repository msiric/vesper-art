import { Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React, { useContext } from "react";
import { Context } from "../../context/Store.js";
import { deleteSave, postSave } from "../../services/artwork.js";

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

const FavoriteButton = ({ artwork, favorited, labeled, handleCallback }) => {
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
      if (handleCallback) handleCallback(1);
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
      if (handleCallback) handleCallback(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return labeled ? (
    <Button
      variant="outlined"
      color="primary"
      startIcon={favorited ? <FavoritedIcon /> : <FavoriteIcon />}
      onClick={() =>
        favorited
          ? handleUnsaveArtwork(artwork._id)
          : handleSaveArtwork(artwork._id)
      }
    >
      {favorited ? "Unfavorite" : "Favorite"}
    </Button>
  ) : (
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
