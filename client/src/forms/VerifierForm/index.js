import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import TextInput from "../../controls/TextInput";
import Box from "../../domain/Box";
import Grid from "../../domain/Grid";

const verifierFormStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
  },
  assignee: {
    marginRight: 6,
  },
  assignor: {
    marginLeft: 6,
  },
}));

const VerifierForm = ({ errors, loading }) => {
  const classes = verifierFormStyles();

  return (
    <Box>
      <TextInput
        name="licenseFingerprint"
        type="text"
        label="Enter license fingerprint"
        errors={errors}
        loading={loading}
      />
      <Grid className={classes.container}>
        <TextInput
          className={classes.assignee}
          name="assigneeIdentifier"
          type="text"
          label="Enter assignee identifier"
          errors={errors}
          loading={loading}
        />
        <TextInput
          className={classes.assignor}
          name="assignorIdentifier"
          type="text"
          label="Enter assignor identifier"
          errors={errors}
          loading={loading}
        />
      </Grid>
    </Box>
  );
};

export default VerifierForm;
