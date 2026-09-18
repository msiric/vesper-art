import { makeStyles } from "@material-ui/core";
import { ShoppingBasketOutlined as BuyingIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName } from "../../../../common/constants";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useAboutStyling = makeStyles((muiTheme) => ({
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

const About = () => {
  const globalClasses = globalStyles();
  const classes = useAboutStyling();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{`What is ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            Vesper is on a mission to transform the way artists upload, showcase and sell their artwork.
          </Typography>
          <Typography className={classes.paragraph}>
            As an artist, you can upload your artwork and control how it is displayed and interacted with. Choose “preview only” to showcase a piece, or “available for download” to explore the collection and licensing workflow.
          </Typography>
          <Typography className={classes.paragraph}>
            As a collector, you can explore new artwork, interact with artists, save favorites and build a gallery of the pieces you collect.
          </Typography>
          <Typography className={classes.paragraph}>
            This version lets you try those features with a temporary account. Orders and licenses are simulated; payments and seller payouts are unavailable.
          </Typography>
          <Typography className={classes.paragraph}>
            Each sample license has a fingerprint you can look up in the verifier to explore the order details. These records demonstrate the workflow and do not grant usage rights.
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              {`Learn about buying on ${appName}`}
            </Typography>
            <Box className={classes.buttons}>
              <SyncButton
                variant="text"
                component={RouterLink}
                to="/start_buying"
                startIcon={<BuyingIcon />}
              >{`Buying on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
