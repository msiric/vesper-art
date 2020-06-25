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
import {
  CSSGrid,
  layout,
  measureItems,
  makeResponsive,
} from 'react-stonecutter';
import GalleryStyles from './Gallery.style.js';
import { postSave, deleteSave } from '../../services/artwork.js';

const Gallery = ({ elements, hasMore, loadMore, enqueueSnackbar, type }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    modal: {
      open: false,
      body: ``,
    },
  });

  const classes = GalleryStyles();

  const artwork = elements.map((element, index) => {
    let card = null;
    if (type === 'version') {
      card = (
        <Card key={index} className={classes.root}>
          <CardHeader
            title={element.title}
            subheader={
              element.availability === 'available'
                ? element.personal
                  ? `$${element.personal}`
                  : 'Free'
                : 'Showcase'
            }
          />
          <CardMedia
            component={Link}
            to={`/artwork/${element.artwork._id}`}
            className={classes.media}
            image={element.cover}
            title={element.title}
          />
          <CardContent>
            <Typography
              component={Link}
              to={`/user/${element.artwork.owner.name}`}
              variant="body1"
              color="textSecondary"
              className={classes.link}
            >
              {element.artwork.owner.name}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            {store.user.authenticated &&
            element.artwork.owner._id === store.user.id ? (
              <IconButton
                component={Link}
                to={`/edit_artwork/${element.artwork._id}`}
                aria-label="Unsave artwork"
              >
                <EditIcon />
              </IconButton>
            ) : store.user.saved[element.artwork._id] ? (
              <IconButton
                onClick={() => handleUnsaveArtwork(element.artwork._id)}
                aria-label="Unsave artwork"
              >
                <SavedIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => handleSaveArtwork(element.artwork._id)}
                aria-label="Save artwork"
              >
                <SaveIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => handleModalOpen(element.artwork._id)}
              aria-label="Share artwork"
            >
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      );
    } else {
      card = (
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
    }
    return card;
  });

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
      await postSave({ artworkId: id });
      dispatch({
        type: 'updateSaves',
        saved: {
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
      await deleteSave({ artworkId: id });
      dispatch({
        type: 'updateSaves',
        saved: {
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

  const Grid = makeResponsive(measureItems(CSSGrid), {
    maxWidth: 1920,
    minPadding: 100,
  });

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
        <CSSGrid
          component="ul"
          layout={layout.pinterest}
          duration={800}
          easing="ease-out"
        >
          {artwork.map((item, index) => (
            <li key={index} itemHeight={120}>
              {item}
            </li>
          ))}
        </CSSGrid>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Paper>
  );
};

export default withSnackbar(Gallery);
