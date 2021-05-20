import { Box, Button, IconButton } from "@material-ui/core";
import { ShareRounded as ShareIcon } from "@material-ui/icons";
import React, { useState } from "react";
import ShareModal from "../ShareModal/index.js";
import shareButtonStyles from "./styles.js";

const ShareButton = ({ link, type, labeled, ...props }) => {
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
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ShareIcon />}
          onClick={() => handleModalOpen()}
          {...props}
        >
          Share
        </Button>
      ) : (
        <IconButton
          aria-label="Share artwork"
          onClick={() => handleModalOpen()}
          className={classes.artworkColor}
          {...props}
        >
          <ShareIcon />
        </IconButton>
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
