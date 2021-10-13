import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  LockOpenRounded as LoginIcon,
  LockRounded as LoginAvatar,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { isFormAltered } from "../../../../common/helpers";
import { loginValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import LoginForm from "../../forms/LoginForm/index";
import { postLogin } from "../../services/auth";

const useStyles = makeStyles((muiTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: muiTheme.spacing(1),
    backgroundColor: muiTheme.palette.primary.main,
  },
  form: {
    width: "100%",
  },
  actions: {
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

const Login = () => {
  const setUser = useUserStore((state) => state.setUser);

  const notifications = useEventsStore((state) => state.notifications);
  const setEvents = useEventsStore((state) => state.setEvents);

  const setDefaultValues = () => ({
    userUsername: "",
    userPassword: "",
  });

  const { handleSubmit, getValues, formState, errors, watch, control } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(loginValidation),
    });

  const history = useHistory();
  const classes = useStyles();

  const watchedValues = watch();

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) || formState.isSubmitting;

  const onSubmit = async (values) => {
    try {
      const { data } = await postLogin.request({ data: values });

      if (data.user) {
        setUser({
          authenticated: true,
          token: data.accessToken,
          id: data.user.id,
          name: data.user.name,
          fullName: data.user.fullName,
          email: data.user.email,
          avatar: data.user.avatar,
          stripeId: data.user.stripeId,
          country: data.user.country,
          favorites: data.user.favorites.reduce((object, item) => {
            object[item.artworkId] = true;
            return object;
          }, {}),
        });
        setEvents({
          notifications: {
            ...notifications,
            items: [],
            count: data.user.notifications,
            hasMore: true,
            cursor: "",
            limit: 10,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <LoginAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <LoginForm errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              startIcon={<LoginIcon />}
            >
              Sign in
            </AsyncButton>
            <Grid container className={classes.actions}>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/account_restoration"
                  variant="body2"
                  color="secondary"
                >
                  Trouble logging in?
                </Link>
              </Grid>
              <Grid item xs>
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
