import { Button, IconButton } from "@material-ui/core";
import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { deleteFavorite, postFavorite } from "../../services/artwork.js";
import favoriteButtonStyles from "./styles.js";

const FavoriteButton = ({ artwork, favorited, labeled, handleCallback }) => {
  const [state, setState] = useState({ loading: false });
  const [userStore, userDispatch] = useUserContext();

  const classes = favoriteButtonStyles();

  const handleSaveArtwork = async (id) => {
    try {
      setState({ loading: true });
      await postFavorite.request({ artworkId: id });
      userDispatch({
        type: "UPDATE_FAVORITES",
        favorites: {
          [id]: true,
        },
      });
      if (handleCallback) handleCallback({ incrementBy: 1 });
    } catch (err) {
      console.log(err);
    } finally {
      setState({ loading: false });
    }
  };

  const handleUnsaveArtwork = async (id) => {
    try {
      setState({ loading: true });
      await deleteFavorite.request({ artworkId: id });
      userDispatch({
        type: "UPDATE_FAVORITES",
        favorites: {
          [id]: false,
        },
      });
      if (handleCallback) handleCallback({ incrementBy: -1 });
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
          ? handleUnsaveArtwork(artwork.id)
          : handleSaveArtwork(artwork.id)
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
          ? handleUnsaveArtwork(artwork.id)
          : handleSaveArtwork(artwork.id)
      }
      disabled={state.loading}
    >
      {favorited ? <FavoritedIcon /> : <FavoriteIcon />}
    </IconButton>
  );
};

export default FavoriteButton;
