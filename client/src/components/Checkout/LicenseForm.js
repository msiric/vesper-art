import React from 'react';
import {
  TextField,
  Grid,
  Typography,
  Button,
  CardActions,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Formik, Form, Field, FieldArray } from 'formik';
import SelectField from '../../shared/SelectInput/SelectInput';
import * as Yup from 'yup';
import LicenseFormStyles from './LicenseForm.style';

const validationSchema = Yup.object().shape({
  licenses: Yup.array().of(
    Yup.object().shape({
      licenseType: Yup.string()
        .matches(/(personal|commercial)/)
        .required('License type is required'),
      licenseeName: Yup.string()
        .trim()
        .required('License holder full name is required'),
      licenseeCompany: Yup.string()
        .notRequired()
        .when('commercial', {
          is: 'commercial',
          then: Yup.string()
            .trim()
            .required('License holder company is required'),
        }),
    })
  ),
});

const LicenseForm = ({ artwork, licenses, handleLicenseSave }) => {
  const classes = LicenseFormStyles();

  return (
    <Grid item xs={12}>
      <Typography variant="h6">License Information</Typography>

      <Formik
        initialValues={{
          licenses: licenses.length
            ? licenses
            : [{ licenseType: '', licenseeName: '', licenseeCompany: '' }],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          handleLicenseSave(values.licenses);
        }}
      >
        {({ values, errors, touched, enableReinitialize }) => (
          <Form>
            <FieldArray
              name="licenses"
              render={(arrayHelpers) => (
                <div>
                  {values.licenses && values.licenses.length > 0
                    ? values.licenses.map((value, index) => (
                        <div key={index}>
                          <Field
                            name={`licenses.${index}.licenseType`}
                            as="select"
                          >
                            {({ field, form: { touched, errors }, meta }) =>
                              artwork.current &&
                              artwork.current.license === 'commercial' ? (
                                <SelectField
                                  {...field}
                                  handleChange={field.onChange}
                                  handleBlur={field.onBlur}
                                  label="License type"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  options={[
                                    {
                                      value: 'personal',
                                      text: 'Personal',
                                    },
                                    {
                                      value: 'commercial',
                                      text: 'Commercial',
                                    },
                                  ]}
                                />
                              ) : (
                                <SelectField
                                  {...field}
                                  handleChange={field.onChange}
                                  handleBlur={field.onBlur}
                                  label="License type"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  options={[
                                    {
                                      value: 'personal',
                                      text: 'Personal',
                                    },
                                  ]}
                                  disabled
                                />
                              )
                            }
                          </Field>
                          <Field name={`licenses.${index}.licenseeName`}>
                            {({ field, form: { touched, errors }, meta }) => (
                              <TextField
                                {...field}
                                label="License holder full name"
                                type="text"
                                helperText={meta.touched && meta.error}
                                error={meta.touched && Boolean(meta.error)}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          </Field>
                          <Field name={`licenses.${index}.licenseeCompany`}>
                            {({ field, form: { touched, errors }, meta }) => (
                              <TextField
                                {...field}
                                label="License holder company"
                                type="text"
                                helperText={meta.touched && meta.error}
                                error={meta.touched && Boolean(meta.error)}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          </Field>
                          {values.licenses.length > 1 ? (
                            <Button
                              type="button"
                              color="error"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              Delete license
                            </Button>
                          ) : null}
                        </div>
                      ))
                    : null}
                  <div>
                    <Button
                      type="button"
                      color="primary"
                      onClick={() =>
                        arrayHelpers.push(
                          artwork.current &&
                            artwork.current.license === 'commercial'
                            ? {
                                licenseType: '',
                                licenseeName: '',
                                licenseeCompany: '',
                              }
                            : {
                                licenseType: 'personal',
                                licenseeName: '',
                                licenseeCompany: '',
                              }
                        )
                      }
                    >
                      Add license
                    </Button>
                  </div>
                </div>
              )}
            />
            <CardActions className={classes.actions}>
              <Button type="submit" color="primary">
                Apply
              </Button>
            </CardActions>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default LicenseForm;
