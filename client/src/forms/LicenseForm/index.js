import { Box } from "@material-ui/core";
import React from "react";
import {
  renderCommercialLicenses,
  renderFreeLicenses,
} from "../../../../common/helpers";
import SelectInput from "../../controls/SelectInput/index";
import TextInput from "../../controls/TextInput/index";
import TextField from "../../domain/TextField";

const LicenseForm = ({
  version,
  errors,
  isFree,
  userName,
  watchables,
  loading,
}) => {
  const { licenseUsage } = watchables;

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
      <SelectInput
        name="licenseUsage"
        label="License usage"
        errors={errors}
        options={[
          {
            value: "individual",
            text: "Individual",
          },
          {
            value: "business",
            text: "Business",
          },
        ]}
        loading={loading}
      />
      {licenseUsage === "business" && (
        <TextInput
          name="licenseCompany"
          type="text"
          label="License company"
          errors={errors}
          loading={loading}
        />
      )}
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
