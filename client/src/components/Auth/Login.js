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
import LoginStyles from './Login.style';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username or email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
});

const Login = () => {
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  const classes = LoginStyles();

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
      password: '',
    },
    validationSchema,
    async onSubmit(values) {
      const { data } = await ax.post('/api/auth/login', values);
      window.accessToken = data.accessToken;
      history.push('/');
    },
  });
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

export default Login;
