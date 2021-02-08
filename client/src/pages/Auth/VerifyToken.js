import { Container, Grid } from "@material-ui/core";
import React from "react";
import TokenVerifier from "../../containers/TokenVerifier/index.js";

const VerifyToken = ({ match, location }) => {
  const paramId = match.params.id;
  const classes = {};

  return (
    <Container key={location.key} className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12} className={classes.loader}>
          <TokenVerifier paramId={paramId} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default VerifyToken;
