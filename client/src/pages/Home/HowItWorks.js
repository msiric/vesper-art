import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import Undraw from "react-undraw";
import globalStyles from "../../styles/global.js";

const HowItWorks = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container>
        <Grid item sm={12}>
          <Typography>How it works</Typography>
          <Undraw name="coding" />;
        </Grid>
      </Grid>
    </Container>
  );
};

export default HowItWorks;
