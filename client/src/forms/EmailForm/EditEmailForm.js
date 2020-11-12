import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { emailValidation } from "../../validation/email.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const EditEmailForm = () => {
  const history = useHistory();

  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        userEmail: "",
      }}
      enableReinitialize
      validationSchema={emailValidation}
      onSubmit={async (values, { resetForm }) => {
        /*         await patchEmail.request({
          userId: store.user.id,
          data: values,
        });

        setState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            email: values.email,
            verified: false,
          },
        }));
        resetForm(); */
      }}
    >
      {({ values, errors, touched }) => (
        <Form className={classes.updateEmail}>
          <div>
            <Field name="userEmail">
              {({ field, form: { touched, errors }, meta }) => (
                <TextField
                  {...field}
                  onBlur={() => null}
                  label="Update email address"
                  type="text"
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

export default EditEmailForm;
