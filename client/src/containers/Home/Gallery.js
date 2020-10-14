import { Grid, Paper } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { LinkRounded as CopyIcon } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import React, { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import StackGrid from "react-stack-grid";
import ArtworkCard from "../../components/ArtworkCard/ArtworkCard.js";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import { deleteSave, postSave } from "../../services/artwork.js";
import Modal from "../../shared/Modal/Modal.js";
import { Context } from "../Store/Store.js";
import GalleryStyles from "./Gallery.style.js";

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
    type !== "version"
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
              enqueueSnackbar("Link copied", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
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
      await postSave.request({ artworkId: id });
      dispatch({
        type: "updateSaves",
        saved: {
          [id]: true,
        },
      });
      enqueueSnackbar("Artwork saved", {
        variant: "success",
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsaveArtwork = async (id) => {
    try {
      await deleteSave.request({ artworkId: id });
      dispatch({
        type: "updateSaves",
        saved: {
          [id]: false,
        },
      });
      enqueueSnackbar("Artwork unsaved", {
        variant: "success",
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
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

  const breakpointCols = {
    default: 4,
    [theme.breakpoints.values.xl]: 4,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.xs]: 1,
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={artwork.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
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
        <StackGrid columnWidth={150} gutterWidth={0} gutterHeight={0}>
          {elements.map((artwork) => (
            <ArtworkCard user={store.user} artwork={artwork} />
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
        </StackGrid>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Paper>
  );
};

export default withSnackbar(Gallery);
