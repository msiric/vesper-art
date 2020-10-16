import { Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  FavoriteBorderRounded as FavoriteIcon,
  FavoriteRounded as FavoritedIcon,
} from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { EventsContext } from "../../contexts/Events.js";
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
  const [state, setState] = useState({ loading: false });
  const [eventsStore, eventsDispatch] = useContext(EventsContext);
  const classes = useStyles();

  const handleSaveArtwork = async (id) => {
    try {
      setState({ loading: true });
      await postSave.request({ artworkId: id });
      eventsDispatch({
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
      eventsDispatch({
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
