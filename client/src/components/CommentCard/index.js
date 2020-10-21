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
import { UserContext } from "../../contexts/User.js";
import EditCommentForm from "../../forms/CommentForm/EditCommentForm.js";
import { Typography } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import commentCardStyles from "./styles.js";

const CommentCard = ({
  artwork = {},
  comment = {},
  edits = {},
  queryRef,
  highlightRef,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const [userStore, userDispatch] = useContext(UserContext);
  const history = useHistory();
  const classes = commentCardStyles();

  const isHighlight = () => queryRef && queryRef === comment._id;

  return (
    <Box ref={isHighlight() ? highlightRef : null} key={comment._id}>
      <ListItem
        alignItems="flex-start"
        disableGutters
        className={`${classes.commentContainer} ${
          isHighlight() ? classes.highlightContainer : ""
        }`}
      >
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
                  style={{ marginLeft: 6 }}
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
        {edits[comment._id] || comment.owner._id !== userStore.id ? null : (
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
