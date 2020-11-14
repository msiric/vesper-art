import { Box } from "@material-ui/core";
import React from "react";
import { countries } from "../../../../common/constants.js";
import AutocompleteInput from "../../controls/AutocompleteInput";

const OnboardingForm = ({ getValues, setValue, errors }) => {
  return (
    <Box>
      <AutocompleteInput
        value={getValues("userOrigin")}
        setValue={setValue}
        name="userOrigin"
        label="Country"
        errors={errors}
        options={countries.filter((country) => country.supported === true)}
      />
    </Box>
  );
};

export default OnboardingForm;
