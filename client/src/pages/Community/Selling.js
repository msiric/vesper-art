import { makeStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName, payment } from "../../../../common/constants";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useSellingStyles = makeStyles((muiTheme) => ({
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

const Selling = () => {
  const globalClasses = globalStyles();
  const classes = useSellingStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h4">{`Selling on ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            {`Signing up is free and required for users to start selling art on 
            ${appName}. When you sign up, you will be able to download, 
            purchase and upload your own artwork. 
            Your art can be published as preview only, which allows users to only view your 
            artwork without downloading or purchasing, or available for download, which allows 
            users to download your artwork for free or purchase it, depending on your preferences.
            Additionally, you have complete control over the art you are publishing, 
            including the types of licenses you want to include and how much 
            to charge for each type.
            If you choose to publish your artwork as available for download, you may offer
            a personal license, which allows the user to $TODO include personal license permissions,
            and/or a commercial license, which allows the user to $TODO include commercial license 
            permissions.
            In order to monetize your art, you will have to go through the 
            onboarding process where you will be taken to Stripe to finalize 
            your account setup and receive future payments.
            Whenever an order is placed, commercial or free, the buyer will receive
            a license for using your artwork in compliance with the license's permissions
            along with the actual artwork.
            Every license that was ever generated can be verified using the platform's 
            verifer system to ensure that your art is never stolen or used in a way that 
            is outside the scope of what the license permits.
            This way, both you and the license assignee are protected.
            When a commercial order is placed, you as a seller will receive 
            ${(1 - payment.appFee) * 100}% of the total order value.
            For example, if you price your artwork at $100 for personal or commercial usage, 
            you will receive $${
              (1 - payment.appFee) * 100
            } once your artwork has been purchased.
            Your funds will appear in your Stripe account after 7 days (due to processing and 
            handling disputes).
            For more information, see the Terms of Service.`}
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              {`Learn about buying on ${appName}`}
            </Typography>
            <Box className={classes.buttons}>
              <SyncButton
                component={RouterLink}
                to="/start_buying"
              >{`Buying on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Selling;
