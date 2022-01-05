import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useUserStore } from "../../contexts/global/user";
import IconButton from "../../domain/IconButton";
import { deleteFavorite, postFavorite } from "../../services/artwork";
import AsyncButton from "../AsyncButton/index";
import favoriteButtonStyles from "./styles";

const FavoriteButton = ({
  artwork,
  favorited,
  labeled,
  handleCallback,
  fontSize = "medium",
  ...props
}) => {
  const [state, setState] = useState({ loading: false });
  const updateFavorites = useUserStore((state) => state.updateFavorites);

  const classes = favoriteButtonStyles();

  const handleSaveArtwork = async (id) => {
    try {
      setState({ loading: true });
      await postFavorite.request({ artworkId: id });
      updateFavorites({
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
      updateFavorites({
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
    <AsyncButton
      startIcon={
        favorited ? (
          <FavoritedIcon fontSize={fontSize} />
        ) : (
          <FavoriteIcon fontSize={fontSize} />
        )
      }
      submitting={state.loading}
      onClick={() =>
        favorited
          ? handleUnsaveArtwork(artwork.id)
          : handleSaveArtwork(artwork.id)
      }
      {...props}
    >
      {favorited ? "Unfavorite" : "Favorite"}
    </AsyncButton>
  ) : (
    <IconButton
      aria-label={`${favorited ? "Unsave artwork" : "Save artwork"}`}
      onClick={() =>
        favorited
          ? handleUnsaveArtwork(artwork.id)
          : handleSaveArtwork(artwork.id)
      }
      disabled={state.loading}
      {...props}
    >
      {favorited ? (
        <FavoritedIcon fontSize={fontSize} />
      ) : (
        <FavoriteIcon fontSize={fontSize} />
      )}
    </IconButton>
  );
};

export default FavoriteButton;
