import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  modalWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
  },
  modalTitle: {
    paddingBottom: theme.spacing(2),
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
}));

const PromptModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
}) => {
  const classes = useStyles();

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
