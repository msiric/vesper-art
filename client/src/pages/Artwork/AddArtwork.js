import React, { useEffect } from "react";
import MainHeading from "../../components/MainHeading/index.js";
import ArtworkCreator from "../../containers/ArtworkCreator/index.js";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global.js";
import { containsErrors, renderError } from "../../utils/helpers.js";

const AddArtwork = () => {
  const retry = useArtworkCreate((state) => state.capabilities.error.retry);
  const redirect = useArtworkCreate(
    (state) => state.capabilities.error.redirect
  );
  const message = useArtworkCreate((state) => state.capabilities.error.message);
  const resetCapabilities = useArtworkCreate(
    (state) => state.resetCapabilities
  );

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetCapabilities();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading
            text="Add artwork"
            className={globalClasses.mainHeading}
          />
          <ArtworkCreator />
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message })
  );
};

export default AddArtwork;
