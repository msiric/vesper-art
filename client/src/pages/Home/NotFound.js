import Typography from "@domain/Typography";
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

const NotFound = () => {
  const globalClasses = globalStyles();
  const classes = useNotFoundStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.wrapper}>
          <Card className={classes.card}>
            <Typography className={classes.heading} variant="h2">
              404
            </Typography>
            <MainHeading text="Page not found" align="center" />
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
