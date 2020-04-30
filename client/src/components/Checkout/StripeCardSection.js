import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeElementWrapper from './StripeElementWrapper';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISH);

const StripeCardSection = () => {
  return (
    <Elements stripe={stripePromise}>
      <Grid container>
        <Grid item xs={12}>
          <StripeElementWrapper
            label="Card Number"
            component={CardNumberElement}
          />
        </Grid>
        <Grid item xs={7}>
          <StripeElementWrapper
            label="Expiry (MM / YY)"
            component={CardExpiryElement}
          />
        </Grid>
        <Grid item xs={5}>
          <StripeElementWrapper label="CVC" component={CardCvcElement} />
        </Grid>
      </Grid>
    </Elements>
  );
};

export default StripeCardSection;
