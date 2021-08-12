import React from "react";
import CircularProgress from "../../domain/CircularProgress";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import loadingSpinnerStyles from "./styles";

const LoadingSpinner = ({ customPadding = false }) => {
  const classes = loadingSpinnerStyles();

  return (
    <Container
      className={`${classes.container} ${
        customPadding && classes.customPadding
      }`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.item}>
          <CircularProgress className={classes.circle} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingSpinner;
