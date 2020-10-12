import { Box, Grid } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { LinkRounded as CopyIcon } from "@material-ui/icons";
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
import { upload } from "../../../../common/constants.js";
import ArtworkCard from "../../components/ArtworkCard/ArtworkCard.js";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import { Context } from "../../context/Store.js";
import { deleteSave, postSave } from "../../services/artwork.js";
import Modal from "../../shared/Modal/Modal.js";

const useStyles = makeStyles((theme) => ({
  masonryGrid: {
    display: "flex",
    flexWrap: "wrap",
  },
  masonryGridColumn: {
    maxWidth: upload.artwork.fileTransform.width,
    minWidth: 320,
    width: "100%",
  },
}));

const ArtworkPanel = ({
  elements,
  hasMore,
  loadMore,
  enqueueSnackbar,
  type,
  fixed,
  loading,
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
      await postSave({ artworkId: id });
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
      await deleteSave({ artworkId: id });
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

  return (
    <Box style={{ width: "100%" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        <Grid container className={classes.container}>
          {elements.map((artwork) => (
            <ArtworkCard
              user={store.user}
              artwork={artwork}
              type={type}
              fixed={fixed}
              loading={loading}
            />
          ))}
        </Grid>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Box>
  );
};

export default ArtworkPanel;
