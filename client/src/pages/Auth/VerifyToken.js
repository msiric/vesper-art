import React from "react";
import TokenVerifier from "../../containers/TokenVerifier/index.js";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";

const VerifyToken = ({ match, location }) => {
  const paramId = match.params.id;

  return (
    <Container key={location.key}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TokenVerifier paramId={paramId} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default VerifyToken;
