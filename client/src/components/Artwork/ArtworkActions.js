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
    <Paper className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {state.artwork.current.title}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {state.artwork.current.description}
          </Typography>
          {state.artwork.current.availability === "available" ? (
            <>
              <Typography variant="body2" component="p">
                Artwork price:
                {state.artwork.current.personal
                  ? ` $${state.artwork.current.personal}`
                  : " Free"}
              </Typography>
              <Typography variant="body2" component="p">
                Commercial license:
                {state.artwork.current.commercial
                  ? ` $${state.artwork.current.commercial}`
                  : state.artwork.current.personal
                  ? ` $${state.artwork.current.personal}`
                  : " Free"}
              </Typography>
            </>
          ) : null}
        </CardContent>
        <CardActions>
          {state.artwork.owner._id !== store.user.id &&
          state.artwork.current.availability === "available" ? (
            state.license === "personal" ? (
              state.artwork.current.personal ? (
                store.user.cart[state.artwork._id] ? (
                  <Button component={Link} to={"/cart/"}>
                    In cart
                  </Button>
                ) : (
                  <Button component={Link} to={`/checkout/${match.params.id}`}>
                    Continue
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => handleDownload(state.artwork.current._id)}
                >
                  Download
                </Button>
              )
            ) : state.artwork.current.personal ||
              state.artwork.current.commercial ? (
              <Button component={Link} to={`/checkout/${match.params.id}`}>
                Continue
              </Button>
            ) : (
              <Button onClick={() => handleDownload(state.artwork.current._id)}>
                Download
              </Button>
            )
          ) : null}
          {state.artwork.owner._id === store.user.id ? (
            <Button component={Link} to={`/edit_artwork/${state.artwork._id}`}>
              Edit artwork
            </Button>
          ) : null}
        </CardActions>
      </Card>
    </Paper>
  );
};

export default CommentList;
