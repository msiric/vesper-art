import { Box } from "@material-ui/core";
import React from "react";
import { countries } from "../../../../common/constants";
import AutocompleteInput from "../../controls/AutocompleteInput/index";
import TextInput from "../../controls/TextInput/index";

const BillingForm = ({ errors, setValue, getValues, loading }) => {
  return (
    <Box>
      <TextInput
        name="billingName"
        type="text"
        label="First name"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="billingSurname"
        type="text"
        label="Last name"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="billingEmail"
        type="text"
        label="Email address"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="billingAddress"
        type="text"
        label="Street address"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="billingZip"
        type="text"
        label="Zip code"
        errors={errors}
        loading={loading}
      />
      <TextInput
        name="billingCity"
        type="text"
        label="City"
        errors={errors}
        loading={loading}
      />
      <AutocompleteInput
        value={getValues("billingCountry")}
        setValue={setValue}
        name="billingCountry"
        label="Country"
        errors={errors}
        options={countries}
        loading={loading}
      />
    </Box>
  );
};

export default BillingForm;
