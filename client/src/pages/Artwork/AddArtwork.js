import React, { useEffect } from "react";
import MainHeading from "../../components/MainHeading/index.js";
import ArtworkCreator from "../../containers/ArtworkCreator/index.js";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global.js";

const AddArtwork = () => {
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

  return (
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
  );
};

export default AddArtwork;
