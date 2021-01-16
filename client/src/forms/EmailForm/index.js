import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const EditEmailForm = ({ errors }) => {
  return (
    <Box>
      <TextInput name="userEmail" type="text" label="Email" errors={errors} />
    </Box>
  );
};

export default EditEmailForm;
