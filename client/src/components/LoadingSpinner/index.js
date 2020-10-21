import { CircularProgress, Container, Grid } from "@material-ui/core";
import React from "react";
import loadingSpinnerStyles from "./styles";

const LoadingSpinner = ({ padding }) => {
  const classes = loadingSpinnerStyles();

  return (
    <Container
      className={classes.loadingSpinnerContainer}
      style={{ padding: padding ? padding : 0 }}
    >
      <Grid container className={classes.loadingSpinnerGrid} spacing={2}>
        <Grid
          item
          xs={12}
          className={classes.loadingSpinnerItem}
          style={{ padding: "32px 0" }}
        >
          <CircularProgress className={classes.loadingSpinnerCircle} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingSpinner;
