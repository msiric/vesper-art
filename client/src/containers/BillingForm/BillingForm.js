import { Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { countries } from '../../../../common/constants.js';
import AutocompleteInput from '../../shared/AutocompleteInput/AutocompleteInput.js';

const BillingFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  artwork: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    width: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  details: {
    display: 'flex',
    width: '100%',
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: '100%',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    width: '100%',
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: 'right',
  },
  manageLicenses: {
    padding: '8px 16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const validationSchema = Yup.object().shape({
  firstname: Yup.string().trim().required('First name is required'),
  lastname: Yup.string().trim().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().trim().required('Address is required'),
  zip: Yup.string().trim().required('Postal code is required'),
  city: Yup.string().trim().required('City is required'),
  country: Yup.string().trim().required('Country is required'),
});

const BillingForm = () => {
  const classes = BillingFormStyles();

  return (
    <>
      {/*       <Formik
        initialValues={{ ...billing }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          handleBillingSave(values);
          handleStepChange(1);
        }}
      >
        {({ values, errors, touched, enableReinitialize }) => (
          <Form> */}
      <Grid item xs={12}>
        <Typography variant="h6">Billing Information</Typography>

        <Grid item xs={12} sm={4}>
          <Field name="billingName">
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
          <Field name="billingSurname">
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
          <Field name="billingEmail">
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
          <Field name="billingAddress">
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
          <Field name="billingZip">
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
          <Field name="billingCity">
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
          <Field name="billingCountry">
            {({
              field,
              form: { touched, errors, setFieldValue, setFieldTouched },
              meta,
            }) => (
              <AutocompleteInput
                {...field}
                options={countries}
                handleChange={(e, value) =>
                  setFieldValue('country', value || '')
                }
                handleBlur={() => setFieldTouched('country', true)}
                getOptionLabel={(option) => option.name}
                helperText={meta.touched && meta.error}
                error={meta.touched && Boolean(meta.error)}
                label="Country"
              />
            )}
          </Field>
        </Grid>
      </Grid>
      {/*       <Grid container item justify="flex-end">
        <Button className={classes.button} onClick={() => handleStepChange(-1)}>
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
      </Grid> */}
      {/*           </Form>
        )}
      </Formik> */}
    </>
  );
};

export default BillingForm;
