import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const VerifierForm = ({ errors }) => {
  return (
    <Box>
      <TextInput
        name="licenseFingerprint"
        type="text"
        label="Enter license fingerprint"
        errors={errors}
      />
    </Box>
  );
};

export default VerifierForm;
