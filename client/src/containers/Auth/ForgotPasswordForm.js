import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Link, Grid } from '@material-ui/core';
import { postRecover } from '../../services/auth.js';
import { emailValidation } from '../../validation/email.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgotPasswordForm = () => {
  const history = useHistory();

  const classes = useStyles();

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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={isSubmitting}
      >
        Send recovery link
      </Button>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/login" variant="body2">
            Back to login
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/signup" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default ForgotPasswordForm;
