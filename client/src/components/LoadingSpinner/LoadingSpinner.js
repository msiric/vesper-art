import { CircularProgress, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  loadingSpinnerItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  loadingSpinnerCircle: {
    "&>svg": {
      color: "rgba(255, 255, 255, 0.31)",
    },
  },
});

const LoadingSpinner = () => {
  const classes = useStyles();

  return (
    <Container className={classes.loadingSpinnerContainer}>
      <Grid container className={classes.loadingSpinnerGrid} spacing={2}>
        <Grid item xs={12} className={classes.loadingSpinnerItem}>
          <CircularProgress className={classes.loadingSpinnerCircle} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingSpinner;
