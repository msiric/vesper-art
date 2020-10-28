import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { postReset } from "../../services/auth.js";
import { resetValidation } from "../../validation/reset.js";

const ResetPasswordForm = ({ match }) => {
  const history = useHistory();
  const classes = {};

  return (
    <Formik
      initialValues={{
        userPassword: "",
        userConfirm: "",
      }}
      validationSchema={resetValidation}
      onSubmit={async (values, { resetForm }) => {
        try {
          await postReset.request({ userId: match.params.id, data: values });
          history.push({
            pathname: "/login",
            state: { message: "Password successfully changed" },
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
          <Card className={classes.card}>
            <Typography variant="h6" align="center">
              Reset password
            </Typography>
            <CardContent>
              <Field name="userPassword">
                {({ field, form: { touched, errors }, meta }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Enter a new password"
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
                    label="Confirm your password"
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button component={Link} to="/login" color="primary">
                Log in
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Reset password
              </Button>
            </CardActions>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
