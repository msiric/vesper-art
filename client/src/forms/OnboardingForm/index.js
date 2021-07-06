import { Box } from "@material-ui/core";
import React from "react";
import { countries } from "../../../../common/constants";
import AutocompleteInput from "../../controls/AutocompleteInput";

const OnboardingForm = ({ getValues, setValue, errors, loading }) => {
  return (
    <Box>
      <AutocompleteInput
        value={getValues("userBusinessAddress")}
        setValue={setValue}
        name="userBusinessAddress"
        label="Country"
        errors={errors}
        options={countries.filter((country) => country.supported === true)}
        loading={loading}
      />
    </Box>
  );
};

export default OnboardingForm;
