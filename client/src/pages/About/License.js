import { makeStyles } from "@material-ui/core";
import React from "react";
import {
  appName,
  featureFlags,
  unavailableMessage,
} from "../../../../common/constants";
import HelpBox from "../../components/HelpBox";
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
        <Grid item sm={12}>
          {!featureFlags.stripe && (
            <HelpBox
              type="alert"
              label={unavailableMessage}
              margin="0 0 12px 0"
            />
          )}
          <Typography variant="h4">License information</Typography>
          <Typography className={classes.paragraph}>
            {`When downloading or purchasing artwork on ${appName}, you will be assigned a license based on the information you entered. 
            This allows you to prove ownership and define the boundaries of how you're allowed to use said artwork.
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Additionally, this also allows you to download the artwork's digital file on as many devices as you like, as long as you are the one using it.
            A license can be assigned to an individual, meaning to you personally, or to a business, which allows your business to use the license while being assigned to your name.
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Every user that signs up to ${appName} has to provide their full name which cannot be changed and is automatically prefilled and saved for every generated license.
            This helps identify every user and the licenses said user owns, but doesn't reveal any sensitive information unless said user explicitly shares the identifer value to do so, as explained below:
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Every generated license contains a license fingerprint, an assignor identifier and an assignee identifier. These values are used by either the artist or the collector to verify the license information.
            Entering the license fingerprint on the platform's verifier will reveal basic information about the license, the buyer (collector) and the seller (artist) of the artwork in question.
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`In addition to the above, both the artist (license assignor) and the collector (license assignee), will receive identifiers that are unique to that specific license.
            These identifiers are different for each license and reveal the full name of their respective owner. They should be kept secret and not shared with anyone since they are used to display sensitive license information.
            When an identifier is entered in the platform's verifier alongside the license fingerprint, all the information about the license is revealed, including that of the identifier's owner.
            If a dispute about a specific license or order ever arises, you can then share your identifier with the other party in order to verify additional license information and prove the authenticity of your ownership.
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`This way of handling things allows for a robust system with clearly defined permissions and restrictions, which is necessary in order to protect both the artists and the collectors.
            `}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LicenseInformation;
