import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { TextField, Button, Link, Grid } from '@material-ui/core';
import { Context } from '../../context/Store.js';
import { signupValidation } from '../../validation/signup.js';
import { postSignup } from '../../services/auth.js';
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

const SignupForm = () => {
  const [store, dispatch] = useContext(Context);

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
      username: '',
      email: '',
      password: '',
      confirm: '',
    },
    validationSchema: signupValidation,
    async onSubmit(values) {
      try {
        await postSignup({ data: values });
        /*         enqueueSnackbar('Verification email sent', {
          variant: 'success',
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }); */
      } catch (err) {
        history.push({
          pathname: '/login',
          state: { message: 'An error occurred' },
        });
      }
    },
  });
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        name="userUsername"
        label="Username"
        value={values.userUsername}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={touched.userUsername ? errors.userUsername : ''}
        error={touched.userUsername && Boolean(errors.userUsername)}
        margin="dense"
        variant="outlined"
        fullWidth
      />
      <TextField
        name="userEmail"
        label="Email"
        type="email"
        value={values.userEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={touched.userEmail ? errors.userEmail : ''}
        error={touched.userEmail && Boolean(errors.userEmail)}
        margin="dense"
        variant="outlined"
        fullWidth
      />
      <TextField
        name="userPassword"
        label="Password"
        type="password"
        value={values.userPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={touched.userPassword ? errors.userPassword : ''}
        error={touched.userPassword && Boolean(errors.userPassword)}
        margin="dense"
        variant="outlined"
        fullWidth
      />
      <TextField
        name="userConfirm"
        label="Confirm Password"
        type="password"
        value={values.userConfirm}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={touched.userConfirm ? errors.userConfirm : ''}
        error={touched.userConfirm && Boolean(errors.userConfirm)}
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
        Sign up
      </Button>
      <Grid container>
        <Grid item>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Log in
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignupForm;
