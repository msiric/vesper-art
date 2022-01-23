import React from "react";
import CircularProgress from "../../domain/CircularProgress";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import loadingSpinnerStyles from "./styles";

const LoadingSpinner = ({ label, styles, customPadding = false }) => {
  const classes = loadingSpinnerStyles();

  return (
    <Container
      className={`${classes.container} ${
        customPadding && classes.customPadding
      } ${styles}`}
    >
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
