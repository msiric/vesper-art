import { makeStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as RedirectUser } from "../../assets/images/illustrations/redirect_user.svg";
import MainHeading from "../../components/MainHeading";
import SyncButton from "../../components/SyncButton";
import Card from "../../domain/Card";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const useRedirectStyles = makeStyles((muiTheme) => ({
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

const Redirect = () => {
  const globalClasses = globalStyles();
  const classes = useRedirectStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card className={classes.card}>
            <MainHeading text="Can't find requested resource" />
            <RedirectUser className={classes.illustration} />
            <SyncButton
              component={RouterLink}
              to="/"
              className={classes.button}
            >
              Go home
            </SyncButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Redirect;
