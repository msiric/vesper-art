import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const EmailForm = ({ getValues, errors, loading }) => {
  return (
    <Box>
      <TextInput
        value={getValues("userEmail")}
        name="userEmail"
        type="text"
        label="Email"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default EmailForm;
