import { ShareOutlined as ShareIcon } from "@material-ui/icons";
import React, { useState } from "react";
import Box from "../../domain/Box";
import IconButton from "../../domain/IconButton";
import ShareModal from "../ShareModal/index";
import SkeletonWrapper from "../SkeletonWrapper/index";
import SyncButton from "../SyncButton/index";
import shareButtonStyles from "./styles";

const ShareButton = ({
  link,
  type,
  labeled,
  loading = false,
  shouldResize = false,
  fontSize = "medium",
  ...props
}) => {
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
        <SyncButton
          startIcon={<ShareIcon fontSize={fontSize} />}
          onClick={() => handleModalOpen()}
          loading={loading}
          {...props}
        >
          Share
        </SyncButton>
      ) : (
        <SkeletonWrapper loading={loading}>
          <IconButton
            aria-label="Share artwork"
            onClick={() => handleModalOpen()}
            {...props}
          >
            <ShareIcon
              className={shouldResize ? classes.icon : ""}
              fontSize={fontSize}
            />
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
