import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import TextInput from "../../controls/TextInput";
import Box from "../../domain/Box";
import Grid from "../../domain/Grid";

const verifierFormStyles = makeStyles((muiTheme) => ({
  container: {
    display: "flex",
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  assignee: {
    marginRight: 6,
    [muiTheme.breakpoints.down("xs")]: {
      marginRight: 0,
    },
  },
  assignor: {
    marginLeft: 6,
    [muiTheme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
}));

const VerifierForm = ({ getValues, errors, loading }) => {
  const classes = verifierFormStyles();

  return (
    <Box>
      <TextInput
        value={getValues("licenseFingerprint")}
        name="licenseFingerprint"
        type="text"
        label="License fingerprint"
        errors={errors}
        loading={loading}
      />
      <Grid className={classes.container}>
        <TextInput
          value={getValues("assigneeIdentifier")}
          className={classes.assignee}
          name="assigneeIdentifier"
          type="text"
          label="Assignee identifier"
          errors={errors}
          loading={loading}
        />
        <TextInput
          value={getValues("assignorIdentifier")}
          className={classes.assignor}
          name="assignorIdentifier"
          type="text"
          label="Assignor identifier"
          errors={errors}
          loading={loading}
        />
      </Grid>
    </Box>
  );
};

export default VerifierForm;
