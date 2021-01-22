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
import { LockRounded as LoginAvatar } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { loginValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useTracked as useEventsContext } from "../../contexts/Events.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import LoginForm from "../../forms/LoginForm/index.js";
import { postLogin } from "../../services/auth.js";

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
  const [userStore, userDispatch] = useUserContext();
  const [eventsStore, eventsDispatch] = useEventsContext();

  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, formState, errors, control } = useForm({
    defaultValues: {
      userUsername: "",
      userPassword: "",
    },
    resolver: yupResolver(loginValidation),
  });

  const history = useHistory();
  const classes = useStyles();

  const onSubmit = async (values) => {
    try {
      const { data } = await postLogin.request({ data: values });

      if (data.user) {
        userDispatch({
          type: "SET_USER",
          authenticated: true,
          token: data.accessToken,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
          stripeId: data.user.stripeId,
          country: data.user.country,
          favorites: data.user.favorites.reduce((object, item) => {
            object[item.artworkId] = true;
            return object;
          }, {}),
          intents: data.user.intents.reduce((object, item) => {
            object[item.artworkId] = item.intentId;
            return object;
          }, {}),
        });
        eventsDispatch({
          type: "SET_EVENTS",
          messages: { items: [], count: data.user.messages },
          notifications: {
            ...eventsStore.notifications,
            items: [],
            count: data.user.notifications,
            hasMore: true,
            cursor: "",
            limit: 10,
          },
        });
      }
      history.push("/");
    } catch (err) {
      console.log(err);
      enqueueSnackbar(postLogin.error.message, {
        variant: postLogin.error.variant,
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LoginAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <LoginForm errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              padding
              loading={formState.isSubmitting}
            >
              Sign in
            </AsyncButton>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/account_restoration"
                  variant="body2"
                >
                  Trouble logging in?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default Login;
