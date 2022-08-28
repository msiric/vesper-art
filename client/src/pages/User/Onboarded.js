import OnboardedCard from "@containers/OnboardedCard";
import { useUserOnboarded } from "@contexts/local/userOnboarded";
import { containsErrors, renderError } from "@utils/helpers";
import React, { useEffect } from "react";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const Onboarded = ({ location }) => {
  const retry = useUserOnboarded((state) => state.details.error.retry);
  const redirect = useUserOnboarded((state) => state.details.error.redirect);
  const message = useUserOnboarded((state) => state.details.error.message);
  const resetDetails = useUserOnboarded((state) => state.resetDetails);

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetDetails();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <OnboardedCard />
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default Onboarded;
