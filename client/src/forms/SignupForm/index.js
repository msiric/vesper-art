import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index";

const SignupForm = ({ errors, loading }) => {
  return (
    <Box>
      <TextInput
        name="userName"
        type="text"
        label="Full name"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="userUsername"
        type="text"
        label="Username"
        errors={errors}
        loading={loading}
      />
      <TextInput name="userEmail" type="text" label="Email" errors={errors} />
      <TextInput
        name="userPassword"
        type="password"
        label="Password"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="userConfirm"
        type="password"
        label="Confirm password"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default SignupForm;
