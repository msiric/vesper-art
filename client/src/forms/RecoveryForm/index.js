import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index.js";

const RecoveryForm = ({ errors, loading }) => {
  return (
    <Box>
      <TextInput
        name="userUsername"
        type="text"
        label="Username"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="userPassword"
        type="password"
        label="Password"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="userEmail"
        type="text"
        label="New email"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default RecoveryForm;
