import { Button, Grid, Link, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { EventsContext } from "../../contexts/Events.js";
import { UserContext } from "../../contexts/User.js";
import { postLogin } from "../../services/auth.js";
import { loginValidation } from "../../validation/login.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginForm = () => {
  const [userStore, userDispatch] = useContext(UserContext);
  const [eventsStore, eventsDispatch] = useContext(EventsContext);

  const history = useHistory();
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        userUsername: "",
        userPassword: "",
      }}
      validationSchema={loginValidation}
      onSubmit={async (values, { resetForm }) => {
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
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Field name="userUsername">
            {({ field, form: { touched, errors }, meta }) => (
              <TextField
                {...field}
                type="text"
                label="Username or email"
                helperText={meta.touched && meta.error}
                error={meta.touched && Boolean(meta.error)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
            )}
          </Field>
          <Field name="userPassword">
            {({ field, form: { touched, errors }, meta }) => (
              <TextField
                {...field}
                type="password"
                label="Password"
                helperText={meta.touched && meta.error}
                error={meta.touched && Boolean(meta.error)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
            )}
          </Field>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.submit}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/forgot_password"
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
