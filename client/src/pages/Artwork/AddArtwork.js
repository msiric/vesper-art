import { Container, Grid } from "@material-ui/core";
import React from "react";
import MainHeading from "../../components/MainHeading/index.js";
import ArtworkCreator from "../../containers/ArtworkCreator/index.js";
import globalStyles from "../../styles/global.js";

const AddArtwork = () => {
  const globalClasses = globalStyles();

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
