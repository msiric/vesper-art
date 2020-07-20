import React, { useContext, useState } from 'react';
import { Context } from '../../context/Store.js';
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

const ArtworkPreview = ({ artwork }) => {
  const history = useHistory();
  const classes = {};

  return (
    <Grid item sm={12} md={7} className={classes.grid}>
      <Card className={classes.root}>
        <CardMedia
          className={classes.cover}
          image={artwork.current.cover}
          title={artwork.current.title}
        />
      </Card>
    </Grid>
  );
};

export default ArtworkPreview;
