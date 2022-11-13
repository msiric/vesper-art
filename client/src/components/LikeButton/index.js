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
  fontSize = "small",
  ...props
}) => {
  const [state, setState] = useState({ liked, loading: false });

  const classes = likeButtonStyles();

  const handleLikeComment = async (id) => {
    try {
      setState({ loading: true });
      await postLike.request({
        artworkId,
        commentId: comment.id,
      });
      setState({ liked: true });
    } catch (err) {
      console.log(err);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleDislikeComment = async () => {
    try {
      setState({ loading: true });
      await deleteLike.request({
        artworkId,
        commentId: comment.id,
      });
      setState({ liked: false });
    } catch (err) {
      console.log(err);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return labeled ? (
    <AsyncButton
      color="secondary"
      startIcon={
        state.liked ? (
          <LikedIcon fontSize={fontSize} />
        ) : (
          <LikeIcon fontSize={fontSize} />
        )
      }
      submitting={state.loading}
      onClick={() =>
        state.liked ? handleDislikeComment() : handleLikeComment()
      }
      disabled={disabled || state.loading}
      {...props}
    >
      {state.liked ? "Dislike" : "Like"}
    </AsyncButton>
  ) : (
    <IconButton
      aria-label={`${state.liked ? "Dislike comment" : "Like comment"}`}
      onClick={() =>
        state.liked ? handleDislikeComment() : handleLikeComment()
      }
      disabled={disabled || state.loading}
      className={classes.button}
      {...props}
    >
      {state.liked ? (
        <LikedIcon fontSize={fontSize} />
      ) : (
        <LikeIcon fontSize={fontSize} />
      )}
    </IconButton>
  );
};

export default LikeButton;
