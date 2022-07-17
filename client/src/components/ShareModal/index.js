import {
  CloseRounded as CloseIcon,
  LinkRounded as CopyIcon,
} from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
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
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import Fade from "../../domain/Fade";
import Modal from "../../domain/Modal";
import Popper from "../../domain/Popper";
import Typography from "../../domain/Typography";
import SyncButton from "../SyncButton/index";
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
    popper: { open: false, label: "" },
    copy: { status: "idle" },
  });
  const anchorEl = useRef(null);
  const url = `${window.location.origin}${href}`;
  const title = "test"; // $TODO appStore.brand;

  const classes = shareModalStyles();

  const handlePopperChange = (status, label) => {
    setState((prevState) => ({
      ...prevState,
      copy: {
        ...prevState.copy,
        status: status === "idle" ? "idle" : status ? "success" : "fail",
      },
      popper: {
        ...prevState.popper,
        label,
      },
    }));
  };

  const handlePopperOpen = (e, label) => {
    setState((prevState) => ({
      ...prevState,
      popper: {
        ...prevState.popper,
        open: true,
        label,
      },
    }));
  };

  const handlePopperClose = () => {
    setState((prevState) => ({
      ...prevState,
      popper: { ...prevState.popper, open: false, label: "" },
    }));
  };

  const handleCopyButton = (success) => {
    const label = success !== "idle" ? (success ? "Copied" : "Failed") : "Copy";
    handlePopperChange(success, label);
  };

  useEffect(() => {
    if (state.copy.status !== "idle") {
      setTimeout(() => {
        handleCopyButton("idle");
      }, 1000);
    }
  }, [state.copy.status]);

  return (
    <Box>
      <Modal
        aria-labelledby={ariaLabel}
        aria-describedby={ariaLabel}
        className={classes.modal}
        open={open}
        onClose={() => handleClose({ callback: handlePopperClose })}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box className={classes.content}>
            <Typography className={classes.title}>{promptTitle}</Typography>
            <Divider />
            <Box className={classes.actions}>
              <Box className={classes.wrapper}>
                <Box
                  className={classes.button}
                  onMouseEnter={(e) => {
                    anchorEl.current = e.currentTarget;
                    handlePopperOpen(
                      e,
                      state.copy.status !== "idle"
                        ? state.copy.status === "success"
                          ? "Copied"
                          : "Failed"
                        : "Copy"
                    );
                  }}
                  onMouseLeave={handlePopperClose}
                >
                  <CopyToClipboard
                    text={url}
                    className={classes.copy}
                    onCopy={(_, success) => handleCopyButton(success)}
                  >
                    <CopyIcon />
                  </CopyToClipboard>
                </Box>
                <FacebookShareButton
                  url={url}
                  quote={title}
                  className={classes.button}
                  onMouseEnter={(e) => {
                    anchorEl.current = e.currentTarget;
                    handlePopperOpen(e, "Share");
                  }}
                  onMouseLeave={handlePopperClose}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={url}
                  title={title}
                  className={classes.button}
                  onMouseEnter={(e) => {
                    anchorEl.current = e.currentTarget;
                    handlePopperOpen(e, "Tweet");
                  }}
                  onMouseLeave={handlePopperClose}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <RedditShareButton
                  url={url}
                  title={title}
                  windowWidth={660}
                  windowHeight={460}
                  className={classes.button}
                  onMouseEnter={(e) => {
                    anchorEl.current = e.currentTarget;
                    handlePopperOpen(e, "Post");
                  }}
                  onMouseLeave={handlePopperClose}
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>
                <WhatsappShareButton
                  url={url}
                  title={title}
                  separator=":: "
                  className={classes.button}
                  onMouseEnter={(e) => {
                    anchorEl.current = e.currentTarget;
                    handlePopperOpen(e, "Message");
                  }}
                  onMouseLeave={handlePopperClose}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </Box>
              <Box>
                <SyncButton
                  type="button"
                  color="secondary"
                  onClick={() => handleClose({ callback: handlePopperClose })}
                  onMouseEnter={handlePopperOpen}
                  onMouseLeave={handlePopperClose}
                  className={classes.cancel}
                  startIcon={<CloseIcon />}
                >
                  {promptCancel}
                </SyncButton>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Popper
        open={state.popper.open}
        anchorEl={anchorEl.current}
        className={classes.popper}
      >
        <Typography>{state.popper.label}</Typography>
      </Popper>
    </Box>
  );
};

export default ShareModal;
