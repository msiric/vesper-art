import React, { useContext, useState } from 'react';
import { Context } from '../../context/Store.js';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
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
} from '@material-ui/core';
import {
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { postComment, patchComment } from '../../services/artwork.js';
import { commentValidation } from '../../validation/comment.js';

const useStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  artworkPreviewItem: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  paper: {
    height: '100%',
    width: '100%',
    padding: muiTheme.spacing(2),
    boxSizing: 'border-box',
    textAlign: 'center',
    color: muiTheme.palette.text.secondary,
  },
  artworkPreviewMedia: {
    paddingTop: '100%',
  },
  avatar: {
    width: muiTheme.spacing(10),
    height: muiTheme.spacing(10),
    margin: muiTheme.spacing(2),
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: muiTheme.palette.background.default,
  },
  artworkPreviewCard: {
    width: '100%',
    backgroundColor: muiTheme.palette.background.paper,
  },
  user: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  fonts: {
    fontWeight: 'bold',
  },
  inline: {
    display: 'inline',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  license: {
    textTransform: 'capitalize',
  },
  postComment: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  editComment: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  editCommentForm: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  editCommentActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modified: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  noLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  moreOptions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const ArtworkPreview = ({ artwork }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Grid item sm={12} md={7} className={classes.artworkPreviewItem}>
      <Card className={classes.artworkPreviewCard}>
        <CardMedia
          className={classes.artworkPreviewMedia}
          image={artwork.current.cover}
          title={artwork.current.title}
        />
      </Card>
    </Grid>
  );
};

export default ArtworkPreview;
