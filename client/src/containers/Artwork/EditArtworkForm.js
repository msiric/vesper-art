import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { CircularProgress, TextField } from '@material-ui/core';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Container,
} from '../../constants/theme.js';
import UploadInput from '../../shared/UploadInput/UploadInput.js';
import SelectInput from '../../shared/SelectInput/SelectInput.js';
import PriceInput from '../../shared/PriceInput/PriceInput.js';
import { ax } from '../../containers/Interceptor/Interceptor.js';
import { deleteEmptyValues } from '../../utils/helpers.js';
import {
  editArtwork,
  deleteArtwork,
  postMedia,
  patchArtwork,
} from '../../services/artwork.js';
import { getUser } from '../../services/stripe.js';
import ImageInput from '../../components/ImageInput/ImageInput.js';
import { artworkValidation } from '../../validation/artwork.js';
import HelpBox from '../../components/HelpBox/HelpBox.js';

const EditArtworkForm = ({
  loading,
  artwork,
  user,
  capabilities,
  stripeId,
  match,
  handleDeleteArtwork,
  patchArtwork,
  isDeleting,
}) => {
  const history = useHistory();
  const classes = {};

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : artwork._id ? (
          <Card p={2}>
            <Formik
              initialValues={{
                artworkMedia: artwork.media || '',
                artworkTitle: artwork.title || '',
                artworkType: artwork.type || '',
                artworkAvailability: artwork.availability || '',
                artworkLicense: artwork.license || '',
                artworkUse: artwork.use || '',
                artworkPersonal: artwork.personal || '',
                artworkCommercial: artwork.commercial || '',
                artworkCategory: artwork.category || '',
                artworkDescription: artwork.description || '',
              }}
              enableReinitialize={true}
              validationSchema={artworkValidation}
              onSubmit={async (values, { resetForm }) => {
                const formData = new FormData();
                formData.append('artworkMedia', values.artworkMedia[0]);
                try {
                  const {
                    data: { artworkCover, artworkMedia },
                  } = await postMedia({ data: formData });
                  values.artworkCover = artworkCover;
                  values.artworkMedia = artworkMedia;
                  const data = deleteEmptyValues(values);
                  await patchArtwork({ artworkId: match.params.id, data });
                  history.push({
                    pathname: '/',
                    state: { message: 'Artwork edited' },
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form className={classes.card}>
                  {!user.stripeId ? (
                    <HelpBox
                      type="alert"
                      label='To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
                    />
                  ) : capabilities.cardPayments !== 'active' ||
                    capabilities.platformPayments !== 'active' ? (
                    <HelpBox
                      type="alert"
                      label="To make your artwork commercially available, complete your Stripe account information"
                    />
                  ) : null}
                  <CardContent>
                    <Field name="artworkMedia">
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
                          preview={artwork.cover}
                          shape="square"
                        />
                      )}
                    </Field>
                    <Field name="artworkTitle">
                      {({ field, form: { touched, errors }, meta }) => (
                        <TextField
                          {...field}
                          type="text"
                          label="Title"
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    </Field>
                    <Field name="artworkAvailability">
                      {({ field, form: { touched, errors }, meta }) => (
                        <SelectInput
                          {...field}
                          label="Availability"
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                          options={[
                            { value: '' },
                            {
                              value: 'available',
                              text: 'Available for download',
                            },
                            {
                              value: 'unavailable',
                              text: 'Only for preview',
                            },
                          ]}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    </Field>
                    {values.artworkAvailability === 'available' && (
                      <Field name="artworkType">
                        {({ field, form: { touched, errors }, meta }) => (
                          <SelectInput
                            {...field}
                            label="Type"
                            helperText={meta.touched && meta.error}
                            error={meta.touched && Boolean(meta.error)}
                            options={[
                              { value: '' },
                              {
                                value: 'commercial',
                                text: 'Commercial',
                                disabled:
                                  user.stripeId &&
                                  capabilities.cardPayments === 'active' &&
                                  capabilities.platformPayments === 'active'
                                    ? false
                                    : true,
                              },
                              { value: 'free', text: 'Free' },
                            ]}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </Field>
                    )}
                    {values.artworkAvailability === 'available' && (
                      <Field name="artworkLicense">
                        {({ field, form: { touched, errors }, meta }) => (
                          <SelectInput
                            {...field}
                            label="License"
                            helperText={meta.touched && meta.error}
                            error={meta.touched && Boolean(meta.error)}
                            options={[
                              { value: '' },
                              { value: 'commercial', text: 'Commercial' },
                              { value: 'personal', text: 'Personal' },
                            ]}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </Field>
                    )}
                    {values.artworkAvailability === 'available' &&
                      values.artworkType === 'commercial' && (
                        <Field name="artworkPersonal">
                          {({ field, form: { touched, errors }, meta }) => (
                            <PriceInput
                              {...field}
                              label="Price"
                              helperText={meta.touched && meta.error}
                              error={meta.touched && Boolean(meta.error)}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        </Field>
                      )}
                    {values.artworkAvailability === 'available' &&
                      values.artworkLicense === 'commercial' && (
                        <Field name="artworkUse">
                          {({ field, form: { touched, errors }, meta }) => (
                            <SelectInput
                              {...field}
                              label="Commercial use"
                              helperText={meta.touched && meta.error}
                              error={meta.touched && Boolean(meta.error)}
                              options={[
                                { value: '' },
                                {
                                  value: 'separate',
                                  text: 'Charge commercial license separately',
                                  disabled:
                                    user.stripeId &&
                                    capabilities.cardPayments === 'active' &&
                                    capabilities.platformPayments === 'active'
                                      ? false
                                      : true,
                                },
                                values.artworkAvailability === 'available' &&
                                values.artworkType === 'commercial'
                                  ? {
                                      value: 'included',
                                      text:
                                        'Include commercial license in the price',
                                    }
                                  : {
                                      value: 'included',
                                      text:
                                        'Offer commercial license free of charge',
                                    },
                              ]}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        </Field>
                      )}
                    {values.artworkAvailability === 'available' &&
                      values.artworkLicense === 'commercial' &&
                      values.artworkUse === 'separate' && (
                        <Field name="artworkCommercial">
                          {({ field, form: { touched, errors }, meta }) => (
                            <PriceInput
                              {...field}
                              label="Commercial license"
                              helperText={meta.touched && meta.error}
                              error={meta.touched && Boolean(meta.error)}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        </Field>
                      )}
                    <Field name="artworkDescription">
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
                  </CardContent>
                  <CardActions className={classes.actions}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting || isDeleting}
                    >
                      Publish artwork
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      onClick={handleDeleteArtwork}
                      disabled={isSubmitting || isDeleting}
                    >
                      Delete artwork
                    </Button>
                  </CardActions>
                </Form>
              )}
            </Formik>
          </Card>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default EditArtworkForm;
