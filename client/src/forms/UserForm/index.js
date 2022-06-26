import { Box } from "@material-ui/core";
import React from "react";
import { countries, upload } from "../../../../common/constants";
import { formatBytes } from "../../../../common/helpers";
import UploadPopover from "../../components/UploadPopover";
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
      <UploadPopover
        label="What kind of file to upload?"
        size={formatBytes(upload.user.fileSize)}
        type="avatar"
        dimensions={{
          height: upload.user.fileDimensions.height,
          width: upload.user.fileDimensions.width,
        }}
        aspectRatio={upload.user.fileRatio}
        types={upload.user.mimeTypes}
        loading={loading}
      />
      <Box>
        <TextField
          type="text"
          label="Full name"
          defaultValue={userName}
          variant="outlined"
          margin="dense"
          disabled
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
