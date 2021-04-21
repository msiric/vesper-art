import { Container, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useEffect } from "react";
import LicenseSection from "../../containers/LicenseSection/index.js";
import VerifierCard from "../../containers/VerifierCard/index.js";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import globalStyles from "../../styles/global.js";

const Verifier = () => {
  const resetToken = useLicenseVerifier((state) => state.resetToken);

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetToken();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

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
