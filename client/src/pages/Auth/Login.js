import { Avatar, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LockRounded as LoginAvatar } from "@material-ui/icons";
import React from "react";
import LoginForm from "../../forms/LoginForm/LoginForm.js";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const Login = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LoginAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <LoginForm />
      </div>
    </Container>
  );
};

export default Login;
