import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useUserStore } from "../../contexts/global/user";
import IconButton from "../../domain/IconButton";
import { deleteFavorite, postFavorite } from "../../services/artwork";
import AsyncButton from "../AsyncButton/index";

const FavoriteButton = ({
  artwork,
  favorited,
  labeled,
  disabled,
  handleCallback,
  size = "medium",
  ...props
}) => {
  const [state, setState] = useState({ loading: false });
  const updateFavorites = useUserStore((state) => state.updateFavorites);

  const handleFavoriteArtwork = async (id) => {
    setState({ loading: true });
    await postFavorite.request({ artworkId: id });
    updateFavorites({
      favorites: {
        [id]: true,
      },
    });
    if (handleCallback) handleCallback({ incrementBy: 1 });
    setState({ loading: false });
  };

  const handleUnfavoriteArtwork = async (id) => {
    setState({ loading: true });
    await deleteFavorite.request({ artworkId: id });
    updateFavorites({
      favorites: {
        [id]: false,
      },
    });
    if (handleCallback) handleCallback({ incrementBy: -1 });
    setState({ loading: false });
  };

  return labeled ? (
    <AsyncButton
      color="secondary"
      startIcon={
        favorited ? (
          <FavoritedIcon fontSize={size} />
        ) : (
          <FavoriteIcon fontSize={size} />
        )
      }
      submitting={state.loading}
      onClick={() =>
        favorited
          ? handleUnfavoriteArtwork(artwork.id)
          : handleFavoriteArtwork(artwork.id)
      }
      disabled={disabled || state.loading}
      {...props}
    >
      {favorited ? "Unfavorite" : "Favorite"}
    </AsyncButton>
  ) : (
    <IconButton
      title={`${favorited ? "Unfavorite artwork" : "Favorite artwork"}`}
      aria-label={`${favorited ? "Unfavorite artwork" : "Favorite artwork"}`}
      onClick={() =>
        favorited
          ? handleUnfavoriteArtwork(artwork.id)
          : handleFavoriteArtwork(artwork.id)
      }
      disabled={disabled || state.loading}
      size={size}
      {...props}
    >
      {favorited ? (
        <FavoritedIcon fontSize={size} />
      ) : (
        <FavoriteIcon fontSize={size} />
      )}
    </IconButton>
  );
};

export default FavoriteButton;
