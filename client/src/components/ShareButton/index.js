import { Box, Button, IconButton } from "@material-ui/core";
import { ShareRounded as ShareIcon } from "@material-ui/icons";
import React, { useState } from "react";
import ShareModal from "../ShareModal/index.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import shareButtonStyles from "./styles.js";

const ShareButton = ({ link, type, labeled, loading = false, ...props }) => {
  const [state, setState] = useState({
    modal: {
      open: false,
    },
  });

  const classes = shareButtonStyles();

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
      },
    }));
  };

  const handleModalClose = ({ callback }) => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
      },
    }));
    callback();
  };

  return (
    <Box>
      {labeled ? (
        <SkeletonWrapper loading={loading}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={() => handleModalOpen()}
            {...props}
          >
            Share
          </Button>
        </SkeletonWrapper>
      ) : (
        <SkeletonWrapper loading={loading}>
          <IconButton
            aria-label="Share artwork"
            onClick={() => handleModalOpen()}
            className={classes.artworkColor}
            {...props}
          >
            <ShareIcon />
          </IconButton>
        </SkeletonWrapper>
      )}
      <ShareModal
        open={state.modal.open}
        href={link}
        ariaLabel="Share modal"
        promptTitle={`Share ${type}`}
        promptCancel="Close"
        handleClose={handleModalClose}
      />
    </Box>
  );
};

export default ShareButton;
