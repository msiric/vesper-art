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
      <Card className={classes.user}>
        <CardMedia
          className={classes.avatar}
          image={state.artwork.owner.photo}
          title={state.artwork.owner.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <Anchor component={Link} to={`/user/${state.artwork.owner.name}`}>
              {state.artwork.owner.name}
            </Anchor>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {state.artwork.owner.description ||
              "This artist doesn't have much to say about themself"}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default CommentList;
