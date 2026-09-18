import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index";

const EditPasswordForm = ({ getValues, errors, loading }) => {
  return (
    <Box>
      <TextInput
        value={getValues("userCurrent")}
        name="userCurrent"
        type="password"
        label="Enter current password"
        errors={errors}
        loading={loading}
      />
      <TextInput
        value={getValues("userPassword")}
        name="userPassword"
        type="password"
        label="Enter new password"
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

export default EditPasswordForm;
