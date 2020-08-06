import React, { useContext, useState } from "react";
import { Context } from "../../context/Store.js";
import { Formik, Form, Field } from "formik";
import {
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
  Typography,
  TextField,
  Paper,
  Button,
  Link as Anchor,
} from "@material-ui/core";
import {
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { postComment, patchComment } from "../../services/artwork.js";
import { commentValidation } from "../../validation/comment.js";
import AddCommentForm from "../Comment/AddCommentForm.js";
import EditCommentForm from "../Comment/EditCommentForm.js";

const CommentSection = ({
  artwork,
  edits,
  scroll,
  loadMoreComments,
  handleCommentClose,
  handlePopoverOpen,
}) => {
  const [store, dispatch] = useContext(Context);
  const history = useHistory();
  const classes = {};

  return (
    <Grid item sm={12} md={7} className={classes.grid}>
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Comments
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {artwork.comments.length ? (
              <InfiniteScroll
                className={classes.scroller}
                dataLength={artwork.comments.length}
                next={loadMoreComments}
                hasMore={scroll.comments.hasMore}
                loader={
                  <Grid item xs={12} className={classes.loader}>
                    <CircularProgress />
                  </Grid>
                }
              >
                <List className={classes.root}>
                  {artwork.comments.map((comment) => (
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
                            edits[comment._id] ? null : (
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
                            edits[comment._id] ? (
                              <EditCommentForm />
                            ) : (
                              <Typography>{comment.content}</Typography>
                            )
                          }
                        />
                        {edits[comment._id] ||
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
              </InfiniteScroll>
            ) : (
              <p>No comments</p>
            )}
            <AddCommentForm artwork={artwork} />
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CommentSection;
