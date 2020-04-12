import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert as Message } from '@material-ui/lab';

const Alert = ({ open, duration, handleClose, type, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Message onClose={handleClose} severity={type}>
        {message}
      </Message>
    </Snackbar>
  );
};

export default Alert;
