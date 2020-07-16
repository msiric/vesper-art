import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { TextField, Button, Link, Grid } from '@material-ui/core';
import { Context } from '../../context/Store.js';
import { loginValidation } from '../../validation/login.js';
import { postLogin } from '../../services/auth.js';
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

const LoginForm = () => {
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
      userUsername: '',
      userPassword: '',
    },
    validationSchema: loginValidation,
    async onSubmit(values) {
      const { data } = await postLogin({ data: values });

      if (data.user) {
        dispatch({
          type: 'setUser',
          authenticated: true,
          token: data.accessToken,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          photo: data.user.photo,
          stripeId: data.user.stripeId,
          country: data.user.country,
          messages: { items: [], count: data.user.messages },
          notifications: {
            ...store.user.notifications,
            items: [],
            count: data.user.notifications,
          },
          saved: data.user.saved.reduce(function (object, item) {
            object[item] = true;
            return object;
          }, {}),
          cart: {
            items: data.user.cart.reduce(function (object, item) {
              object[item] = true;
              return object;
            }, {}),
            count: Object.keys(data.user.cart).length,
          },
        });
      }

      history.push('/');
    },
  });
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        name="userUsername"
        label="Username or email"
        type="text"
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={isSubmitting}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/forgot_password" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/signup" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;
