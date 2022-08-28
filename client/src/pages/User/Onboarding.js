import OnboardingCard from "@containers/OnboardingCard";
import React from "react";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const Onboarding = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <OnboardingCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarding;
