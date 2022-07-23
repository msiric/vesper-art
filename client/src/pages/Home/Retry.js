import Typography from "@domain/Typography";
import { makeStyles } from "@material-ui/core";
import { ReplayRounded as RetryIcon } from "@material-ui/icons";
import React from "react";
import { ReactComponent as RedirectUser } from "../../assets/images/illustrations/server_error.svg";
import MainHeading from "../../components/MainHeading";
import SyncButton from "../../components/SyncButton";
import Card from "../../domain/Card";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const useRetryStyles = makeStyles((muiTheme) => ({
  illustration: {
    height: "100%",
    width: "100%",
    marginTop: muiTheme.spacing(4),
    maxHeight: 440,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 700,
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
    marginTop: muiTheme.spacing(2),
    height: "100%",
  },
  button: {
    marginTop: muiTheme.spacing(4),
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 12,
  },
}));

const Retry = ({ message, reinitializeState = window.location.reload }) => {
  const globalClasses = globalStyles();
  const classes = useRetryStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container>
        <Grid item sm={12} className={classes.wrapper}>
          <Card className={classes.card}>
            <Typography className={classes.heading} variant="h2">
              500
            </Typography>
            <MainHeading text="An error occurred" />
            <RedirectUser className={classes.illustration} />
            <SyncButton
              onClick={reinitializeState}
              startIcon={<RetryIcon />}
              className={classes.button}
            >
              Try again
            </SyncButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Retry;
