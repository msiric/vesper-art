import { Avatar, Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardRounded as ResetAvatar } from "@material-ui/icons";
import React from "react";
import ResetPasswordForm from "../../forms/ResetForm/ResetPasswordForm.js";

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

const ResetPassword = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ResetAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset your password
        </Typography>
        <ResetPasswordForm />
      </Box>
    </Container>
  );
};

export default ResetPassword;
