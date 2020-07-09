import React, { useContext } from "react";
import { Context } from "../Store/Store.js";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from "@material-ui/core";
import LoginStyles from "./Login.style.js";
import { postLogin } from "../../services/auth.js";
import { loginValidation } from "../../validation/login.js";

const LoginForm = () => {
  const [store, dispatch] = useContext(Context);

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
      username: "",
      password: "",
    },
    validationSchema: loginValidation,
    async onSubmit(values) {
      const { data } = await postLogin({ data: values });

      if (data.user) {
        dispatch({
          type: "setUser",
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

      history.push("/");
    },
  });
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Card className={classes.card}>
        <Typography variant="h6" align="center">
          Log in
        </Typography>
        <CardContent>
          <TextField
            name="username"
            label="Username or email"
            type="text"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.username ? errors.username : ""}
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
            helperText={touched.password ? errors.password : ""}
            error={touched.password && Boolean(errors.password)}
            margin="dense"
            variant="outlined"
            fullWidth
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button component={Link} to="/forgot_password" color="primary">
            Forgot password
          </Button>
          <Button component={Link} to="/signup" color="primary">
            Sign up
          </Button>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            Log in
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default LoginForm;