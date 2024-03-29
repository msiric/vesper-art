import { Box } from "@material-ui/core";
import React from "react";
import SwitchInput from "../../controls/SwitchInput/index";

const PreferencesForm = ({ setValue, getValues, errors, loading }) => {
  return (
    <Box>
      <SwitchInput
        value={getValues("userFavorites")}
        setValue={setValue}
        name="userFavorites"
        type="text"
        label="Display favorited artwork"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default PreferencesForm;
