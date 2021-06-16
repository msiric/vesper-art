import { Box } from "@material-ui/core";
import React from "react";
import { countries } from "../../../../common/constants.js";
import AutocompleteInput from "../../controls/AutocompleteInput/index.js";
import ImageInput from "../../controls/ImageInput/index.js";
import TextInput from "../../controls/TextInput/index.js";

const EditUserForm = ({
  preview,
  errors,
  getValues,
  setValue,
  trigger,
  editable,
  loading,
}) => {
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
        shape="circle"
        height={150}
        width={150}
        noEmpty={false}
        editable={editable}
        loading={loading}
      />
      <Box>
        <TextInput
          name="userDescription"
          type="text"
          label="About"
          multiline
          errors={errors}
          loading={loading}
        />
        <AutocompleteInput
          value={getValues("userCountry")}
          setValue={setValue}
          name="userCountry"
          label="Country"
          errors={errors}
          options={countries}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default EditUserForm;
