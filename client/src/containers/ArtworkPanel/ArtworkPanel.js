import { CircularProgress, Grid, Paper } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { LinkRounded as CopyIcon } from '@material-ui/icons';
import React, { useContext, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { upload } from '../../../../common/constants.js';
import ArtworkCard from '../../components/ArtworkCard/ArtworkCard.js';
import { Context } from '../../context/Store.js';
import { deleteSave, postSave } from '../../services/artwork.js';
import Modal from '../../shared/Modal/Modal.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: '86.5vh',
  },
  masonryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  masonryGridColumn: {
    maxWidth: upload.artwork.fileTransform.width,
    minWidth: 320,
    width: '100%',
  },
}));

const artworkBreakpoints = {
  default: 6,
  [upload.artwork.fileTransform.width + 320 * 4]: 5,
  [upload.artwork.fileTransform.width + 320 * 3]: 4,
  [upload.artwork.fileTransform.width + 320 * 2]: 3,
  [upload.artwork.fileTransform.width + 320]: 2,
  [upload.artwork.fileTransform.width]: 1,
};

const ArtworkPanel = ({
  elements,
  hasMore,
  loadMore,
  enqueueSnackbar,
  type,
}) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    modal: {
      open: false,
      body: ``,
    },
  });
  const classes = useStyles();
  const theme = useTheme();

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

  return (
    <Paper className={classes.paper}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
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

        {/* specify cover width */}
        <Masonry
          breakpointCols={artworkBreakpoints}
          className={classes.masonryGrid}
          columnClassName={classes.masonryGridColumn}
        >
          {elements.map((artwork) => (
            <ArtworkCard user={store.user} artwork={artwork} type={type} />
            /*           <div
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
            </div> */
          ))}
        </Masonry>
        {/*         <StackGrid
          columnWidth={upload.artwork.fileTransform.width}
          gutterWidth={0}
          gutterHeight={0}
        >
          {elements.map((artwork) => (
            <ArtworkCard artwork={artwork} />
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
        </StackGrid> */}
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Paper>
  );
};

export default ArtworkPanel;
