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
import AsyncButton from "../AsyncButton";
import promptModalStyles from "./styles";

const PromptModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
  isSubmitting,
  children,
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
          {children && <Box>{children}</Box>}
          <Box className={classes.modalActions}>
            <AsyncButton
              type="submit"
              variant="outlined"
              color="primary"
              submitting={isSubmitting}
              onClick={handleConfirm}
              fullWidth
            >
              {promptConfirm}
            </AsyncButton>
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
