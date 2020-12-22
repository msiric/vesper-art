import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { MeetingRoomRounded as SignupAvatar } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import SignupForm from "../../forms/SignupForm/index.js";
import { postSignup } from "../../services/auth.js";
import { signupValidation } from "../../validation/signup.js";

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

const Signup = () => {
  const { handleSubmit, formState, errors, control } = useForm({
    resolver: yupResolver(signupValidation),
  });

  const onSubmit = async (values) => {
    try {
      await postSignup.request({ data: values });
      /*         enqueueSnackbar('Verification email sent', {
          variant: 'success',
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }); */
    } catch (err) {
      history.push({
        pathname: "/login",
        state: { message: "An error occurred" },
      });
    }
  };

  const history = useHistory();
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SignupAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <SignupForm errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              padding
              loading={formState.isSubmitting}
            >
              Sign up
            </AsyncButton>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default Signup;
