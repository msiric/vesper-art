import { makeStyles } from "@material-ui/core";
import { HomeOutlined as HomeIcon } from "@material-ui/icons";
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

const NotFound = () => {
  const globalClasses = globalStyles();
  const classes = useNotFoundStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container>
        <Grid item sm={12} className={classes.wrapper}>
          <Card className={classes.card}>
            <MainHeading text="Page not found" />
            <FourOhFour className={classes.illustration} />
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

export default NotFound;
