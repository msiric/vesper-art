import React, { useContext } from 'react';
import { Context } from '../Store/Store';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import UploadInput from '../../shared/UploadInput/UploadInput';
import SelectInput from '../../shared/SelectInput/SelectInput';
import PriceInput from '../../shared/PriceInput/PriceInput';
import ax from '../../axios.config';
import deleteEmptyValues from '../../utils/deleteEmptyValues';
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

const artworkMediaConfig = {
  size: 1000 * 1024,
  format: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
};

const validationSchema = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .test(
      'fileSize',
      `File needs to be less than ${artworkMediaConfig.size}MB`,
      (value) => value[0] && value[0].size <= artworkMediaConfig.size
    )
    .test(
      'fileType',
      `File needs to be in one of the following formats: ${artworkMediaConfig.format}`,
      (value) => value[0] && artworkMediaConfig.format.includes(value[0].type)
    )
    .required('Artwork needs to have a file'),
  artworkTitle: Yup.string().trim().required('Artwork title is required'),
  artworkAvailability: Yup.string()
    .matches(/(available|unavailable)/)
    .required('Artwork availability is required'),
  artworkType: Yup.string()
    .notRequired()
    .when('artworkAvailability', {
      is: 'available',
      then: Yup.string()
        .matches(/(commercial|free)/)
        .required('Artwork type is required'),
    }),
  artworkLicense: Yup.string()
    .notRequired()
    .when('artworkAvailability', {
      is: 'available',
      then: Yup.string()
        .matches(/(commercial|personal)/)
        .required('Artwork license is required'),
    }),
  artworkPrice: Yup.number()
    .notRequired()
    .when(['artworkAvailability', 'artworkType'], {
      is: (artworkAvailability, artworkType) =>
        artworkAvailability === 'available' && artworkType === 'commercial',
      then: Yup.number()
        .positive('Artwork price cannot be negative')
        .integer()
        .min(10)
        .max(100000)
        .required('Artwork price is required'),
    }),
  artworkUse: Yup.string()
    .notRequired()
    .when(['artworkAvailability', 'artworkLicense'], {
      is: (artworkAvailability, artworkLicense) =>
        artworkAvailability === 'available' && artworkLicense === 'commercial',
      then: Yup.string()
        .matches(/(separate|included)/)
        .required('Commercial use is required'),
    }),
  artworkCommercial: Yup.number()
    .notRequired()
    .when(['artworkAvailability', 'artworkLicense', 'artworkUse'], {
      is: (artworkAvailability, artworkLicense, artworkUse) =>
        artworkAvailability === 'available' &&
        artworkLicense === 'commercial' &&
        artworkUse === 'separate',
      then: Yup.number()
        .positive('Commercial license cannot be negative')
        .integer()
        .min(5)
        .max(100000)
        .required('Commercial license is required'),
    }),
  artworkCategory: '',
  artworkDescription: Yup.string()
    .trim()
    .required('Artwork description is required'),
});

const AddArtwork = () => {
  const [store, dispatch] = useContext(Context);
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
      artworkUse: '',
      artworkCommercial: '',
      artworkCategory: '',
      artworkDescription: '',
    },
    validationSchema,
    async onSubmit(values) {
      const formData = new FormData();
      formData.append('artworkMedia', values.artworkMedia[0]);
      try {
        const {
          data: { artworkCover, artworkMedia },
        } = await ax.post('/api/artwork_media_upload', formData);
        values.artworkCover = artworkCover;
        values.artworkMedia = artworkMedia;
        const data = deleteEmptyValues(values);
        await ax.post('/api/add_artwork', data);
        history.push({
          pathname: '/',
          state: { message: 'Artwork published' },
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Container fixed className={classes.fixed}>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="h6" align="center">
            Add artwork
          </Typography>
          <Card className={classes.card}>
            <CardContent>
              <UploadInput name="artworkMedia" setFieldValue={setFieldValue} />
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
              {values.artworkAvailability === 'available' && (
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
                values.artworkLicense === 'commercial' && (
                  <SelectInput
                    name="artworkUse"
                    label="Commercial use"
                    value={values.artworkUse}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    helperText={touched.artworkUse ? errors.artworkUse : ''}
                    error={touched.artworkUse && Boolean(errors.artworkUse)}
                    options={[
                      { value: '' },
                      {
                        value: 'separate',
                        text: 'Charge commercial license separately',
                      },
                      {
                        value: 'included',
                        text:
                          values.artworkAvailability === 'available' &&
                          values.artworkType === 'commercial'
                            ? 'Include commercial license in the price'
                            : 'Offer commercial license free of charge',
                      },
                    ]}
                  />
                )}
              {values.artworkAvailability === 'available' &&
                values.artworkLicense === 'commercial' &&
                values.artworkUse === 'separate' && (
                  <PriceInput
                    name="artworkCommercial"
                    label="Commercial license"
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
                  touched.artworkDescription &&
                  Boolean(errors.artworkDescription)
                }
                margin="dense"
                variant="outlined"
                fullWidth
                multiline
              />
            </CardContent>
            <CardActions className={classes.actions}>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Publish artwork
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    </Container>
  );
};

export default AddArtwork;
