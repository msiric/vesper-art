import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Link } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import { EventsContext } from "../../contexts/Events.js";
import { UserContext } from "../../contexts/User.js";
import TextInput from "../../controls/TextInput/index.js";
import { postLogin } from "../../services/auth.js";
import { loginValidation } from "../../validation/login.js";

const LoginForm = () => {
  const [userStore, userDispatch] = useContext(UserContext);
  const [eventsStore, eventsDispatch] = useContext(EventsContext);

  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, formState, errors, control } = useForm({
    resolver: yupResolver(loginValidation),
  });

  const history = useHistory();

  const onSubmit = async (values) => {
    try {
      const { data } = await postLogin.request({ data: values });

      if (data.user) {
        userDispatch({
          type: "setUser",
          authenticated: true,
          token: data.accessToken,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          photo: data.user.photo,
          stripeId: data.user.stripeId,
          country: data.user.country,
          saved: data.user.saved.reduce(function (object, item) {
            object[item] = true;
            return object;
          }, {}),
          intents: data.user.intents.reduce(function (object, item) {
            object[item.artworkId] = item.intentId;
            return object;
          }, {}),
        });
        eventsDispatch({
          type: "setEvents",
          messages: { items: [], count: data.user.messages },
          notifications: {
            ...eventsStore.notifications,
            items: [],
            count: data.user.notifications,
            hasMore: true,
            dataCursor: 0,
            dataCeiling: 10,
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
    <Box>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="userUsername"
            type="text"
            label="Username or email"
            errors={errors}
          />
          <TextInput
            name="userPassword"
            type="password"
            label="Password"
            errors={errors}
          />
          <AsyncButton
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            padding
            loading={formState.isSubmitting}
          >
            Sign In
          </AsyncButton>
        </form>
      </FormProvider>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/forgot_password" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/signup" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;
