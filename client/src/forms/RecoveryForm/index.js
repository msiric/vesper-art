import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index.js";

const RecoveryForm = ({ errors }) => {
  return (
    <Box>
      <TextInput
        name="userUsername"
        type="text"
        label="Username"
        errors={errors}
      />
      <TextInput
        name="userPassword"
        type="password"
        label="Password"
        errors={errors}
      />
      <TextInput
        name="userEmail"
        type="text"
        label="New email"
        errors={errors}
      />
    </Box>
  );
};

export default RecoveryForm;
