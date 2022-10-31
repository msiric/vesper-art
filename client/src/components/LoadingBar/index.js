import React from "react";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import LinearProgress from "../../domain/LinearProgress";
import Typography from "../../domain/Typography";
import loadingBarStyles from "./styles";

const LoadingBar = ({ label, styles }) => {
  const classes = loadingBarStyles();

  return (
    <Container className={`${classes.container} ${styles}`}>
      <Grid container>
        <Grid item xs={12} className={classes.item}>
          <LinearProgress className={classes.bar} />
          {label && <Typography className={classes.label}>{label}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingBar;
