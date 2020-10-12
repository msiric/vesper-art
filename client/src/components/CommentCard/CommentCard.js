import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { MoreVertRounded as MoreIcon } from "@material-ui/icons";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import EditCommentForm from "../../containers/Comment/EditCommentForm.js";
import { Context } from "../../context/Store.js";
import { Typography } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper.js";

const CommentCard = ({
  artwork = {},
  comment = {},
  edits = {},
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const [store, dispatch] = useContext(Context);
  const history = useHistory();
  const classes = {};

  return (
    <Box key={comment._id}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <SkeletonWrapper loading={loading} variant="circle">
            <Avatar
              alt={comment.owner.name}
              src={comment.owner.photo}
              component={Link}
              to={`/user/${comment.owner.name}`}
              className={classes.noLink}
            />
          </SkeletonWrapper>
        </ListItemAvatar>
        <ListItemText
          primary={
            edits[comment._id] ? null : (
              <SkeletonWrapper variant="text" loading={loading}>
                <Typography
                  component={Link}
                  to={`/user/${comment.owner.name}`}
                  style={{ textDecoration: "none" }}
                  color="text.primary"
                >
                  {comment.owner.name || "Could not load user"}
                </Typography>
                <Typography
                  component="span"
                  color="text.secondary"
                  fontStyle="oblique"
                  ml={1}
                >
                  {comment.modified ? "edited" : null}
                </Typography>
              </SkeletonWrapper>
            )
          }
          secondary={
            edits[comment._id] ? (
              <EditCommentForm
                comment={comment}
                artwork={artwork}
                handleCommentEdit={handleCommentEdit}
                handleCommentClose={handleCommentClose}
              />
            ) : (
              <SkeletonWrapper variant="text" loading={loading} width="100%">
                <Typography>
                  {comment.content || "Could not load content"}
                </Typography>
              </SkeletonWrapper>
            )
          }
        />
        {edits[comment._id] || comment.owner._id !== store.user.id ? null : (
          <ListItemSecondaryAction>
            <IconButton
              onClick={(e) => handlePopoverOpen(e, comment._id)}
              edge="end"
              aria-label="More"
            >
              <MoreIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Divider />
    </Box>
  );
};

export default CommentCard;
