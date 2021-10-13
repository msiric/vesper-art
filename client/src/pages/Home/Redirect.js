import { makeStyles } from "@material-ui/core";
import { HomeOutlined as HomeIcon } from "@material-ui/icons";
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
    maxHeight: 350,
    height: "100%",
    width: "100%",
    marginTop: muiTheme.spacing(4),
  },
  wrapper: {
    width: "100%",
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
      <Grid container>
        <Grid item sm={12} className={classes.wrapper}>
          <Card className={classes.card}>
            <MainHeading text="Can't find requested resource" />
            <RedirectUser className={classes.illustration} />
            <SyncButton
              component={RouterLink}
              to="/"
              className={classes.button}
              startIcon={<HomeIcon />}
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
