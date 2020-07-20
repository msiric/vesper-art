import React from "react";
import { Modal as Popup } from "@material-ui/core";
import ModalStyles from "./Modal.style.js";

const Modal = ({ open, handleClose, body }) => {
  const classes = ModalStyles();

  return (
    <Popup
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modal}
    >
      {body}
    </Popup>
  );
};
export default Modal;
