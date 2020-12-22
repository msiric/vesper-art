import { Box } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import TextInput from "../../controls/TextInput";

const ResetPasswordForm = ({ errors }) => {
  const history = useHistory();
  const classes = {};

  return (
    <Box>
      <TextInput
        name="userPassword"
        type="password"
        label="Enter a new password"
        errors={errors}
      />
      <TextInput
        name="userConfirm"
        type="password"
        label="Confirm your password"
        errors={errors}
      />
    </Box>
  );
};

export default ResetPasswordForm;
