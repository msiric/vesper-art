import { makeStyles } from "@material-ui/core";
import React from "react";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useTermsStyles = makeStyles((muiTheme) => ({
  heading: {
    marginTop: 16,
    textDecoration: "underline",
  },
  paragraph: {
    marginTop: 16,
  },
  bold: {
    fontWeight: "bold",
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
  uppercase: {
    textTransform: "uppercase",
  },
}));

const TermsOfService = () => {
  const globalClasses = globalStyles();
  const classes = useTermsStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Terms of service</Typography>
          <Typography variant="h5" className={classes.heading}>
            Using this version
          </Typography>
          <Typography className={classes.paragraph}>
            Vesper is available here as an interactive demonstration. You can browse artwork and use a temporary account to try uploading, commenting, collecting and the order workflow.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Content
          </Typography>
          <Typography className={classes.paragraph}>
            Use only non-sensitive test content you have permission to upload. Artwork, comments and profile details may be visible to other visitors. Do not upload private information or content you need to preserve.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Orders and licenses
          </Typography>
          <Typography className={classes.paragraph}>
            Prices, purchases, receipts and licenses are simulated. No money is collected, seller payouts are unavailable, and no real usage rights are granted. A verification result only checks a matching record in this application. The sample artwork is for viewing here.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Temporary accounts and availability
          </Typography>
          <Typography className={classes.paragraph}>
            Accounts expire after 24 hours; expired records are removed when a later session starts. Signing out does not immediately erase content. Usage limits apply, and the live service may sleep or become unavailable. The bundled gallery remains available for browsing.
          </Typography>
          <Typography className={classes.paragraph}>
            The Privacy Policy explains how account content, cookies and request data are handled.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TermsOfService;
