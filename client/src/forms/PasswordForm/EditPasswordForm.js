import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { passwordValidation } from "../../validation/password.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const EditPasswordForm = () => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        userCurrent: "",
        userPassword: "",
        userConfirm: "",
      }}
      enableReinitialize
      validationSchema={passwordValidation}
      onSubmit={async (values, { resetForm }) => {
        /*         await patchPassword.request({
          userId: store.user.id,
          data: values,
        });
        resetForm(); */
      }}
    >
      {({ values, errors, touched }) => (
        <Form className={classes.updatePassword}>
          <div>
            <Field name="userCurrent">
              {({ field, form: { touched, errors }, meta }) => (
                <TextField
                  {...field}
                  onBlur={() => null}
                  label="Enter current password"
                  type="password"
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
                  onBlur={() => null}
                  label="Enter new password"
                  type="password"
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
                  onBlur={() => null}
                  label="Confirm password"
                  type="password"
                  helperText={meta.touched && meta.error}
                  error={meta.touched && Boolean(meta.error)}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            </Field>
          </div>
          <div>
            <Button type="submit" color="primary" fullWidth>
              Update
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditPasswordForm;
