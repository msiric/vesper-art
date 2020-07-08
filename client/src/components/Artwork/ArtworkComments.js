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

const ArtworkComments = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const classes = AddArtworkStyles();

  return (
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
                <CommentList />
              </InfiniteScroll>
            ) : (
              <p>No comments</p>
            )}
            <AddCommentForm />
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default ArtworkComments;
