import React from "react";
import CircularProgress from "../../domain/CircularProgress";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import loadingSpinnerStyles from "./styles";

const LoadingSpinner = ({ label = "", height = 0 }) => {
  const classes = loadingSpinnerStyles({ height });

  return (
    <Container className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.item}>
          <CircularProgress className={classes.circle} />
          {label && <Typography className={classes.label}>{label}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingSpinner;
