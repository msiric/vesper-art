import React, { useContext } from 'react';
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
import ax from '../../axios.config';
import AddArtworkStyles from './AddArtwork.style';

// form
// artworkMedia file req
// artworkTitle text req
// artworkType select (commercial/showcase) req
// artworkAvailability select (available/unavailable) req
// artworkPrice number/text? opt -> dep on type
// artworkLicense select (commercial/personal) opt -> dep on availability
// artworkCommercial number/text? opt -> dep on license
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
    ),
  artworkTitle: Yup.string().required('Artwork title is required'),
  artworkType: Yup.string().matches(/(commercial|showcase)/),
  artworkAvailability: Yup.string().matches(/(available|unavailable)/),
  artworkPrice: Yup.number
    .positive('Artwork price cannot be negative')
    .integer()
    .min(10)
    .max(100000)
    .required('Artwork price is required'),
  artworkLicense: Yup.string().matches(/(commercial|personal)/),
  artworkCommercial: Yup.number
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
  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" align="center">
          Add artwork
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <TextField
              name="username"
              label="Username or email"
              type="text"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.username ? errors.username : ''}
              error={touched.username && Boolean(errors.username)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.password ? errors.password : ''}
              error={touched.password && Boolean(errors.password)}
              margin="dense"
              variant="outlined"
              fullWidth
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
