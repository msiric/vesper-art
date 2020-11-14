import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Button,
  CardActions,
  CardContent,
  Container,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { VpnKeyRounded as RecoveryAvatar } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import ForgotPasswordForm from "../../forms/RecoveryForm/index.js";
import { postRecover } from "../../services/auth.js";
import { emailValidation } from "../../validation/email.js";

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
  const { handleSubmit, formState, errors, control } = useForm({
    defaultValues: {
      userEmail: "",
    },
    resolver: yupResolver(emailValidation),
  });

  const history = useHistory();
  const classes = useStyles();

  const onSubmit = async (values) => {
    try {
      await postRecover.request({ data: values });
      history.push({
        pathname: "/login",
        state: { message: "Link sent to your email" },
      });
    } catch (err) {
      history.push({
        pathname: "/",
        state: { message: "An error occurred" },
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RecoveryAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Recover your password
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <ForgotPasswordForm errors={errors} />
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                className={classes.submit}
                disabled={formState.isSubmitting}
              >
                Send recovery link
              </Button>
            </CardActions>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/login" variant="body2">
                  Back to login
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
