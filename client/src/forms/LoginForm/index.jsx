import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index";

const LoginForm = ({ getValues, errors, loading }) => {
  return (
    <Box>
      <TextInput
        value={getValues("userUsername")}
        name="userUsername"
        type="text"
        label="Username"
        errors={errors}
        loading={loading}
      />
      <TextInput
        value={getValues("userPassword")}
        name="userPassword"
        type="password"
        label="Password"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default LoginForm;
