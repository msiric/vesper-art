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
import { ax } from '../../shared/Interceptor/Interceptor';
import ResetPasswordStyles from './ResetPassword.style';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
  confirm: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ResetPassword = ({ match }) => {
  const history = useHistory();
  const classes = ResetPasswordStyles();

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
      password: '',
      confirm: '',
    },
    validationSchema,
    async onSubmit(values) {
      try {
        await ax.post(`/api/auth/reset_password/${match.params.id}`, values);
        history.push({
          pathname: '/login',
          state: { message: 'Password successfully changed' },
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
            Reset password
          </Typography>
          <CardContent>
            <TextField
              name="password"
              label="Enter a new password"
              type="text"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.password ? errors.password : ''}
              error={touched.password && Boolean(errors.password)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              name="confirm"
              label="Confirm your password"
              type="text"
              value={values.confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.confirm ? errors.confirm : ''}
              error={touched.confirm && Boolean(errors.confirm)}
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
              Reset password
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

export default ResetPassword;
