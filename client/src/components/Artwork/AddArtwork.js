import React, { useContext, useCallback } from 'react';
import { Context } from '../Store/Store';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import SelectInput from './SelectInput';
import PriceInput from './PriceInput';
import ax from '../../axios.config';
import AddArtworkStyles from './AddArtwork.style';

// form
// artworkMedia file req
// artworkTitle text req
// artworkAvailability select (available/unavailable) req
// artworkType select (commercial/free) opt -> dep on availability
// artworkPrice number/text? opt -> dep on availability/type
// artworkLicense select (commercial/personal) opt -> dep on availability/type
// artworkCommercial number/text? opt -> dep on availability/type/license
// artworkCategory select (???) ???
// artworkDescription text req

const artworkMedia = {
  size: 100 * 1024,
  format: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
};

const validationSchema = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .test(
      'fileSize',
      `File needs to be less than ${artworkMedia.size}MB`,
      (value) => value.size <= artworkMedia.size
    )
    .test(
      'fileType',
      `File needs to be in one of the following formats: ${artworkMedia.format}`,
      (value) => artworkMedia.format.includes(value.type)
    )
    .required('Artwork needs to have a file'),
  artworkTitle: Yup.string().required('Artwork title is required'),
  artworkAvailability: Yup.string()
    .matches(/(available|unavailable)/)
    .required(),
  artworkType: Yup.string().matches(/(commercial|showcase)/),
  artworkPrice: Yup.number()
    .positive('Artwork price cannot be negative')
    .integer()
    .min(10)
    .max(100000),
  artworkLicense: Yup.string().matches(/(commercial|personal)/),
  artworkCommercial: Yup.number()
    .positive('Artwork commercial license price cannot be negative')
    .integer()
    .min(1)
    .max(10000),
  artworkCategory: '',
  artworkDescription: Yup.string().required('Artwork description is required'),
});

const AddArtwork = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  const classes = AddArtworkStyles();

  const {
    setFieldValue,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    initialValues: {
      artworkMedia: '',
      artworkTitle: '',
      artworkType: '',
      artworkAvailability: '',
      artworkPrice: '',
      artworkLicense: '',
      artworkCommercial: '',
      artworkCategory: '',
      artworkDescription: '',
    },
    validationSchema,
    async onSubmit(values) {
      const { data } = await ax.post('/api/add_artwork', values);
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    setFieldValue('files', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" align="center">
          Add artwork
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
            <TextField
              name="artworkTitle"
              label="Title"
              type="text"
              value={values.artworkTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.artworkTitle ? errors.artworkTitle : ''}
              error={touched.artworkTitle && Boolean(errors.artworkTitle)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <SelectInput
              name="artworkAvailability"
              label="Availability"
              value={values.artworkAvailability}
              handleChange={handleChange}
              handleBlur={handleBlur}
              helperText={
                touched.artworkAvailability ? errors.artworkAvailability : ''
              }
              error={
                touched.artworkAvailability &&
                Boolean(errors.artworkAvailability)
              }
              options={[
                { value: '' },
                { value: 'available', text: 'Available for download' },
                { value: 'unavailable', text: 'Only for preview' },
              ]}
            />
            {values.artworkAvailability === 'available' && (
              <SelectInput
                name="artworkType"
                label="Type"
                value={values.artworkType}
                handleChange={handleChange}
                handleBlur={handleBlur}
                helperText={touched.artworkType ? errors.artworkType : ''}
                error={touched.artworkType && Boolean(errors.artworkType)}
                options={[
                  { value: '' },
                  { value: 'commercial', text: 'Commercial' },
                  { value: 'free', text: 'Free' },
                ]}
              />
            )}
            {values.artworkAvailability === 'available' &&
              values.artworkType === 'commercial' && (
                <PriceInput
                  name="artworkPrice"
                  label="Price"
                  value={values.artworkPrice}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  helperText={touched.artworkPrice ? errors.artworkPrice : ''}
                  error={touched.artworkPrice && Boolean(errors.artworkPrice)}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            {values.artworkAvailability === 'available' &&
              values.artworkType === 'commercial' && (
                <SelectInput
                  name="artworkLicense"
                  label="License"
                  value={values.artworkLicense}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  helperText={
                    touched.artworkLicense ? errors.artworkLicense : ''
                  }
                  error={
                    touched.artworkLicense && Boolean(errors.artworkLicense)
                  }
                  options={[
                    { value: '' },
                    { value: 'commercial', text: 'Commercial' },
                    { value: 'personal', text: 'Personal' },
                  ]}
                />
              )}
            {values.artworkAvailability === 'available' &&
              values.artworkType === 'commercial' &&
              values.artworkLicense === 'commercial' && (
                <PriceInput
                  name="artworkCommercial"
                  label="Commercial license???"
                  value={values.artworkCommercial}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  helperText={
                    touched.artworkCommercial ? errors.artworkCommercial : ''
                  }
                  error={
                    touched.artworkCommercial &&
                    Boolean(errors.artworkCommercial)
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            <TextField
              name="artworkDescription"
              label="Description"
              type="text"
              value={values.artworkDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                touched.artworkDescription ? errors.artworkDescription : ''
              }
              error={
                touched.artworkDescription && Boolean(errors.artworkDescription)
              }
              margin="dense"
              variant="outlined"
              fullWidth
              multiline
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Publish
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

export default AddArtwork;
