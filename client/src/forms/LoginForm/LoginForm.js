import { Box } from "@material-ui/core";
import React from "react";
import AsyncButton from "../../components/AsyncButton/index.js";
import TextInput from "../../controls/TextInput/index.js";

const LoginForm = ({ formState, errors }) => {
  return (
    <Box>
      <TextInput
        name="userUsername"
        type="text"
        label="Username or email"
        errors={errors}
      />
      <TextInput
        name="userPassword"
        type="password"
        label="Password"
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
        Sign In
      </AsyncButton>
    </Box>
  );
};

export default LoginForm;
