import React, { useState, useContext } from 'react';
import { Context } from '../Store/Store.js';
import Masonry from 'react-mason';
import StackGrid from 'react-stack-grid';
import Modal from '../../shared/Modal/Modal.js';
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
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageGallery from 'react-photo-gallery';
import GalleryStyles from './Gallery.style.js';
import { postSave, deleteSave } from '../../services/artwork.js';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const Gallery = ({ elements, hasMore, loadMore, enqueueSnackbar, type }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    modal: {
      open: false,
      body: ``,
    },
  });

  const classes = GalleryStyles();
  const theme = useTheme();

  const artwork = elements.map((element) =>
    type !== 'version'
      ? {
          /*           data: element.current,
          owner: element.owner, */
          src: element.current.cover,
          height: element.current.height,
          width: element.current.width,
        }
      : {
          data: element,
          owner: element.artwork.owner,
          src: element.cover,
          height: element.height,
          width: element.width,
        }
  );

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

  const handleImageClick = (e, item) => {
    console.log(item);
  };

  const breakpointCols = {
    default: 4,
    [theme.breakpoints.values.xl]: 4,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.xs]: 1,
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
        {/*         <ImageGallery
          photos={artwork}
          onClick={(e, item) => handleImageClick(e, item)}
        ></ImageGallery> */}
        {/*         <div className={classes.artworkContainer}>
          {elements.map((artwork) => (
            <div className={classes.artworkItem}>
              <img
                className={classes.artworkMedia}
                src={artwork.current.cover}
              />
            </div>
          ))}
        </div> */}

        {/*         {
          <Masonry>
            {elements.map((artwork) => (
              <div>
                <img className={classes.artwork} src={artwork.current.cover} />
              </div>
            ))}
          </Masonry>
        } */}

        {/* specify cover width */}
        <StackGrid columnWidth={150} gutterWidth={0} gutterHeight={0}>
          {elements.map((artwork) => (
            <div
              key={artwork._id}
              component={Link}
              to={`/artwork/${artwork._id}`}
              className={classes.artworkContainer}
            >
              <div className={classes.artworkHeader}>
                <p className={classes.artworkTitle}>{artwork.current.title}</p>
              </div>
              <img
                className={classes.artworkMedia}
                src={artwork.current.cover}
              />
              <div className={classes.artworkFooter}>
                <p className={classes.artworkOwner}>{artwork.owner.name}</p>
              </div>
            </div>
          ))}
        </StackGrid>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Paper>
  );
};

export default withSnackbar(Gallery);
