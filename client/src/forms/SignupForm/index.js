import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index.js";

const SignupForm = ({ errors }) => {
  return (
    <Box>
      <TextInput
        name="userUsername"
        type="text"
        label="Username"
        errors={errors}
      />
      <TextInput name="userEmail" type="text" label="Email" errors={errors} />
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
    </Box>
  );
};

export default SignupForm;
