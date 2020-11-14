import { Box } from "@material-ui/core";
import React from "react";
import { countries } from "../../../../common/constants.js";
import AutocompleteInput from "../../controls/AutocompleteInput/index.js";
import ImageInput from "../../controls/ImageInput/index.js";
import TextInput from "../../controls/TextInput/index.js";

const EditUserForm = ({ preview, errors, setValue, trigger, loading }) => {
  const classes = {};

  return (
    <Box>
      <ImageInput
        name="userMedia"
        title="Avatar"
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        preview={preview}
        shape="square"
        height={400}
        width="100%"
        noEmpty={false}
        loading={loading}
      />
      <TextInput
        name="userDescription"
        type="text"
        label="About"
        errors={errors}
      />
      {/* $TODO Fix autocomplete input to work properly */}
      <AutocompleteInput
        name="userCountry"
        label="Country"
        errors={errors}
        options={countries}
      />
    </Box>
  );
};

export default EditUserForm;
