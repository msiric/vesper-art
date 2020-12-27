import { Box } from "@material-ui/core";
import React from "react";
import SwitchInput from "../../controls/SwitchInput/index.js";

const EditPreferencesForm = ({ setValue, getValues, errors }) => {
  return (
    <Box>
      <SwitchInput
        value={getValues("userFavorites")}
        setValue={setValue}
        name="userFavorites"
        type="text"
        label="Display favorited artwork"
        errors={errors}
      />
    </Box>
  );
};

export default EditPreferencesForm;
