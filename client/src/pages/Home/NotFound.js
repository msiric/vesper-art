import { makeStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as FourOhFour } from "../../assets/images/illustrations/not_found.svg";
import MainHeading from "../../components/MainHeading";
import SyncButton from "../../components/SyncButton";
import Card from "../../domain/Card";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const useNotFoundStyles = makeStyles((muiTheme) => ({
  illustration: {
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

const NotFound = () => {
  const globalClasses = globalStyles();
  const classes = useNotFoundStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card className={classes.card}>
            <MainHeading text="Page not found" />
            <FourOhFour className={classes.illustration} />
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

export default NotFound;
