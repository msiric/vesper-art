import React from 'react';
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
import { ax } from '../../shared/Interceptor/Interceptor.js';
import ForgotPasswordStyles from './ForgotPassword.style.js';
import { postRecover } from '../../services/auth.js';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
});

const ForgotPassword = () => {
  const history = useHistory();

  const classes = ForgotPasswordStyles();

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
      email: '',
    },
    validationSchema,
    async onSubmit(values) {
      try {
        await postRecover({ data: values });
        history.push({
          pathname: '/login',
          state: { message: 'Link sent to your email' },
        });
      } catch (err) {
        history.push({
          pathname: '/',
          state: { message: 'An error occurred' },
        });
      }
    },
  });
  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Card className={classes.card}>
          <Typography variant="h6" align="center">
            Forgot password
          </Typography>
          <CardContent>
            <TextField
              name="email"
              label="Enter your email"
              type="text"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.email ? errors.email : ''}
              error={touched.email && Boolean(errors.email)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <Button component={Link} to="/login" color="primary">
              Log in
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Send link
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

export default ForgotPassword;
