import React from 'react';
import { Avatar, Typography, Container } from '@material-ui/core';
import { VpnKeyRounded as RecoveryAvatar } from '@material-ui/icons';
import ForgotPasswordForm from '../../containers/Auth/ForgotPasswordForm.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const ForgotPassword = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RecoveryAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Recover your password
        </Typography>
        <ForgotPasswordForm />
      </div>
    </Container>
  );
};

export default ForgotPassword;
