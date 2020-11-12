import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import TextInput from "../../controls/TextInput/index.js";
import { postSignup } from "../../services/auth.js";
import { signupValidation } from "../../validation/signup.js";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

const SignupForm = () => {
  const history = useHistory();
  const classes = useStyles();

  const { handleSubmit, formState, errors, control } = useForm({
    resolver: yupResolver(signupValidation),
  });

  const onSubmit = async (values) => {
    try {
      await postSignup.request({ data: values });
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
        pathname: "/login",
        state: { message: "An error occurred" },
      });
    }
  };

  return (
    <Box>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="userUsername"
            type="text"
            label="Username"
            errors={errors}
          />
          <TextInput
            name="userEmail"
            type="text"
            label="Email"
            errors={errors}
          />
          <TextInput
            name="userPassword"
            type="password"
            label="Password"
            errors={errors}
          />
          <TextInput
            name="userConfirm"
            type="password"
            label="Confirm password"
            errors={errors}
          />
          <AsyncButton
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            padding
            loading={formState.isSubmitting}
          >
            Sign up
          </AsyncButton>
        </form>
      </FormProvider>
      <Grid container>
        <Grid item>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Log in
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupForm;
