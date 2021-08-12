import React from "react";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import Fade from "../../domain/Fade";
import Modal from "../../domain/Modal";
import Typography from "../../domain/Typography";
import AsyncButton from "../AsyncButton";
import SyncButton from "../SyncButton";
import promptModalStyles from "./styles";

const PromptModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
  isDisabled,
  isSubmitting,
  children,
}) => {
  const classes = promptModalStyles();

  return (
    <Modal
      aria-labelledby={ariaLabel}
      aria-describedby={ariaLabel}
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.content}>
          <Typography className={classes.title}>{promptTitle}</Typography>
          <Divider className={classes.divider} />
          {children && <Box>{children}</Box>}
          <Box className={classes.actions}>
            <AsyncButton
              type="submit"
              disabled={isDisabled}
              submitting={isSubmitting}
              onClick={handleConfirm}
              fullWidth
            >
              {promptConfirm}
            </AsyncButton>
            <SyncButton type="button" color="dark" onClick={handleClose}>
              {promptCancel}
            </SyncButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PromptModal;
