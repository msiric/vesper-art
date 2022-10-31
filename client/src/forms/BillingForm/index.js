import Grid from "@domain/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { countries } from "../../../../common/constants";
import AutocompleteInput from "../../controls/AutocompleteInput/index";
import TextInput from "../../controls/TextInput/index";

const billingFormStyles = makeStyles((muiTheme) => ({
  container: {
    "&>div": {
      padding: "0px 8px !important",
    },
  },
}));

const BillingForm = ({ errors, setValue, getValues, loading }) => {
  const classes = billingFormStyles();

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12} sm={6}>
        <TextInput
          name="billingName"
          type="text"
          label="First name"
          errors={errors}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput
          name="billingSurname"
          type="text"
          label="Last name"
          errors={errors}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name="billingEmail"
          type="text"
          label="Email address"
          errors={errors}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          name="billingAddress"
          type="text"
          label="Street address"
          errors={errors}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput
          name="billingZip"
          type="text"
          label="Zip code"
          errors={errors}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput
          name="billingCity"
          type="text"
          label="City"
          errors={errors}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12}>
        <AutocompleteInput
          value={getValues("billingCountry")}
          setValue={setValue}
          name="billingCountry"
          label="Country"
          errors={errors}
          options={countries}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default BillingForm;
