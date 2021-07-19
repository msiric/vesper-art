import { Box } from "@material-ui/core";
import React from "react";
import { countries } from "../../../../common/constants";
import AutocompleteInput from "../../controls/AutocompleteInput/index";
import ImageInput from "../../controls/ImageInput/index";
import TextInput from "../../controls/TextInput/index";
import TextField from "../../domain/TextField";

const EditUserForm = ({
  preview,
  errors,
  getValues,
  setValue,
  trigger,
  editable,
  userName,
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
        <TextField
          type="text"
          label="Full name"
          defaultValue={userName}
          variant="outlined"
          margin="dense"
          disabled={true}
          inputProps={{ readOnly: true }}
          fullWidth
          loading={loading}
        />
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
