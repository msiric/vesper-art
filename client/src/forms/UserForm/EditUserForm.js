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
import { countries } from "../../../../common/constants.js";
import ImageInput from "../../components/ImageInput/index.js";
import { patchUser, postMedia } from "../../services/user.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { profileValidation } from "../../validation/profile.js";

const EditUserForm = ({ match, user, handleModalClose }) => {
  const classes = {};

  return (
    <Formik
      initialValues={{
        userMedia: user.photo,
        userDescription: user.description,
        userCountry: user.country,
      }}
      enableReinitialize={true}
      validationSchema={profileValidation}
      onSubmit={async (values, { resetForm }) => {
        try {
          if (values.userMedia.length) {
            const formData = new FormData();
            formData.append("userMedia", values.userMedia[0]);
            const {
              data: { userMedia, userDimensions },
            } = await postMedia.request({ data: formData });
            values.userMedia = userMedia;
            values.userDimensions = userDimensions;
          }
          await patchUser.request({ userId: user._id, data: values });
        } catch (err) {
          console.log(err);
        }
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Card className={classes.editUserContainer}>
            <Typography variant="h6" align="center">
              Edit info
            </Typography>
            <CardContent>
              <Field name="userMedia">
                {({
                  field,
                  form: { setFieldValue, setFieldTouched },
                  meta,
                }) => (
                  <ImageInput
                    meta={meta}
                    field={field}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    preview={false}
                    shape="rounded"
                    noEmpty={true}
                  />
                )}
              </Field>
              <Field name="userDescription">
                {({ field, form: { touched, errors }, meta }) => (
                  <TextField
                    {...field}
                    type="text"
                    label="Description"
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
              <Field name="userCountry">
                {({ field, form: { touched, errors }, meta }) => (
                  <SelectInput
                    {...field}
                    label="Country"
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    options={countries}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Update
              </Button>
              <Button type="button" color="error" onClick={handleModalClose}>
                Close
              </Button>
            </CardActions>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default EditUserForm;
