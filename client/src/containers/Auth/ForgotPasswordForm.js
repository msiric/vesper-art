import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import { postRecover } from '../../services/auth.js';
import { emailValidation } from '../../validation/email.js';

const ForgotPasswordForm = () => {
  const history = useHistory();

  const classes = {};

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
      userEmail: '',
    },
    validationSchema: emailValidation,
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
    <form className={classes.form} onSubmit={handleSubmit}>
      <Card className={classes.card}>
        <Typography variant="h6" align="center">
          Forgot password
        </Typography>
        <CardContent>
          <TextField
            name="userEmail"
            label="Enter your email"
            type="text"
            value={values.userEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.userEmail ? errors.userEmail : ''}
            error={touched.userEmail && Boolean(errors.userEmail)}
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
  );
};

export default ForgotPasswordForm;
