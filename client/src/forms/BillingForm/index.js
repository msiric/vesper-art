import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { countries } from "../../../../common/constants.js";
import AutocompleteInput from "../../controls/AutocompleteInput/index.js";
import TextInput from "../../controls/TextInput/index.js";

const BillingFormStyles = makeStyles((muiTheme) => ({
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
