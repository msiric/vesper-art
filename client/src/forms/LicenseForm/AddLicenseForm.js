/* import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import SelectInput from '../../shared/SelectInput/SelectInput.js';
import { useHistory } from 'react-router-dom';
import { licenseValidation } from '../../validation/license.js';
import AddArtworkStyles from '../../components/Artwork/AddArtwork.style.js';

const AddLicenseForm = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const history = useHistory();
  const classes = AddArtworkStyles();

  return (
    <Formik
      initialValues={{
        licenseType: state.license,
      }}
      enableReinitialize={true}
      validationSchema={licenseValidation}
      onSubmit={async (values, { resetForm }) => {
        try {
          history.push({
            pathname: `/checkout/${match.params.id}`,
            state: { payload: values },
          });
        } catch (err) {
          console.log(err);
        }
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <div className={classes.licenseContainer}>
            <Card className={classes.card}>
              <Typography variant="h6" align="center">
                {`Add ${state.license} license`}
              </Typography>
              <CardContent>
                <Field name="licenseType">
                  {({ field, form: { touched, errors }, meta }) => (
                    <SelectInput
                      {...field}
                      label="License type"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      options={[
                        {
                          value: state.license,
                          text: state.license,
                        },
                      ]}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              </CardContent>
              <CardActions className={classes.actions}>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Continue
                </Button>
                <Button type="button" color="error" onClick={handleModalClose}>
                  Close
                </Button>
              </CardActions>
            </Card>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddLicenseForm;
 */
