import { Box } from "@material-ui/core";
import React from "react";
import SwitchInput from "../../controls/SwitchInput/index.js";

const EditPreferencesForm = ({ setValue, getValues, errors }) => {
  return (
    <Box>
      <SwitchInput
        value={getValues("userSaves")}
        setValue={setValue}
        name="userSaves"
        type="text"
        label="Display saved artwork"
        errors={errors}
      />
    </Box>
  );
};

export default EditPreferencesForm;
