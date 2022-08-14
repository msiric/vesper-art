import cardLogos from "@components/PaymentCards/index";
import Typography from "@domain/Typography";
import { Grid } from "@material-ui/core";
import { SecurityOutlined as SecureIcon } from "@material-ui/icons";
import React from "react";
import paymentDisclaimerStyles from "./styles";

const PaymentDisclaimer = () => {
  const classes = paymentDisclaimerStyles();

  return (
    <>
      <Grid container spacing={2} className={classes.container}>
        <Grid className={classes.cards} item xs={12}>
          {cardLogos.map((card) => (
            <img key={card} src={card} width="50px" style={{ padding: 6 }} />
          ))}
        </Grid>
        <Grid className={classes.wrapper} item xs={12} sm={9}>
          <SecureIcon className={classes.icon} />
          <Typography className={classes.disclaimer}>
            Payments made on this site are sent through a secured connection and
            processed by Stripe. This site is compliant with the Payment Card
            Industry and Data Security Standard. Read more about Stripe security
            &nbsp;
            <a
              className={classes.redirect}
              href="https://stripe.com/docs/security"
            >
              here
            </a>
            .
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentDisclaimer;
