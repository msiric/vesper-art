import { Box, Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  LinkRounded as CopyIcon,
  ShareRounded as ShareIcon,
} from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
import { AppContext } from "../../contexts/App.js";
import Modal from "../Modal/Modal.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  accordion: {
    minHeight: 80,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const ShareButton = ({ artwork, labeled }) => {
  const [appStore] = useContext(AppContext);
  const [state, setState] = useState({
    modal: {
      open: false,
      body: ``,
    },
  });
  const classes = useStyles();

  const modalBody = (id) => {
    const url = `${window.location}artwork/${id}`;
    const title = appStore.brand;

    return (
      <div className={classes.shareContainer}>
        <div className={classes.copyButton}>
          <CopyToClipboard text={url} onCopy={() => null}>
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
    <Box>
      {labeled ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ShareIcon />}
          onClick={() => handleModalOpen(artwork._id)}
        >
          Share
        </Button>
      ) : (
        <IconButton
          aria-label="Share artwork"
          onClick={() => handleModalOpen(artwork._id)}
          className={classes.artworkColor}
        >
          <ShareIcon />
        </IconButton>
      )}
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Box>
  );
};

export default ShareButton;
