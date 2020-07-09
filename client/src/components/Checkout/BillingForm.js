import React from "react";
import { TextField, Grid, Typography, Button } from "@material-ui/core";
import AutocompleteInput from "../../shared/AutocompleteInput/AutocompleteInput.js";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import BillingFormStyles from "./BillingForm.style.js";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().trim().required("Address is required"),
  zip: Yup.string().trim().required("Postal code is required"),
  city: Yup.string().trim().required("City is required"),
  country: Yup.string().trim().required("Country is required"),
});

const BillingForm = ({ billing, handleStepChange, handleBillingSave }) => {
  const classes = BillingFormStyles();

  return (
    <>
      <Formik
        initialValues={{ ...billing }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          handleBillingSave(values);
          handleStepChange(1);
        }}
      >
        {({ values, errors, touched, enableReinitialize }) => (
          <Form>
            <Grid item xs={12}>
              <Typography variant="h6">Billing Information</Typography>

              <Grid item xs={12} sm={4}>
                <Field name="firstname">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      label="First name"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field name="lastname">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      label="Last name"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field name="email">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="address">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      label="Street address"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="zip">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      label="Postal code"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="city">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      label="City"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="country">
                  {({
                    field,
                    form: { touched, errors, setFieldValue, setFieldTouched },
                    meta,
                  }) => (
                    <AutocompleteInput
                      {...field}
                      options={countries}
                      handleChange={(e, value) =>
                        setFieldValue("country", value || "")
                      }
                      handleBlur={() => setFieldTouched("country", true)}
                      getOptionLabel={(option) => option.name}
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      label="Country"
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
            <Grid container item justify="flex-end">
              <Button
                className={classes.button}
                onClick={() => handleStepChange(-1)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
              >
                Next
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BillingForm;
