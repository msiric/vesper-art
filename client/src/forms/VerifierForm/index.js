import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput";

const VerifierForm = ({ errors, loading }) => {
  return (
    <Box>
      <TextInput
        name="licenseFingerprint"
        type="text"
        label="Enter license fingerprint"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default VerifierForm;
