import React, { useEffect } from "react";
import MainHeading from "../../components/MainHeading/index";
import ArtworkCreator from "../../containers/ArtworkCreator/index";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const AddArtwork = () => {
  const retry = useArtworkCreate((state) => state.requirements.error.retry);
  const redirect = useArtworkCreate(
    (state) => state.requirements.error.redirect
  );
  const message = useArtworkCreate((state) => state.requirements.error.message);
  const resetRequirements = useArtworkCreate(
    (state) => state.resetRequirements
  );

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetRequirements();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainHeading text="Add artwork" />
          <ArtworkCreator />
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default AddArtwork;
