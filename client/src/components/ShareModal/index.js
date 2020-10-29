import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Popover,
  Typography,
} from "@material-ui/core";
import { LinkRounded as CopyIcon } from "@material-ui/icons";
import React, { useState } from "react";
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
import shareModalStyles from "./styles";

const ShareModal = ({
  open,
  href,
  handleClose,
  ariaLabel,
  promptTitle,
  promptCancel,
}) => {
  const [state, setState] = useState({
    popover: { label: "", anchor: null },
  });
  const url = `${window.location}${href}`;
  const title = "test"; // $TODO appStore.brand;

  const classes = shareModalStyles();

  const handlePopoverOpen = (e, label) => {
    setState({ popover: { label, anchor: e.currentTarget } });
  };

  const handlePopoverClose = () => {
    setState({ popover: { label: "", anchor: null } });
  };

  return (
    <Modal
      aria-labelledby={ariaLabel}
      aria-describedby={ariaLabel}
      className={classes.modalWrapper}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.modalContent}>
          <Typography className={classes.modalTitle}>{promptTitle}</Typography>
          <Divider />
          <Box className={classes.modalActions}>
            <Box className={classes.shareContainer}>
              <Box
                className={classes.socialButton}
                onMouseEnter={(e) => handlePopoverOpen(e, "Copy")}
                onMouseLeave={handlePopoverClose}
              >
                <CopyToClipboard text={url} onCopy={() => null}>
                  <CopyIcon />
                </CopyToClipboard>
              </Box>
              <FacebookShareButton
                url={url}
                quote={title}
                className={classes.socialButton}
                onMouseEnter={(e) => handlePopoverOpen(e, "Share")}
                onMouseLeave={handlePopoverClose}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={url}
                title={title}
                className={classes.socialButton}
                onMouseEnter={(e) => handlePopoverOpen(e, "Tweet")}
                onMouseLeave={handlePopoverClose}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <RedditShareButton
                url={url}
                title={title}
                windowWidth={660}
                windowHeight={460}
                className={classes.socialButton}
                onMouseEnter={(e) => handlePopoverOpen(e, "Post")}
                onMouseLeave={handlePopoverClose}
              >
                <RedditIcon size={32} round />
              </RedditShareButton>
              <WhatsappShareButton
                url={url}
                title={title}
                separator=":: "
                className={classes.socialButton}
                onMouseEnter={(e) => handlePopoverOpen(e, "Message")}
                onMouseLeave={handlePopoverClose}
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </Box>
            <Box className={classes.modalActions}>
              <Button
                type="button"
                variant="outlined"
                color="dark"
                onClick={handleClose}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                {promptCancel}
              </Button>
            </Box>
            <Popover
              id="mouse-over-popover"
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={!!state.popover.anchor}
              anchorEl={state.popover.anchor}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography>
                {state.popover.anchor && state.popover.label}
              </Typography>
            </Popover>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ShareModal;
