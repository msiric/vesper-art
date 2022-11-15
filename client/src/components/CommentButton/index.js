import { CommentRounded as CommentIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import IconButton from "../../domain/IconButton";
import commentButtonStyles from "./styles";

const CommentButton = ({
  artworkId,
  disabled = false,
  size = "medium",
  ...props
}) => {
  const classes = commentButtonStyles();

  return (
    <IconButton
      size={size}
      component={RouterLink}
      to={`/artwork/${artworkId}#comments`}
      disabled={disabled}
      {...props}
    >
      <CommentIcon fontSize={size} />
    </IconButton>
  );
};

export default CommentButton;
