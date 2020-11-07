import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { app } from "../../../../common/constants.js";
import MainHeading from "../../components/MainHeading";
import globalStyles from "../../styles/global.js";

const Selling = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading text={`Selling on ${app.name}`} />
          <Typography>
            {`Get up to speed with how ${app.name} works in six steps from both the
            seller's and buyer's perspective.`}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Selling;
