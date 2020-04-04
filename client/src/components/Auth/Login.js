import React, { useContext } from 'react';
import { Context } from '../Store/Store';
import { withFormik } from 'formik';
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
import instance from '../../axios.config';
import LoginStyles from './Login.style';

const Form = (props) => {
  const [state, dispatch] = useContext(Context);

  const classes = LoginStyles();
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" align="center">
          Log in
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <TextField
              name="username"
              label="Email or username"
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
            <Button component={Link} to="/signup" color="primary">
              Sign up
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Log in
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

const Login = withFormik({
  mapPropsToValues: ({ username, password }) => {
    return {
      username: username || '',
      password: password || '',
    };
  },

  validationSchema: Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .min(8, 'Password must contain at least 8 characters')
      .required('Enter your password'),
  }),

  handleSubmit: async (values, { setSubmitting }) => {
    await instance.post('/api/auth/login', values);
  },
})(Form);

export default Login;
