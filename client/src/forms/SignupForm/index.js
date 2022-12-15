import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index";

const SignupForm = ({ getValues, errors, loading }) => {
  return (
    <Box>
      <TextInput
        value={getValues("userName")}
        name="userName"
        type="text"
        label="Full name"
        errors={errors}
        loading={loading}
      />
      <TextInput
        value={getValues("userUsername")}
        name="userUsername"
        type="text"
        label="Username"
        errors={errors}
        loading={loading}
      />
      <TextInput
        value={getValues("userEmail")}
        name="userEmail"
        type="text"
        label="Email"
        errors={errors}
      />
      <TextInput
        value={getValues("userPassword")}
        name="userPassword"
        type="password"
        label="Password"
        errors={errors}
        loading={loading}
      />
      <TextInput
        value={getValues("userConfirm")}
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
