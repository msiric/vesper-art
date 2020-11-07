import { Button, Card, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { app } from "../../../../common/constants.js";
import MainHeading from "../../components/MainHeading";
import globalStyles from "../../styles/global.js";

const Buying = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading text={`Buying on ${app.name}`} />
          <Typography>
            {`Get up to speed with how ${app.name} works in six steps from both the
            seller's and buyer's perspective.`}
          </Typography>
        </Grid>
        <Grid item sm={12} md={6}>
          <Card>
            <MainHeading text="Sellers" style={{ textAlign: "center" }} />
          </Card>
        </Grid>
        <Grid item sm={12} md={6}>
          <Card>
            <MainHeading text="Buyers" style={{ textAlign: "center" }} />
          </Card>
        </Grid>
        <Grid item sm={12}>
          <Typography>Join the platform and get started</Typography>
          <Button variant="outlined">Sign up</Button>
          <Typography>
            Want to learn more? Click on one of the pages below
          </Typography>
          <Button variant="outlined">{`Selling on ${app.name}`}</Button>
          <Button variant="outlined">{`Buying on ${app.name}`}</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Buying;
