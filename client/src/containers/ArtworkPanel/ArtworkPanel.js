import { Box, Fade, Grid } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { LinkRounded as CopyIcon } from "@material-ui/icons";
import React, { useState } from "react";
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
import Modal from "../../shared/Modal/Modal.js";

const useStyles = makeStyles((theme) => ({
  artworkWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    height: "fit-content",
    padding: 12,
  },
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
    const title = "test"; // $TODO appStore.brand;

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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={fixed ? 3 : 2}
              className={classes.artworkWrapper}
            >
              <Fade in>
                <ArtworkCard
                  artwork={artwork}
                  type={type}
                  fixed={fixed}
                  loading={loading}
                />
              </Fade>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Box>
  );
};

export default ArtworkPanel;
