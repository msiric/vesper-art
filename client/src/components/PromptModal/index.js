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
import promptModalStyles from "./styles";

const PromptModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
}) => {
  const classes = promptModalStyles();

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
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handleConfirm}
            >
              {promptConfirm}
            </Button>
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
      </Fade>
    </Modal>
  );
};

export default PromptModal;
