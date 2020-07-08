import React from "react";
import {
  Modal,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Paper,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Popover,
  Link as Anchor,
} from "@material-ui/core";
import { commentValidation } from "../../validation/comment.js";
import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js";

const CommentList = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const classes = AddArtworkStyles();

  return (
    <List className={classes.root}>
      {state.artwork.comments.map((comment) => (
        <React.Fragment key={comment._id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                alt={comment.owner.name}
                src={comment.owner.photo}
                component={Link}
                to={`/user/${comment.owner.name}`}
                className={classes.noLink}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                state.edits[comment._id] ? null : (
                  <>
                    <Typography
                      component={Link}
                      to={`/user/${comment.owner.name}`}
                      className={`${classes.fonts} ${classes.noLink}`}
                    >
                      {comment.owner.name}{" "}
                    </Typography>
                    <span className={classes.modified}>
                      {comment.modified ? "edited" : null}
                    </span>
                  </>
                )
              }
              secondary={
                state.edits[comment._id] ? (
                  <EditCommentForm />
                ) : (
                  <Typography>{comment.content}</Typography>
                )
              }
            />
            {state.edits[comment._id] ||
            comment.owner._id !== store.user.id ? null : (
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
        </React.Fragment>
      ))}
    </List>
  );
};

export default CommentList;
