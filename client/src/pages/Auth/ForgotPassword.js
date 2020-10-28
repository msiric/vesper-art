import { Avatar, Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { VpnKeyRounded as RecoveryAvatar } from "@material-ui/icons";
import React from "react";
import ForgotPasswordForm from "../../forms/RecoveryForm/ForgotPasswordForm.js";

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

const ForgotPassword = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RecoveryAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Recover your password
        </Typography>
        <ForgotPasswordForm />
      </Box>
    </Container>
  );
};

export default ForgotPassword;
