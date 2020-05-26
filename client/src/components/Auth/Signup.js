import React, { useContext } from 'react';
import { Context } from '../Store/Store';
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
import { withSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { ax } from '../../shared/Interceptor/Interceptor';
import SignupStyles from './Signup.style';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
  confirm: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const Signup = ({ enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);

  const history = useHistory();

  const classes = SignupStyles();

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
    validationSchema,
    async onSubmit(values) {
      try {
        await ax.post('/api/auth/signup', values);
        enqueueSnackbar('Verification email sent', {
          variant: 'success',
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      } catch (err) {
        history.push({
          pathname: '/login',
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
            Sign up
          </Typography>
          <CardContent>
            <TextField
              name="username"
              label="Username"
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
              name="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.email ? errors.email : ''}
              error={touched.email && Boolean(errors.email)}
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
            <TextField
              name="confirm"
              label="Confirm Password"
              type="password"
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
              Sign up
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

export default withSnackbar(Signup);
