import { makeStyles } from "@material-ui/core";
import { ShoppingBasketOutlined as BuyingIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  appName,
  featureFlags,
  unavailableMessage,
} from "../../../../common/constants";
import HelpBox from "../../components/HelpBox";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useFAQStyling = makeStyles((muiTheme) => ({
  heading: {
    marginTop: 16,
    textDecoration: "underline",
  },
  bold: {
    fontWeight: "bold",
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

const FAQ = () => {
  const globalClasses = globalStyles();
  const classes = useFAQStyling();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item sm={12}>
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
          <Typography variant="h4">FAQ</Typography>
          <Typography variant="h5" className={classes.heading}>
            Account management
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`Is my personal information safe?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Your privacy is important and taken seriously on ${appName}. You can read the Privacy Policy for more information. The Privacy Policy is part of the website's Terms of Service.`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`How do I change/reset my password?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Go to the Settings page and under the password section enter and save the new password.
            If you don’t remember your password, you can reset it from the Account Restoration page.
            On the Login page, click on the „Trouble logging in?“ link and follow the instructions to reset your password.`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`How do I close my account?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Similarly to changing the password, you can also deactivate your account on the Settings page.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Payments and withdrawals
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`How long does it take for me to receive revenues from an order?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`All transactions are processed by ${appName}'s partner, Stripe. 
            Stripe is in charge of securing, processing and verifying payments on the platform which can take longer than usual depending on the circumstances. 
            Head to your Stripe's dashboard and verify the current status of your funds at any time. `}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`Are there any fees when withdrawing revenue?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Stripe charges a fee of 0.25% of the payout volume + 25¢ for withdrawing your funds to your bank account.`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`Do I have to pay taxes on income earned on ${appName}?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`It is the sole responsibility of artists to verify their personal tax obligation, report, and pay taxes according to the laws of the state and/or country of residence, as applicable and required by local law and regulations.`}
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Platform-specific questions
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`What are artwork licenses and what is their purpose?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`You can find all the necessary information regarding the licenses and the way they work here.`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`How do I become an artist on the platform and start uploading my artwork?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`You can learn more about becoming an artist on ${appName} and uploading your art by clicking on this link.`}
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            {`Why are some artwork only available for preview while others are downloadable free of charge?`}
          </Typography>
          <Typography className={classes.paragraph}>
            {`This depends solely on the artist. If an artist chooses to upload their artwork as „preview only“, then you can only preview the art without the option of downloading or buying it. 
            On the other hand, an artist can choose to offer the artwork's licenses free of charge or charge a price for a specific license depending on the options selected.`}
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
                startIcon={<BuyingIcon />}
              >{`Buying on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FAQ;
