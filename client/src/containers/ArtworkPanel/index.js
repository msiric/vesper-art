import { Box } from "@material-ui/core";
import { LinkRounded as CopyIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
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
import ArtworkCard from "../../components/ArtworkCard/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import Modal from "../../shared/Modal/Modal.js";
import artworkPanelStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

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
  const classes = artworkPanelStyles();

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
    <Box style={{ width: "100%", padding: "16px 0" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className={classes.masonryContainer}
          columnClassName={classes.masonryColumn}
        >
          {elements.map((artwork) => (
            <ArtworkCard
              artwork={artwork}
              type={type}
              fixed={fixed}
              loading={loading}
            />
          ))}
        </Masonry>
      </InfiniteScroll>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Box>
  );
};

export default ArtworkPanel;
