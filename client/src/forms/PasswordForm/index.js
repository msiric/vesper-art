import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index.js";

const EditPasswordForm = ({ errors }) => {
  return (
    <Box>
      <TextInput
        name="userCurrent"
        type="password"
        label="Enter current password"
        errors={errors}
      />
      <TextInput
        name="userPassword"
        type="password"
        label="Enter new password"
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

export default EditPasswordForm;
