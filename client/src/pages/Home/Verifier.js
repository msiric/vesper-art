import { Container, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React from "react";
import LicenseSection from "../../containers/LicenseSection/index.js";
import VerifierCard from "../../containers/VerifierCard/index.js";
import globalStyles from "../../styles/global.js";

const Verifier = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container>
        <Grid item xs={12}>
          <VerifierCard />
          <LicenseSection />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withSnackbar(Verifier);
