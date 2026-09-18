import { makeStyles } from "@material-ui/core";
import React from "react";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useLicenseStyles = makeStyles((muiTheme) => ({
  paragraph: {
    marginTop: 16,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0 auto",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
      height: 80,
    },
  },
  label: {
    marginTop: 8,
    marginBottom: 16,
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: "1.8rem",
    },
  },
}));

const LicenseInformation = () => {
  const globalClasses = globalStyles();
  const classes = useLicenseStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">License information</Typography>
          <Typography className={classes.paragraph}>
            Vesper connects artwork, artists and collectors through an order-and-license workflow. Each license record identifies the artwork, its artist and its collector.
          </Typography>
          <Typography className={classes.paragraph}>
            In this version, licenses and receipts are simulated. Creating an order, downloading a file or getting a verification result does not grant personal or commercial usage rights. Sample artwork is provided for viewing here.
          </Typography>
          <Typography className={classes.paragraph}>
            A license fingerprint lets you look up basic order information in the verifier. The assignor identifier belongs to the artist; the assignee identifier belongs to the collector. Supplying a matching identifier reveals the corresponding details stored with that record.
          </Typography>
          <Typography className={classes.paragraph}>
            Temporary accounts use generated identities. Use test details only, and avoid sharing identifiers publicly. Verification checks the matching record in this application; it does not establish ownership or authenticity outside it.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LicenseInformation;
