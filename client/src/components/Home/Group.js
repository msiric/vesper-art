import React, { useState, useContext } from 'react';
import { Context } from '../Store/Store.js';
import Modal from '../../shared/Modal/Modal.js';
import Masonry from 'react-mason';
import {
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import {
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
  LinkRounded as CopyIcon,
  EditRounded as EditIcon,
} from '@material-ui/icons';
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  TwitterIcon,
} from 'react-share';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import GroupStyles from './Group.style.js';

const Group = ({ elements, hasMore, loadMore, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({});

  const classes = GroupStyles();

  const users = elements.map((element, index) => {
    const card = (
      <Card key={index} className={classes.root}>
        <CardMedia
          component={Link}
          to={`/user/${element.name}`}
          className={classes.media}
          image={element.photo}
          title={element.name}
        />
        <CardContent>
          <Typography
            component={Link}
            to={`/user/${element.name}`}
            variant="body1"
            color="textSecondary"
            className={classes.link}
          >
            {element.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {element.country}
          </Typography>
        </CardContent>
      </Card>
    );

    return card;
  });

  return (
    <Paper className={classes.paper}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={users.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        }
      >
        <Masonry>{users}</Masonry>
      </InfiniteScroll>
    </Paper>
  );
};

export default withSnackbar(Group);
