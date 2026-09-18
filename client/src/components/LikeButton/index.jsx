import {
  FavoriteBorderRounded as LikeIcon,
  FavoriteRounded as LikedIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import IconButton from "../../domain/IconButton";
import { deleteLike, postLike } from "../../services/artwork";
import AsyncButton from "../AsyncButton/index";
import likeButtonStyles from "./styles";

const LikeButton = ({
  artworkId,
  comment,
  liked,
  disabled,
  labeled,
  size = "small",
  handleCallback,
  ...props
}) => {
  const [state, setState] = useState({ loading: false });

  const classes = likeButtonStyles();

  const handleLikeComment = async () => {
    setState({ loading: true });
    await postLike.request({
      artworkId,
      commentId: comment.id,
    });
    handleCallback(true);
    setState((prevState) => ({ ...prevState, loading: false }));
  };

  const handleDislikeComment = async () => {
    setState({ loading: true });
    await deleteLike.request({
      artworkId,
      commentId: comment.id,
    });
    handleCallback(false);
    setState((prevState) => ({ ...prevState, loading: false }));
  };

  return labeled ? (
    <AsyncButton
      color="secondary"
      startIcon={
        liked ? <LikedIcon fontSize={size} /> : <LikeIcon fontSize={size} />
      }
      submitting={state.loading}
      onClick={() => (liked ? handleDislikeComment() : handleLikeComment())}
      disabled={disabled || state.loading}
      {...props}
    >
      {liked ? "Dislike" : "Like"}
    </AsyncButton>
  ) : (
    <IconButton
      title={`${liked ? "Dislike comment" : "Like comment"}`}
      aria-label={`${liked ? "Dislike comment" : "Like comment"}`}
      onClick={() => (liked ? handleDislikeComment() : handleLikeComment())}
      disabled={disabled || state.loading}
      className={classes.button}
      size={size}
      {...props}
    >
      {liked ? <LikedIcon fontSize={size} /> : <LikeIcon fontSize={size} />}
    </IconButton>
  );
};

export default LikeButton;
