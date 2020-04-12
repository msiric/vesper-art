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
} from '@material-ui/core';
import {
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
} from '@material-ui/icons';
import {
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
} from 'react-share';
import { Link } from 'react-router-dom';
import ax from '../../axios.config';
import GalleryStyles from './Gallery.style';

const Gallery = ({ elements }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    modal: {
      open: false,
      body: ``,
    },
  });
  const classes = GalleryStyles();

  const modalBody = (id) => {
    const url = `${window.location}artwork/${id}`;
    const title = store.settings.brand;

    return (
      <div>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <RedditShareButton
          url={url}
          title={title}
          windowWidth={660}
          windowHeight={460}
        >
          <RedditIcon size={32} round />
        </RedditShareButton>
        <TumblrShareButton url={url} title={title}>
          <TumblrIcon size={32} round />
        </TumblrShareButton>
        <PinterestShareButton url={url} media={``}>
          <PinterestIcon size={32} round />
        </PinterestShareButton>
      </div>
    );
  };

  const handleSaveArtwork = async (id) => {
    try {
      await ax.post(`/api/save_artwork/${id}`);
      dispatch({
        type: 'setUser',
        ...store,
        saved: {
          ...store.saved,
          [id]: true,
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
        type: 'setUser',
        ...store,
        saved: {
          ...store.saved,
          [id]: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalOpen = (id) => {
    setState({
      ...state,
      modal: { ...state.modal, open: true, body: modalBody(id) },
    });
  };

  const handleModalClose = () => {
    setState({ ...state, modal: { ...state.modal, open: false, body: `` } });
  };

  const artwork = elements.map((element, index) => {
    return (
      <Card key={index} className={classes.root}>
        <CardHeader
          title={element.owner.name}
          subheader={
            element.current.available
              ? element.current.price
                ? `$${element.current.price}`
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
          <Typography variant="body2" color="textSecondary" component="p">
            {element.current.title}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {store.user.saved[element._id] ? (
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

  return (
    <Paper className={classes.paper}>
      <Masonry>{artwork}</Masonry>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Paper>
  );
};

export default Gallery;
