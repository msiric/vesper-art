import React from "react";
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
import ResetPasswordStyles from "./ResetPassword.style.js";
import { postReset } from "../../services/auth.js";
import { resetValidation } from "../../validation/reset.js";

const ResetPasswordForm = ({ match }) => {
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
      password: "",
      confirm: "",
    },
    validationSchema: resetValidation,
    async onSubmit(values) {
      try {
        await postReset({ userId: match.params.id, data: values });
        history.push({
          pathname: "/login",
          state: { message: "Password successfully changed" },
        });
      } catch (err) {
        history.push({
          pathname: "/",
          state: { message: "An error occurred" },
        });
      }
    },
  });

  return (
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
            helperText={touched.password ? errors.password : ""}
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
            helperText={touched.confirm ? errors.confirm : ""}
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
  );
};

export default ResetPasswordForm;
