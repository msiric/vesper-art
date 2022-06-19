import React from "react";
import CircularProgress from "../../domain/CircularProgress";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import loadingSpinnerStyles from "./styles";

const LoadingSpinner = ({ label = "", height, margin }) => {
  const classes = loadingSpinnerStyles({ height, margin });

  return (
    <Container className={classes.container}>
      <Grid container>
        <Grid item xs={12} className={classes.item}>
          <CircularProgress className={classes.circle} />
          {label && <Typography className={classes.label}>{label}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingSpinner;
