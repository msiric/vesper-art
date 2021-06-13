import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index.js";

const EditPasswordForm = ({ errors, loading }) => {
  return (
    <Box>
      <TextInput
        name="userCurrent"
        type="password"
        label="Enter current password"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="userPassword"
        type="password"
        label="Enter new password"
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

export default EditPasswordForm;
