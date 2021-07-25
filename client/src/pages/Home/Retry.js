import { makeStyles } from "@material-ui/core";
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
    marginTop: muiTheme.spacing(4),
    height: 350,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: muiTheme.spacing(2),
  },
  button: {
    marginTop: muiTheme.spacing(4),
  },
}));

const Retry = ({ message, reinitializeState = window.location.reload }) => {
  const globalClasses = globalStyles();
  const classes = useRetryStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card className={classes.card}>
            <MainHeading text="An error occurred" />
            <RedirectUser className={classes.illustration} />
            <SyncButton onClick={reinitializeState} className={classes.button}>
              Try again
            </SyncButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Retry;
