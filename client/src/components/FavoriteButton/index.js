import { Button, IconButton } from "@material-ui/core";
import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useTracked as useUserContext } from "../../contexts/User.js";
import { deleteSave, postSave } from "../../services/artwork.js";
import favoriteButtonStyles from "./styles.js";

const FavoriteButton = ({ artwork, favorited, labeled, handleCallback }) => {
  const [userStore, userDispatch] = useUserContext();

  const cache = useQueryCache();

  const [initPostSave, { status: postSaveStatus }] = useMutation(
    postSave.request,
    {
      onSuccess: (response, values) => {
        userDispatch({
          type: "UPDATE_SAVES",
          saved: {
            [values.artworkId]: true,
          },
        });
        if (handleCallback) handleCallback(1);
      },
    }
  );

  const [initDeleteSave, { status: deleteSaveStatus }] = useMutation(
    deleteSave.request,
    {
      onSuccess: (response, values) => {
        userDispatch({
          type: "UPDATE_SAVES",
          saved: {
            [values.artworkId]: false,
          },
        });
        if (handleCallback) handleCallback(-1);
      },
    }
  );

  const classes = favoriteButtonStyles();

  const handleSaveArtwork = async (id) => {
    await initPostSave({ artworkId: id });
  };

  const handleUnsaveArtwork = async (id) => {
    await initDeleteSave({ artworkId: id });
  };

  return labeled ? (
    <Button
      variant="outlined"
      color="primary"
      startIcon={favorited ? <FavoritedIcon /> : <FavoriteIcon />}
      disabled={postSaveStatus === "loading" || deleteSaveStatus === "loading"}
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
      disabled={postSaveStatus === "loading" || deleteSaveStatus === "loading"}
    >
      {favorited ? <FavoritedIcon /> : <FavoriteIcon />}
    </IconButton>
  );
};

export default FavoriteButton;
