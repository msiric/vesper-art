import React, { useContext, useState } from "react";
import { Context } from "../../context/Store.js";
import { makeStyles } from "@material-ui/core/styles";
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
  Box,
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
import { upload } from "../../../../common/constants.js";

const useStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  artworkPreviewItem: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
  paper: {
    height: "100%",
    width: "100%",
    padding: muiTheme.spacing(2),
    boxSizing: "border-box",
    textAlign: "center",
    color: muiTheme.palette.text.secondary,
  },
  artworkPreviewMedia: {
    height: "100%",
    backgroundSize: "auto",
  },
  avatar: {
    width: muiTheme.spacing(10),
    height: muiTheme.spacing(10),
    margin: muiTheme.spacing(2),
    borderRadius: "50%",
    flexShrink: 0,
    backgroundColor: muiTheme.palette.background.default,
  },
  artworkPreviewCard: {
    width: "100%",
    backgroundColor: muiTheme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  user: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  fonts: {
    fontWeight: "bold",
  },
  inline: {
    display: "inline",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  license: {
    textTransform: "capitalize",
  },
  postComment: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  editComment: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  editCommentForm: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  editCommentActions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  modified: {
    fontSize: 14,
    fontWeight: "normal",
  },
  noLink: {
    textDecoration: "none",
    color: "inherit",
  },
  moreOptions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const ArtworkPreview = ({ artwork }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Card
      className={classes.artworkPreviewCard}
      style={{
        height:
          artwork.current.height /
            (artwork.current.width / upload.artwork.fileTransform.width) +
          70,
      }}
    >
      <Box>
        <Typography>{`${artwork.current.title}, ${new Date(
          artwork.created
        ).getFullYear()}`}</Typography>
      </Box>
      <CardMedia
        className={classes.artworkPreviewMedia}
        image={artwork.current.cover}
        title={artwork.current.title}
      />
      <Box>
        <Typography>
          You are previewing a low resolution thumbnail of the original artwork
        </Typography>
        <Typography>{`The original artwork dimensions (in pixels) are: ${artwork.current.width}x${artwork.current.height}`}</Typography>
      </Box>
    </Card>
  );
};

export default ArtworkPreview;
