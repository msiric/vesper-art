import React, { useContext, useState } from "react";
import { Context } from "../Store/Store.js";
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

const ArtworkPreview = ({ match, socket }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    artwork: {},
    license: "personal",
    modal: {
      open: false,
    },
    popover: {
      id: null,
      anchorEl: null,
      open: false,
    },
    edits: {},
    scroll: {
      comments: {
        hasMore: true,
        dataCursor: 0,
        dataCeiling: 20,
      },
    },
  });
  const history = useHistory();
  const classes = {};

  return (
    <Grid item sm={12} md={7} className={classes.grid}>
      <Card className={classes.root}>
        <CardMedia
          className={classes.cover}
          image={state.artwork.current.cover}
          title={state.artwork.current.title}
        />
      </Card>
      <br />

      <Paper className={classes.paper}>
        <Card className={classes.root}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Comments
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {state.artwork.comments.length ? (
                <InfiniteScroll
                  className={classes.scroller}
                  dataLength={state.artwork.comments.length}
                  next={loadMoreComments}
                  hasMore={state.scroll.comments.hasMore}
                  loader={
                    <Grid item xs={12} className={classes.loader}>
                      <CircularProgress />
                    </Grid>
                  }
                >
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
                                <Formik
                                  initialValues={{
                                    commentContent: comment.content,
                                  }}
                                  enableReinitialize
                                  validationSchema={commentValidation}
                                  onSubmit={async (values, { resetForm }) => {
                                    await patchComment({
                                      artworkId: state.artwork._id,
                                      commentId: comment._id,
                                      data: values,
                                    });
                                    setState((prevState) => ({
                                      ...prevState,
                                      artwork: {
                                        ...prevState.artwork,
                                        comments: prevState.artwork.comments.map(
                                          (item) =>
                                            item._id === comment._id
                                              ? {
                                                  ...item,
                                                  content:
                                                    values.commentContent,
                                                  modified: true,
                                                }
                                              : item
                                        ),
                                      },
                                      edits: {
                                        ...prevState.edits,
                                        [comment._id]: false,
                                      },
                                    }));
                                    resetForm();
                                  }}
                                >
                                  {({ values, errors, touched }) => (
                                    <Form className={classes.editComment}>
                                      <div className={classes.editCommentForm}>
                                        <Field name="commentContent">
                                          {({
                                            field,
                                            form: { touched, errors },
                                            meta,
                                          }) => (
                                            <TextField
                                              {...field}
                                              onBlur={() => null}
                                              label="Edit comment"
                                              type="text"
                                              helperText={
                                                meta.touched && meta.error
                                              }
                                              error={
                                                meta.touched &&
                                                Boolean(meta.error)
                                              }
                                              margin="dense"
                                              variant="outlined"
                                              fullWidth
                                              multiline
                                            />
                                          )}
                                        </Field>
                                      </div>
                                      <div
                                        className={classes.editCommentActions}
                                      >
                                        <Button
                                          type="button"
                                          color="primary"
                                          onClick={() =>
                                            handleCommentClose(comment._id)
                                          }
                                          fullWidth
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          type="submit"
                                          color="primary"
                                          fullWidth
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </Form>
                                  )}
                                </Formik>
                              ) : (
                                <Typography>{comment.content}</Typography>
                              )
                            }
                          />
                          {state.edits[comment._id] ||
                          comment.owner._id !== store.user.id ? null : (
                            <ListItemSecondaryAction>
                              <IconButton
                                onClick={(e) =>
                                  handlePopoverOpen(e, comment._id)
                                }
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
              <Formik
                initialValues={{
                  commentContent: "",
                }}
                validationSchema={commentValidation}
                onSubmit={async (values, { resetForm }) => {
                  const { data } = await postComment({
                    artworkId: state.artwork._id,
                    data: values,
                  });
                  setState({
                    ...state,
                    artwork: {
                      ...state.artwork,
                      comments: [
                        ...state.artwork.comments,
                        {
                          ...data.payload,
                          owner: {
                            _id: store.user.id,
                            name: store.user.name,
                            photo: store.user.photo,
                          },
                        },
                      ],
                    },
                  });
                  resetForm();
                }}
              >
                {({ values, errors, touched }) => (
                  <Form className={classes.postComment}>
                    <Field name="commentContent">
                      {({ field, form: { touched, errors }, meta }) => (
                        <TextField
                          {...field}
                          onBlur={() => null}
                          label="Type a comment"
                          type="text"
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          multiline
                        />
                      )}
                    </Field>
                    <Button type="submit" color="primary" fullWidth>
                      Post
                    </Button>
                  </Form>
                )}
              </Formik>
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Grid>
  );
};

export default ArtworkPreview;
