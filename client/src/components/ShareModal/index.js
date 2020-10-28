import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Typography,
} from "@material-ui/core";
import React from "react";
import shareModalStyles from "./styles";

const ShareModal = ({
  open,
  url,
  handleClose,
  ariaLabel,
  promptTitle,
  promptCancel,
}) => {
  const url = `${window.location}${url}`;
  const title = "test"; // $TODO appStore.brand;

  const classes = shareModalStyles();

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
              <Box className={classes.copyButton}>
                <CopyToClipboard text={url} onCopy={() => null}>
                  <CopyIcon />
                </CopyToClipboard>
              </Box>
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
            </Box>
            <Box>
              <Button
                type="button"
                variant="outlined"
                color="dark"
                onClick={handleClose}
              >
                {promptCancel}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ShareModal;
