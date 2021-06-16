import React from "react";
import TokenVerifier from "../../containers/TokenVerifier/index.js";
import { useUserToken } from "../../contexts/local/userToken";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import { containsErrors, renderError } from "../../utils/helpers.js";

const VerifyToken = ({ match, location }) => {
  const retry = useUserToken((state) => state.token.error.retry);
  const redirect = useUserToken((state) => state.token.error.redirect);
  const message = useUserToken((state) => state.token.error.message);

  const paramId = match.params.id;

  return !containsErrors(retry, redirect) ? (
    <Container key={location.key}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TokenVerifier paramId={paramId} />
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message })
  );
};

export default VerifyToken;
