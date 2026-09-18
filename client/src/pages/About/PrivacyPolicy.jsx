import { makeStyles } from "@material-ui/core";
import React from "react";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const usePrivacyStyles = makeStyles((muiTheme) => ({
  heading: {
    marginTop: 16,
    textDecoration: "underline",
  },
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
    marginBottom: 16,
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: "1.8rem",
    },
  },
}));

const PrivacyPolicy = () => {
  const globalClasses = globalStyles();
  const classes = usePrivacyStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Privacy policy</Typography>
          <Typography className={classes.paragraph}>
            This page describes how data is handled in this version of Vesper.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Accounts and shared content
          </Typography>
          <Typography className={classes.paragraph}>
            Starting a session creates a temporary account with a generated identity. No email address, password or payment card is requested, and no email is sent.
          </Typography>
          <Typography className={classes.paragraph}>
            Uploaded artwork, comments and profile details can be visible to other visitors. Use only non-sensitive test content you have permission to share; do not enter personal information.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Retention
          </Typography>
          <Typography className={classes.paragraph}>
            Accounts expire after 24 hours. Expired records are removed when a later session starts. Signing out ends your session but does not immediately delete its content. Do not use Vesper to store anything you need to keep.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Cookies and browser storage
          </Typography>
          <Typography className={classes.paragraph}>
            Vesper uses an essential session cookie, a browser session flag and local display preferences. There is no advertising or application analytics.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Hosting and request data
          </Typography>
          <Typography className={classes.paragraph}>
            The hosting providers process request metadata such as IP addresses. The API uses temporary IP-based counters to limit abuse. External websites linked from Vesper have their own privacy practices.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PrivacyPolicy;
