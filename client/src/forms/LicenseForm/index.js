import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  renderCommercialLicenses,
  renderFreeLicenses,
} from "../../../../common/helpers";
import SelectInput from "../../controls/SelectInput/index";
import TextInput from "../../controls/TextInput/index";

const LicenseFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  artwork: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  root: {
    display: "flex",
    width: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  details: {
    display: "flex",
    width: "100%",
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    width: "100%",
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: "right",
  },
  manageLicenses: {
    padding: "8px 16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
}));

const LicenseForm = ({ version, errors, isFree, loading }) => {
  const classes = LicenseFormStyles();

  return (
    <Box>
      <TextInput
        name="licenseAssignee"
        type="text"
        label="License assignee"
        errors={errors}
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
