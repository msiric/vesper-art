import { Button, IconButton } from "@material-ui/core";
import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useTracked as useUserContext } from "../../contexts/User.js";
import { deleteSave, postSave } from "../../services/artwork.js";
import favoriteButtonStyles from "./styles.js";

const FavoriteButton = ({ artwork, favorited, labeled, handleCallback }) => {
  const [state, setState] = useState({ loading: false });
  const [userStore, userDispatch] = useUserContext();

  const classes = favoriteButtonStyles();

  const handleSaveArtwork = async (id) => {
    try {
      setState({ loading: true });
      await postSave.request({ artworkId: id });
      userDispatch({
        type: "updateSaves",
        saved: {
          [id]: true,
        },
      });
      if (handleCallback) handleCallback(1);
    } catch (err) {
      console.log(err);
    } finally {
      setState({ loading: false });
    }
  };

  const handleUnsaveArtwork = async (id) => {
    try {
      setState({ loading: true });
      await deleteSave.request({ artworkId: id });
      userDispatch({
        type: "updateSaves",
        saved: {
          [id]: false,
        },
      });
      if (handleCallback) handleCallback(-1);
    } catch (err) {
      console.log(err);
    } finally {
      setState({ loading: false });
    }
  };

  return labeled ? (
    <Button
      variant="outlined"
      color="primary"
      startIcon={favorited ? <FavoritedIcon /> : <FavoriteIcon />}
      disabled={state.loading}
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
      className={classes.artworkColor}
      aria-label={`${favorited ? "Unsave artwork" : "Save artwork"}`}
      onClick={() =>
        favorited
          ? handleUnsaveArtwork(artwork._id)
          : handleSaveArtwork(artwork._id)
      }
      disabled={state.loading}
    >
      {favorited ? <FavoritedIcon /> : <FavoriteIcon />}
    </IconButton>
  );
};

export default FavoriteButton;
