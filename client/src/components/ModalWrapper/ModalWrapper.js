import React from "react";
import { Modal } from "@material-ui/core";
import ModalWrapperStyles from "./ModalWrapper.style.js";

const ModalWrapper = ({ open, handleClose, ariaLabel, children }) => {
  const classes = ModalWrapperStyles();
  console.log(children);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabel}
      aria-describedby={ariaLabel}
      className={classes.modalWrapper}
    >
      {children}
    </Modal>
  );
};
export default ModalWrapper;
