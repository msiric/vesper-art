import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index.js";

const LoginForm = ({ errors }) => {
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
    </Box>
  );
};

export default LoginForm;
