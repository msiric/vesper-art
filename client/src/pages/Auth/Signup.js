import React from 'react';
import { Avatar, Typography, Container } from '@material-ui/core';
import { MeetingRoomRounded as SignupAvatar } from '@material-ui/icons';
import SignupForm from '../../containers/Auth/SignupForm.js';
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

const Signup = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SignupAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <SignupForm />
      </div>
    </Container>
  );
};

export default Signup;
