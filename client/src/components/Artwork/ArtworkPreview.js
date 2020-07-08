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

const ArtworkPreview = ({ image, title }) => {
  const classes = AddArtworkStyles();

  return (
    <Paper className={classes.paper}>
      <Card className={classes.root}>
        <CardMedia className={classes.cover} image={image} title={title} />
      </Card>
    </Paper>
  );
};

export default ArtworkPreview;
