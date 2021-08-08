import { makeStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName } from "../../../../common/constants";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useBuyingStyles = makeStyles((muiTheme) => ({
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

const Buying = () => {
  const globalClasses = globalStyles();
  const classes = useBuyingStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h4">{`Buying on ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            {`Signing up is free and required for users to start downloading and purchasing
            art on ${appName}. When you sign up, you will be able to download, 
            purchase and upload your own artwork. 
            When browsing artwork, pay attention to the their type and availability.
            Artists can upload art as preview only, which allows you to only view the 
            artwork without downloading or purchasing, or available for download, which allows 
            you to download the artwork for free or purchase it, depending on the type of the artwork.
            If an artwork is published as available for download, the artist may offer
            a personal license, which allows you to $TODO include personal license permissions,
            and/or a commercial license, which allows you to $TODO include commercial license 
            permissions.
            A license may be free of charge which will allow you to download the artwork
            for free compared to a billable license, which you will have to purchase.
            In both cases, you will have to fill out the necessary license information in order to
            receive both the artwork you picked and the license along with it.
            This allows you to prove that you are the legitimate owner of the artwork and
            that you can use it as specified in the license's permissions, so make sure you
            store it somewhere safe.
            In addition to the above, you can verify your licenses using the platform's verifier
            system to ensure the authenticity and non-repudiation of your ownership.
            Every billable order you place will be subject to the ${appName}'s service fee, which
            will be displayed on the checkout page before you confirm your payment.
            For more information, see the Terms of Service.`}
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              {`Learn about selling on ${appName}`}
            </Typography>
            <Box className={classes.buttons}>
              <SyncButton
                component={RouterLink}
                to="/start_selling"
              >{`Selling on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Buying;
