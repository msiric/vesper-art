import React, { useState, useContext } from 'react';
import { Context } from '../Store/Store';
import Modal from '../../shared/Modal/Modal';
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
import { ax } from '../../shared/Interceptor/Interceptor';
import InfiniteScroll from 'react-infinite-scroll-component';
import GalleryStyles from './Gallery.style';

const Gallery = ({ elements, hasMore, loadMore, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    modal: {
      open: false,
      body: ``,
    },
  });

  const classes = GalleryStyles();

  const artwork = elements.map((element, index) => {
    return (
      <Card key={index} className={classes.root}>
        <CardHeader
          title={element.current.title}
          subheader={
            element.current.availability === 'available'
              ? element.current.personal
                ? `$${element.current.personal}`
                : 'Free'
              : 'Showcase'
          }
        />
        <CardMedia
          component={Link}
          to={`/artwork/${element._id}`}
          className={classes.media}
          image={element.current.cover}
          title={element.current.title}
        />
        <CardContent>
          <Typography
            component={Link}
            to={`/user/${element.owner.name}`}
            variant="body1"
            color="textSecondary"
            className={classes.link}
          >
            {element.owner.name}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {store.user.authenticated && element.owner._id === store.user.id ? (
            <IconButton
              component={Link}
              to={`/edit_artwork/${element._id}`}
              aria-label="Unsave artwork"
            >
              <EditIcon />
            </IconButton>
          ) : store.user.saved[element._id] ? (
            <IconButton
              onClick={() => handleUnsaveArtwork(element._id)}
              aria-label="Unsave artwork"
            >
              <SavedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleSaveArtwork(element._id)}
              aria-label="Save artwork"
            >
              <SaveIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleModalOpen(element._id)}
            aria-label="Share artwork"
          >
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  });

  const artworkTest = Array.from({ length: 80 })
    .fill(
      <Card key={elements[0]._id} className={classes.root}>
        <CardHeader
          title={elements[0].current.title}
          subheader={
            elements[0].current.availability === 'available'
              ? elements[0].current.personal
                ? `$${elements[0].current.personal}`
                : 'Free'
              : 'Showcase'
          }
        />
        <CardMedia
          component={Link}
          to={`/artwork/${elements[0]._id}`}
          className={classes.media}
          image={elements[0].current.cover}
          title={elements[0].current.title}
        />
        <CardContent>
          <Typography
            component={Link}
            to={`/user/${elements[0].owner.name}`}
            variant="body1"
            color="textSecondary"
            className={classes.link}
          >
            {elements[0].owner.name}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {store.user.authenticated &&
          elements[0].owner._id === store.user.id ? (
            <IconButton
              component={Link}
              to={`/edit_artwork/${elements[0]._id}`}
              aria-label="Unsave artwork"
            >
              <EditIcon />
            </IconButton>
          ) : store.user.saved[elements[0]._id] ? (
            <IconButton
              onClick={() => handleUnsaveArtwork(elements[0]._id)}
              aria-label="Unsave artwork"
            >
              <SavedIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleSaveArtwork(elements[0]._id)}
              aria-label="Save artwork"
            >
              <SaveIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleModalOpen(elements[0]._id)}
            aria-label="Share artwork"
          >
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    )
    .flat();

  const modalBody = (id) => {
    const url = `${window.location}artwork/${id}`;
    const title = store.main.brand;

    return (
      <div className={classes.shareContainer}>
        <div className={classes.copyButton}>
          <CopyToClipboard
            text={url}
            onCopy={() =>
              enqueueSnackbar('Link copied', {
                variant: 'success',
                autoHideDuration: 1000,
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
              })
            }
          >
            <CopyIcon />
          </CopyToClipboard>
        </div>
        <FacebookShareButton
          url={url}
          quote={title}
          className={classes.socialButton}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={url}
          title={title}
          className={classes.socialButton}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <RedditShareButton
          url={url}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className={classes.socialButton}
        >
          <RedditIcon size={32} round />
        </RedditShareButton>
        <WhatsappShareButton
          url={url}
          title={title}
          separator=":: "
          className={classes.socialButton}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    );
  };

  const handleSaveArtwork = async (id) => {
    try {
      await ax.post(`/api/save_artwork/${id}`);
      dispatch({
        type: 'updateSaves',
        saved: {
          ...store.user.saved,
          [id]: true,
        },
      });
      enqueueSnackbar('Artwork saved', {
        variant: 'success',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsaveArtwork = async (id) => {
    try {
      await ax.delete(`/api/save_artwork/${id}`);
      dispatch({
        type: 'updateSaves',
        saved: {
          ...store.user.saved,
          [id]: false,
        },
      });
      enqueueSnackbar('Artwork unsaved', {
        variant: 'success',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalOpen = (id) => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
        body: modalBody(id),
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
        body: ``,
      },
    }));
  };

  return (
    <Paper className={classes.paper}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={artwork.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        }
      >
        <Masonry>{artwork}</Masonry>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Paper>
  );
};

export default withSnackbar(Gallery);
