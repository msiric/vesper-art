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
import { ax } from '../App/App';
import SignupStyles from './Signup.style';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match'),
});

const Signup = () => {
  const [state, dispatch] = useContext(Context);
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
      confirmPassword: '',
    },
    validationSchema,
    async onSubmit(values) {
      const { data } = await ax.post('/api/auth/signup', values);
      dispatch({
        type: 'setToken',
        ...state,
        user: {
          ...state.user,
          token: data.accessToken,
        },
      });
    },
  });
  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" align="center">
          Sign up
        </Typography>
        <Card className={classes.card}>
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
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.confirmPassword ? errors.confirmPassword : ''}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
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

export default Signup;
