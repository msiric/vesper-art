import { makeStyles } from "@material-ui/core";
import { ShoppingBasketOutlined as BuyingIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  appName,
  featureFlags,
  payment,
  unavailableMessage,
} from "../../../../common/constants";
import HelpBox from "../../components/HelpBox";
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
    marginTop: 8,
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
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {
            // FEATURE FLAG - stripe
            !featureFlags.stripe && (
              <HelpBox
                type="alert"
                label={unavailableMessage}
                margin="0 0 12px 0"
              />
            )
          }
          <Typography variant="h4">{`Selling on ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            {`Signing up is free and required for artists to start selling art on ${appName}. When you sign up, you will be able to upload, sell and control the way users interact with your artwork. 
            Your art can be published as „preview only“, which allows users to only view your artwork without downloading or purchasing, or „available for download“, which allows users to purchase or download your artwork for free, depending on your preferences. 
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Additionally, you have complete control over the art you are publishing, including the types of licenses you want to include and how much to charge for each type. If you choose to publish your artwork as „available for download“, 
            you may offer and charge for a personal license (which allows users to use the artwork for display on personal websites and computers, or making image prints or video copies for personal use without charging money, collecting fees, 
            or receiving any form of remuneration) and/or a commercial license (which allows users to use the artwork for business related activities such as advertising, promotion, creating web pages, integration into product, software or other business related tools). 
           `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`In order to monetize your art, you will have to go through the onboarding process where you will be taken to Stripe, ${appName}'s partner in charge of handling, securing and processing payments on the platform, to finalize your account setup and receive future payments. 
            Whenever an order is placed, commercial or free, the buyer (collector) will receive a license for using your artwork in compliance with the license's permissions along with the actual digital file of the artwork in question. 
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Every license that was ever generated on the platform can be verified using the platform's verifer system to ensure that your art is never stolen or used in a way that is outside the scope of what the license permits. 
            This way, both you, the artist, and the license assignee are protected. When a commercial order is placed, you as a seller (artist) will receive ${
              (1 - payment.appFee) * 100
            }% of the total order value while the rest goes to the platform. For example, if you price your artwork's personal or commercial license at $100, you will receive $${
              (1 - payment.appFee) * 100
            } once the license has been purchased. Your funds will appear in your Stripe account shortly after being processed.`}
          </Typography>
          <Typography className={classes.paragraph}>
            For more information, see the Terms of Service.
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

export default Selling;
