import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const EditEmailForm = ({ errors, loading }) => {
  return (
    <Box>
      <TextInput
        name="userEmail"
        type="text"
        label="Email"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default EditEmailForm;
