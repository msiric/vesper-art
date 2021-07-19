import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  renderCommercialLicenses,
  renderFreeLicenses,
} from "../../../../common/helpers";
import SelectInput from "../../controls/SelectInput/index";
import TextInput from "../../controls/TextInput/index";
import TextField from "../../domain/TextField";

const LicenseForm = ({ version, errors, isFree, userName, loading }) => {
  return (
    <Box>
      <TextField
        type="text"
        label="License assignee"
        defaultValue={userName}
        variant="outlined"
        margin="dense"
        disabled={true}
        inputProps={{ readOnly: true }}
        fullWidth
        loading={loading}
      />
      <TextInput
        name="licenseCompany"
        type="text"
        label="License company"
        errors={errors}
        loading={loading}
      />
      <SelectInput
        name="licenseType"
        label="License type"
        errors={errors}
        options={
          isFree
            ? renderFreeLicenses({ version })
            : renderCommercialLicenses({ version })
        }
        loading={loading}
      />
    </Box>
  );
};

export default LicenseForm;
