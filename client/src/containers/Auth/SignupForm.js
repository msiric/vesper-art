import { Button, Grid, Link, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Context } from "../../context/Store.js";
import { postSignup } from "../../services/auth.js";
import { signupValidation } from "../../validation/signup.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignupForm = () => {
  const [store, dispatch] = useContext(Context);

  const history = useHistory();
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        userUsername: "",
        userEmail: "",
        userPassword: "",
        userConfirm: "",
      }}
      validationSchema={signupValidation}
      onSubmit={async (values, { resetForm }) => {
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
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Field name="userUsername">
            {({ field, form: { touched, errors }, meta }) => (
              <TextField
                {...field}
                type="text"
                label="Username"
                helperText={meta.touched && meta.error}
                error={meta.touched && Boolean(meta.error)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
            )}
          </Field>
          <Field name="userEmail">
            {({ field, form: { touched, errors }, meta }) => (
              <TextField
                {...field}
                type="email"
                label="Email"
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
          <Field name="userConfirm">
            {({ field, form: { touched, errors }, meta }) => (
              <TextField
                {...field}
                type="password"
                label="Confirm Password"
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
            Sign up
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
