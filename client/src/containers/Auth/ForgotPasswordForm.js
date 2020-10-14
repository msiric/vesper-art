import { Button, Grid, Link, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { postRecover } from "../../services/auth.js";
import { emailValidation } from "../../validation/email.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgotPasswordForm = () => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        userEmail: "",
      }}
      validationSchema={emailValidation}
      onSubmit={async (values, { resetForm }) => {
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
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Field name="userEmail">
            {({ field, form: { touched, errors }, meta }) => (
              <TextField
                {...field}
                type="text"
                label="Enter your email"
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
            Send recovery link
          </Button>
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
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
